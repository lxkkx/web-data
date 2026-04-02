"""
Task management routes.
Mirrors: HomeScreen, CreateNewTaskScreen, EditTaskScreen, TaskDetailScreen,
AllTasksScreen, CalendarScreen, TaskCategoriesScreen, WorkTasksScreen.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, cast, Date, func
from datetime import datetime, date, timedelta, timezone
from typing import Optional, List
import math

from database import get_db
import models, schemas, security

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


# ─── Helper ───

def build_task_response(task: models.Task) -> schemas.TaskResponse:
    assignees = [
        schemas.AssigneeResponse(
            id=a.assignee.id,
            full_name=a.assignee.full_name,
            email=a.assignee.email
        )
        for a in task.assignments
    ]
    loc = None
    if task.location:
        loc = schemas.TaskLocationResponse(
            id=task.location.id,
            latitude=task.location.latitude,
            longitude=task.location.longitude,
            address=task.location.address,
            place_name=task.location.place_name,
            radius_meters=task.location.radius_meters
        )
    return schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        category=task.category,
        priority=task.priority,
        status=task.status,
        due_date=task.due_date,
        daily_reminder=task.daily_reminder,
        is_shared=task.is_shared,
        owner_id=task.owner_id,
        location=loc,
        assignees=assignees,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


# ─── CRUD ───

@router.post("/", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: schemas.TaskCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new task with optional location and assignments.
    Mirrors CreateNewTaskScreen.kt.
    """
    task = models.Task(
        title=task_data.title,
        description=task_data.description,
        category=task_data.category,
        priority=task_data.priority,
        due_date=task_data.due_date,
        daily_reminder=task_data.daily_reminder,
        is_shared=task_data.is_shared,
        owner_id=current_user.id
    )
    db.add(task)
    db.flush()  # get task.id before committing

    # Add location if provided
    if task_data.location:
        loc = models.TaskLocation(
            task_id=task.id,
            user_id=current_user.id,
            latitude=task_data.location.latitude,
            longitude=task_data.location.longitude,
            address=task_data.location.address,
            place_name=task_data.location.place_name,
            radius_meters=task_data.location.radius_meters
        )
        db.add(loc)

    # Assign to users
    if task_data.assign_to:
        for user_id in task_data.assign_to:
            assignment = models.TaskAssignment(
                task_id=task.id,
                assigned_to=user_id,
                assigned_by=current_user.id
            )
            db.add(assignment)
            # Notify the assignee
            assignee = db.query(models.User).filter(models.User.id == user_id).first()
            if assignee:
                notif = models.Notification(
                    user_id=user_id,
                    task_id=task.id,
                    type=models.NotificationType.assignment,
                    title="New task assigned",
                    message=f"{current_user.full_name} assigned you to \"{task.title}\""
                )
                db.add(notif)
                
    # Always notify the creator so they see a notification pop up
    creator_notif = models.Notification(
        user_id=current_user.id,
        task_id=task.id,
        type=models.NotificationType.system,
        title="Task Created Successfully",
        message=f"You added a new task: \"{task.title}\""
    )
    db.add(creator_notif)

    db.commit()
    db.refresh(task)
    return build_task_response(task)


@router.get("/", response_model=list[schemas.TaskResponse])
def get_tasks(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    due_today: Optional[bool] = Query(None),
    shared: Optional[bool] = Query(None),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all tasks for the logged-in user with optional filters.
    Mirrors AllTasksScreen.kt and HomeScreen.kt.
    """
    query = db.query(models.Task).filter(models.Task.owner_id == current_user.id)
    
    # Show all active user tasks regardless of past due dates
    # (Removed the 'today_start' filter so pending past tasks are not hidden)

    if status:
        query = query.filter(models.Task.status == status)
    if category:
        query = query.filter(models.Task.category == category)
    if priority:
        query = query.filter(models.Task.priority == priority)
    if due_today:
        today = date.today()
        tomorrow = today + timedelta(days=1)
        query = query.filter(
            models.Task.due_date >= datetime.combine(today, datetime.min.time()),
            models.Task.due_date < datetime.combine(tomorrow, datetime.min.time())
        )
    if shared is not None:
        query = query.filter(models.Task.is_shared == shared)

    tasks = query.order_by(models.Task.created_at.desc()).all()
    return [build_task_response(t) for t in tasks]


@router.get("/summary", response_model=schemas.TaskSummary)
def get_task_summary(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get today/pending/done counts shown on HomeScreen.kt summary cards.
    """
    today = date.today()
    tomorrow = today + timedelta(days=1)

    today_count = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.due_date >= datetime.combine(today, datetime.min.time()),
        models.Task.due_date < datetime.combine(tomorrow, datetime.min.time())
    ).count()

    pending_count = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.status == models.TaskStatus.pending
    ).count()

    completed_count = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.status == models.TaskStatus.completed
    ).count()

    return schemas.TaskSummary(
        today_count=today_count,
        pending_count=pending_count,
        completed_count=completed_count
    )


@router.get("/calendar", response_model=dict)
def get_calendar_tasks(
    year: int = Query(...),
    month: int = Query(...),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tasks grouped by day for the CalendarScreen.kt.
    Returns {day_number: [tasks]} for the given month.
    """
    from calendar import monthrange
    _, days_in_month = monthrange(year, month)
    start = datetime(year, month, 1)
    end = datetime(year, month, days_in_month, 23, 59, 59)

    today_start = datetime.combine(date.today(), datetime.min.time())
    tasks = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.due_date >= start,
        models.Task.due_date <= end,
        models.Task.due_date >= today_start
    ).all()

    result = {}
    for task in tasks:
        if task.due_date:
            day = task.due_date.day
            if day not in result:
                result[day] = []
            result[day].append(build_task_response(task))

    return result


@router.get("/categories", response_model=dict)
def get_tasks_by_category(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get task counts per category.
    Mirrors TaskCategoriesScreen.kt.
    """
    tasks = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id
    ).all()

    categories: dict = {}
    for task in tasks:
        cat = task.category or "Other"
        if cat not in categories:
            categories[cat] = {"total": 0, "completed": 0, "pending": 0}
        categories[cat]["total"] += 1
        if task.status == models.TaskStatus.completed:
            categories[cat]["completed"] += 1
        else:
            categories[cat]["pending"] += 1

    return categories


@router.get("/nearby", response_model=list[schemas.NearbyTaskResponse])
def get_nearby_tasks(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius_km: float = Query(5.0),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tasks near the user's current location.
    Mirrors MapScreen.kt nearby tasks section.
    """
    today_start = datetime.combine(date.today(), datetime.min.time())
    tasks_with_location = db.query(models.Task).join(models.TaskLocation).filter(
        models.Task.owner_id == current_user.id,
        (models.Task.due_date >= today_start) | (models.Task.due_date == None)
    ).all()

    nearby = []
    for task in tasks_with_location:
        if task.location:
            dist = _haversine(
                latitude, longitude,
                task.location.latitude, task.location.longitude
            )
            if dist <= radius_km:
                nearby.append(schemas.NearbyTaskResponse(
                    task=build_task_response(task),
                    distance_km=round(dist, 2)
                ))

    nearby.sort(key=lambda x: x.distance_km)
    return nearby


def _haversine(lat1, lon1, lat2, lon2) -> float:
    """Calculate distance between two coordinates in km."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


@router.get("/{task_id}", response_model=schemas.TaskResponse)
def get_task(
    task_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Get a single task. Mirrors TaskDetailScreen.kt."""
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return build_task_response(task)


@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Update a task. Mirrors EditTaskScreen.kt."""
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # If task completed, bump streak and send notification
    if task_data.status == schemas.TaskStatus.completed:
        current_user.task_streak += 1
        db.add(models.Notification(
            user_id=current_user.id,
            task_id=task.id,
            type=models.NotificationType.completion,
            title="Task completed! ✅",
            message=f"Great job completing \"{task.title}\""
        ))

    db.commit()
    db.refresh(task)
    return build_task_response(task)


@router.patch("/{task_id}/complete", response_model=schemas.TaskResponse)
def mark_complete(
    task_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a task as completed.
    Mirrors the 'Mark as Complete' button in TaskDetailScreen.kt.
    """
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = models.TaskStatus.completed
    current_user.task_streak += 1
    db.commit()
    db.refresh(task)
    return build_task_response(task)


@router.delete("/{task_id}", response_model=schemas.MessageResponse)
def delete_task(
    task_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a task. Mirrors the 'Delete Task' button in TaskDetailScreen.kt."""
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return schemas.MessageResponse(message="Task deleted successfully")


@router.post("/{task_id}/location", response_model=schemas.TaskLocationResponse)
def set_task_location(
    task_id: int,
    location: schemas.TaskLocationCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add or update geolocation for a task.
    Mirrors AddLocationScreen.kt.
    """
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    existing = db.query(models.TaskLocation).filter(
        models.TaskLocation.task_id == task_id
    ).first()

    if existing:
        existing.latitude = location.latitude
        existing.longitude = location.longitude
        existing.address = location.address
        existing.place_name = location.place_name
        existing.radius_meters = location.radius_meters
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_loc = models.TaskLocation(
            task_id=task_id,
            user_id=current_user.id,
            **location.model_dump()
        )
        db.add(new_loc)
        db.commit()
        db.refresh(new_loc)
        return new_loc

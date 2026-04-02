"""
User profile routes.
Mirrors ProfileScreen.kt, EditProfileScreen.kt, EmailPreferencesScreen.kt.
"""
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from datetime import date
import os
import shutil
import uuid

from database import get_db
import models, schemas, security

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(
    current_user: models.User = Depends(security.get_current_user)
):
    """Get the logged-in user's profile. Mirrors ProfileScreen.kt."""
    return current_user


@router.put("/me", response_model=schemas.UserResponse)
def update_profile(
    data: schemas.UserUpdate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update profile info.
    Mirrors EditProfileScreen.kt (full_name, phone, bio) and
    Email/notification preferences from ProfileScreen.kt.
    """
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/stats", response_model=schemas.UserStats)
def get_user_stats(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user productivity stats shown on ProfileScreen.kt:
    total tasks, completed tasks, completion rate, streak.
    """
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == models.TaskStatus.completed)
    pending = sum(1 for t in tasks if t.status == models.TaskStatus.pending)
    rate = round((completed / total * 100) if total > 0 else 0, 1)

    return schemas.UserStats(
        total_tasks=total,
        completed_tasks=completed,
        pending_tasks=pending,
        completion_rate=rate,
        task_streak=current_user.task_streak
    )


@router.put("/me/preferences", response_model=schemas.UserResponse)
def update_preferences(
    prefs: schemas.UserPreferences,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update notification and location preferences.
    Mirrors the switches in ProfileScreen.kt settings.
    """
    current_user.push_notifications = prefs.push_notifications
    current_user.location_reminders = prefs.location_reminders
    current_user.deadline_alerts = prefs.deadline_alerts
    current_user.location_services = prefs.location_services
    current_user.daily_reminder = prefs.daily_reminder
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/search", response_model=list[schemas.AssigneeResponse])
def search_users(
    q: str,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search users by name or email for task assignment.
    Mirrors the search bar in AssignTaskScreen.kt.
    """
    users = db.query(models.User).filter(
        (models.User.full_name.ilike(f"%{q}%")) |
        (models.User.email.ilike(f"%{q}%"))
    ).filter(models.User.id != current_user.id).limit(20).all()
    return users


@router.delete("/me", response_model=schemas.MessageResponse)
def deactivate_account(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Deactivate (soft-delete) the current user's account."""
    current_user.is_active = False
    db.commit()
    return schemas.MessageResponse(message="Account deactivated successfully")


@router.post("/me/upload-picture", response_model=schemas.UserResponse)
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a profile picture for the current user.
    Saves the file to 'uploads/profile_pictures' and updates the DB.
    """
    # 1. Validate file extension
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: JPG, PNG, GIF, WEBP"
        )

    # 2. Create unique filename to avoid overwrites
    unique_filename = f"{current_user.id}_{uuid.uuid4().hex}{file_ext}"
    upload_path = os.path.join("uploads", "profile_pictures", unique_filename)

    # 3. Save file locally
    try:
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )

    # 4. Update database (Store relative URL)
    # The frontend expects a full URL or a relative one.
    # Note: In production, you'd use a full static URL or a CDN path.
    current_user.profile_picture = f"/uploads/profile_pictures/{unique_filename}"
    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/me/upgrade-pro", response_model=schemas.UserResponse)
def upgrade_to_pro(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upgrades the current user to Pro status.
    In a real app, you would verify the Razorpay payment ID here.
    """
    current_user.is_pro = True
    db.commit()
    db.refresh(current_user)
    return current_user


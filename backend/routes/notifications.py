"""
Notification routes.
Mirrors NotificationsScreen.kt and the badge on HomeScreen.kt.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
import models, schemas, security

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("/", response_model=list[schemas.NotificationResponse])
def get_notifications(
    unread_only: Optional[bool] = Query(None),
    notification_type: Optional[str] = Query(None),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all notifications for the user.
    Mirrors NotificationsScreen.kt with filter tabs (All, Unread, Location).
    """
    query = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    )
    if unread_only:
        query = query.filter(models.Notification.is_read == False)
    if notification_type:
        query = query.filter(models.Notification.type == notification_type)

    return query.order_by(models.Notification.created_at.desc()).all()


@router.get("/unread-count", response_model=dict)
def get_unread_count(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get unread notification count.
    Used for the badge on the notification bell in HomeScreen.kt.
    """
    count = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).count()
    return {"unread_count": count}


@router.patch("/{notification_id}/read", response_model=schemas.NotificationResponse)
def mark_notification_read(
    notification_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a single notification as read."""
    notif = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    if not notif:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif


@router.patch("/mark-all-read", response_model=schemas.MessageResponse)
def mark_all_read(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark all notifications as read.
    Mirrors the 'Mark all as read' button in NotificationsScreen.kt.
    """
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return schemas.MessageResponse(message="All notifications marked as read")


@router.delete("/{notification_id}", response_model=schemas.MessageResponse)
def delete_notification(
    notification_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a single notification."""
    notif = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    if not notif:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notif)
    db.commit()
    return schemas.MessageResponse(message="Notification deleted")

"""
Authentication routes: Register, Login, Forgot Password, Reset Password.
Matches CreateAccountScreen.kt and LoginScreen.kt
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

from database import get_db
import models, schemas, security

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def send_reset_email(to_email: str, code: str):
    sender_email = os.getenv("SMTP_EMAIL", "")
    sender_password = os.getenv("SMTP_PASSWORD", "").replace(" ", "")
    
    # If no SMTP details are set, fallback to console print for easy testing
    if not sender_email or not sender_password:
        print(f"\n[MOCK EMAIL SEND] To: {to_email} | Code: {code}\n")
        return

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = "TaskMate - Password Reset Code"

    body = f"Hello,\n\nYour 6-digit password reset code is: {code}\n\nThis code will expire in 15 minutes.\n\nThank you,\nThe TaskMate Team"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """
    Create a new user account.
    Mirrors CreateAccountScreen.kt (full_name, email, password, confirm_password).
    """
    # Check if email already exists
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    hashed_pw = security.hash_password(user_data.password)
    user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        password=hashed_pw,
        phone=user_data.phone
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto-join any teams that have pending invites for this email
    pending_invites = db.query(models.InviteToken).filter(
        models.InviteToken.email == user_data.email,
        models.InviteToken.is_used == False
    ).all()
    for invite in pending_invites:
        # Check not expired
        if invite.expires_at and invite.expires_at < datetime.utcnow():
            continue
        # Create membership
        membership = models.TeamMembership(
            team_id=invite.team_id,
            user_id=user.id,
            role="Member"
        )
        db.add(membership)
        invite.is_used = True
        # Notify the new user about the team
        team = db.query(models.Team).filter(models.Team.id == invite.team_id).first()
        if team:
            team_notif = models.Notification(
                user_id=user.id,
                type=models.NotificationType.assignment,
                title=f"You've joined team \"{team.name}\"!",
                message=f"You were invited to team \"{team.name}\". Start collaborating now!"
            )
            db.add(team_notif)

    # Create welcome notification
    notification = models.Notification(
        user_id=user.id,
        type=models.NotificationType.system,
        title="Welcome to TaskMate! 🎉",
        message=f"Hi {user.full_name}! Start by creating your first task."
    )
    db.add(notification)
    db.commit()

    # Generate token
    token = security.create_access_token({"sub": str(user.id)})
    return schemas.Token(
        access_token=token,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )


@router.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT token.
    Mirrors LoginScreen.kt (email, password).
    """
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not security.verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )

    token = security.create_access_token({"sub": str(user.id)})
    return schemas.Token(
        access_token=token,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )


@router.post("/forgot-password", response_model=schemas.MessageResponse)
def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(get_db)):
    """
    Initiate password reset. In production, send email with reset link.
    Mirrors ForgotPasswordScreen.kt.
    """
    user = db.query(models.User).filter(models.User.email == data.email).first()
    # Always return success to avoid user enumeration attacks
    if user:
        code = str(random.randint(100000, 999999))
        
        # Remove any existing code for this user
        existing = db.query(models.PasswordResetCode).filter(models.PasswordResetCode.email == user.email).first()
        if existing:
            db.delete(existing)
            db.commit()
            
        reset_entry = models.PasswordResetCode(
            email=user.email,
            code=code,
            expires_at=datetime.utcnow() + timedelta(minutes=15)
        )
        db.add(reset_entry)
        db.commit()
        
        send_reset_email(user.email, code)

    return schemas.MessageResponse(
        message="If this email exists, a 6-digit verification code has been sent."
    )

@router.post("/verify-reset-code", response_model=schemas.MessageResponse)
def verify_reset_code(data: schemas.VerifyResetCode, db: Session = Depends(get_db)):
    """Verifies that the provided 6-digit code matches the database record and isn't expired."""
    entry = db.query(models.PasswordResetCode).filter(
        models.PasswordResetCode.email == data.email,
        models.PasswordResetCode.code == data.code
    ).first()
    
    if not entry or entry.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
        
    return schemas.MessageResponse(message="Code verified successfully")


@router.post("/reset-password", response_model=schemas.MessageResponse)
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
    """
    Reset password using a token (from the forgot-password email).
    Mirrors CreateNewPasswordScreen.kt.
    """
    # In production: validate the token from the email link
    # For this implementation we verify via the JWT token directly
    user = None
    if "|" in data.token:
        # Secure flow from Android ViewModel passes "email|code" as token
        email, code = data.token.split("|", 1)
        
        # We must re-verify the code hasn't been tampered with and is still valid
        entry = db.query(models.PasswordResetCode).filter(
            models.PasswordResetCode.email == email,
            models.PasswordResetCode.code == code
        ).first()
        
        if not entry or entry.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Session expired. Please request a new code.")
            
        user = db.query(models.User).filter(models.User.email == email).first()
        
        # Consume the code so it cannot be reused
        db.delete(entry)
        db.commit()
    else:
        try:
            payload = security.decode_token(data.token)
            user_id = int(payload.get("sub"))
            user = db.query(models.User).filter(models.User.id == user_id).first()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = security.hash_password(data.new_password)
    db.commit()
    return schemas.MessageResponse(message="Password reset successfully")


@router.post("/change-password", response_model=schemas.MessageResponse)
def change_password(
    data: schemas.ChangePassword,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Change password for authenticated user."""
    if not security.verify_password(data.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.password = security.hash_password(data.new_password)
    db.commit()
    return schemas.MessageResponse(message="Password changed successfully")


@router.post("/logout", response_model=schemas.MessageResponse)
def logout(current_user: models.User = Depends(security.get_current_user)):
    """
    Logout (client should discard the token).
    Mirrors the Logout button in ProfileScreen.kt.
    """
    return schemas.MessageResponse(message="Logged out successfully")

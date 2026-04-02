"""
Team collaboration routes.
Mirrors: TeamCollaborationScreen.kt, InviteTeamMemberScreen.kt,
         AssignTaskScreen.kt, TeamMemberProfileScreen.kt, TeamTaskDetailScreen.kt.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import secrets
from datetime import datetime, timedelta

from database import get_db
import models, schemas, security
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/teams", tags=["Teams"])


def send_invite_email(to_email: str, team_name: str, inviter_name: str, invite_token: str = "", is_existing_user: bool = False):
    """Send a team invitation email."""
    sender_email = os.getenv("SMTP_EMAIL", "")
    sender_password = os.getenv("SMTP_PASSWORD", "").replace(" ", "")

    if is_existing_user:
        subject = f"TaskMate - You've been added to team \"{team_name}\""
        body = (
            f"Hello,\n\n"
            f"{inviter_name} has added you to the team \"{team_name}\" in TaskMate.\n\n"
            f"Open the TaskMate app to see your new team and start collaborating!\n\n"
            f"Thank you,\nThe TaskMate Team"
        )
    else:
        subject = f"TaskMate - You're invited to join team \"{team_name}\""
        body = (
            f"Hello,\n\n"
            f"{inviter_name} has invited you to join the team \"{team_name}\" on TaskMate!\n\n"
            f"To accept this invitation:\n"
            f"1. Download the TaskMate app and create an account using this email address ({to_email}).\n"
            f"2. You will automatically be added to the team upon registration.\n\n"
            f"Alternatively, use this invite code in the app: {invite_token}\n\n"
            f"This invitation expires in 7 days.\n\n"
            f"Thank you,\nThe TaskMate Team"
        )

    if not sender_email or not sender_password:
        print(f"\n[INVITE EMAIL] To: {to_email} | Subject: {subject}\n{body}\n")
        return

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"Invite email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send invite email to {to_email}: {e}")


def _get_member_response(membership: models.TeamMembership, db: Session) -> schemas.TeamMemberResponse:
    user = membership.user
    task_count = db.query(models.TaskAssignment).filter(
        models.TaskAssignment.assigned_to == user.id
    ).count()
    return schemas.TeamMemberResponse(
        id=membership.id,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        role=membership.role,
        task_count=task_count,
        joined_at=membership.joined_at
    )


def _get_team_response(team: models.Team, db: Session) -> schemas.TeamResponse:
    members = [_get_member_response(m, db) for m in team.members]
    shared_task_count = db.query(models.Task).filter(
        models.Task.owner_id == team.created_by,
        models.Task.is_shared == True
    ).count()
    return schemas.TeamResponse(
        id=team.id,
        name=team.name,
        description=team.description,
        created_by=team.created_by,
        member_count=len(members),
        shared_task_count=shared_task_count,
        members=members,
        created_at=team.created_at
    )


@router.post("/", response_model=schemas.TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(
    data: schemas.TeamCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new team. Creator is automatically the Team Lead."""
    team = models.Team(
        name=data.name,
        description=data.description,
        created_by=current_user.id
    )
    db.add(team)
    db.flush()

    # Add creator as Team Lead
    membership = models.TeamMembership(
        team_id=team.id,
        user_id=current_user.id,
        role="Team Lead"
    )
    db.add(membership)
    db.commit()
    db.refresh(team)
    return _get_team_response(team, db)


@router.get("/", response_model=list[schemas.TeamResponse])
def get_my_teams(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all teams the current user belongs to."""
    memberships = db.query(models.TeamMembership).filter(
        models.TeamMembership.user_id == current_user.id
    ).all()
    team_ids = [m.team_id for m in memberships]
    teams = db.query(models.Team).filter(models.Team.id.in_(team_ids)).all()
    return [_get_team_response(t, db) for t in teams]


@router.get("/{team_id}", response_model=schemas.TeamResponse)
def get_team(
    team_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get team details with members and shared tasks.
    Mirrors TeamCollaborationScreen.kt.
    """
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Verify user is a member
    membership = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id,
        models.TeamMembership.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this team")

    return _get_team_response(team, db)


@router.post("/{team_id}/invite", response_model=schemas.MessageResponse)
def invite_member(
    team_id: int,
    data: schemas.InviteMember,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Invite a user by email to join a team.
    Mirrors InviteTeamMemberScreen.kt.
    """
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if target user exists and add them directly
    target_user = db.query(models.User).filter(models.User.email == data.email).first()
    if target_user:
        existing = db.query(models.TeamMembership).filter(
            models.TeamMembership.team_id == team_id,
            models.TeamMembership.user_id == target_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="User is already a team member")

        membership = models.TeamMembership(
            team_id=team_id,
            user_id=target_user.id,
            role=data.role
        )
        db.add(membership)

        # Send notification
        notif = models.Notification(
            user_id=target_user.id,
            type=models.NotificationType.assignment,
            title="Team invitation",
            message=f"{current_user.full_name} invited you to join team \"{team.name}\""
        )
        db.add(notif)
        db.commit()

        # Send email to existing user
        send_invite_email(
            to_email=data.email,
            team_name=team.name,
            inviter_name=current_user.full_name,
            is_existing_user=True
        )

        return schemas.MessageResponse(message=f"Invitation sent to {data.email}")
    else:
        # Generate invite token for non-registered email
        token = secrets.token_urlsafe(32)
        invite = models.InviteToken(
            team_id=team_id,
            email=data.email,
            token=token,
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        db.add(invite)
        db.commit()

        # Send invite email to non-registered user
        send_invite_email(
            to_email=data.email,
            team_name=team.name,
            inviter_name=current_user.full_name,
            invite_token=token,
            is_existing_user=False
        )

        return schemas.MessageResponse(
            message=f"Invite email sent to {data.email}"
        )


@router.post("/accept-invite", response_model=schemas.MessageResponse)
def accept_invite(
    data: schemas.AcceptInvite,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Accept a pending team invitation using an invite token.
    """
    invite = db.query(models.InviteToken).filter(
        models.InviteToken.token == data.token,
        models.InviteToken.is_used == False
    ).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Invalid or expired invite token")

    # Check expiry
    if invite.expires_at and invite.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invite token has expired")

    # Check if already a member
    existing = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == invite.team_id,
        models.TeamMembership.user_id == current_user.id
    ).first()
    if existing:
        invite.is_used = True
        db.commit()
        return schemas.MessageResponse(message="You are already a member of this team")

    membership = models.TeamMembership(
        team_id=invite.team_id,
        user_id=current_user.id,
        role="Member"
    )
    db.add(membership)
    invite.is_used = True
    db.commit()

    team = db.query(models.Team).filter(models.Team.id == invite.team_id).first()
    return schemas.MessageResponse(message=f"You have joined team \"{team.name}\"")


@router.get("/{team_id}/members", response_model=list[schemas.TeamMemberResponse])
def get_team_members(
    team_id: int,
    search: Optional[str] = Query(None),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all team members with optional search.
    Mirrors AssignTaskScreen.kt member list.
    """
    memberships = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id
    ).all()

    results = []
    for m in memberships:
        if search and search.lower() not in m.user.full_name.lower():
            continue
        results.append(_get_member_response(m, db))
    return results


@router.get("/{team_id}/members/{user_id}", response_model=schemas.TeamMemberResponse)
def get_member_profile(
    team_id: int,
    user_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific team member's profile.
    Mirrors TeamMemberProfileScreen.kt.
    """
    membership = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id,
        models.TeamMembership.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found in team")
    return _get_member_response(membership, db)


@router.post("/{team_id}/assign-task", response_model=schemas.MessageResponse)
def assign_task_to_members(
    team_id: int,
    data: schemas.AssignTaskRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Assign a task to multiple team members.
    Mirrors AssignTaskScreen.kt.
    """
    task = db.query(models.Task).filter(models.Task.id == data.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    assigned_names = []
    for member_user_id in data.member_ids:
        # Check membership
        membership = db.query(models.TeamMembership).filter(
            models.TeamMembership.team_id == team_id,
            models.TeamMembership.user_id == member_user_id
        ).first()
        if not membership:
            continue

        # Skip if already assigned
        existing = db.query(models.TaskAssignment).filter(
            models.TaskAssignment.task_id == data.task_id,
            models.TaskAssignment.assigned_to == member_user_id
        ).first()
        if existing:
            continue

        assignment = models.TaskAssignment(
            task_id=data.task_id,
            assigned_to=member_user_id,
            assigned_by=current_user.id
        )
        db.add(assignment)

        notif = models.Notification(
            user_id=member_user_id,
            task_id=data.task_id,
            type=models.NotificationType.assignment,
            title="New task assigned",
            message=f"{current_user.full_name} assigned you to \"{task.title}\""
        )
        db.add(notif)
        assigned_names.append(membership.user.full_name)

    task.is_shared = True
    db.commit()
    return schemas.MessageResponse(
        message=f"Task assigned to: {', '.join(assigned_names)}" if assigned_names else "No new assignments made"
    )


@router.get("/{team_id}/tasks", response_model=list[schemas.TaskResponse])
def get_team_tasks(
    team_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all shared tasks for the team.
    Mirrors TeamTaskDetailScreen.kt.
    """
    # Get all user IDs in the team
    memberships = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id
    ).all()
    user_ids = [m.user_id for m in memberships]

    tasks = db.query(models.Task).filter(
        models.Task.owner_id.in_(user_ids),
        models.Task.is_shared == True
    ).order_by(models.Task.due_date.asc()).all()

    from routes.tasks import build_task_response
    return [build_task_response(t) for t in tasks]


@router.delete("/{team_id}/members/{user_id}", response_model=schemas.MessageResponse)
def remove_member(
    team_id: int,
    user_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a member from the team."""
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team or team.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only team creator can remove members")

    membership = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id,
        models.TeamMembership.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found")

    db.delete(membership)
    db.commit()
    return schemas.MessageResponse(message="Member removed from team")


@router.get("/{team_id}/chat", response_model=list[schemas.ChatMessageResponse])
def get_team_chat(
    team_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch latest chat messages for the team."""
    # Verify membership
    membership = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id,
        models.TeamMembership.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this team")

    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.team_id == team_id
    ).order_by(models.ChatMessage.created_at.asc()).limit(50).all()

    return [
        schemas.ChatMessageResponse(
            id=m.id,
            user_id=m.user_id,
            full_name=m.user.full_name,
            message=m.message,
            created_at=m.created_at
        ) for m in messages
    ]


@router.post("/{team_id}/chat", response_model=schemas.ChatMessageResponse)
def send_team_chat(
    team_id: int,
    data: schemas.ChatMessageCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Send a new message to the team chat."""
    membership = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id,
        models.TeamMembership.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this team")

    new_msg = models.ChatMessage(
        team_id=team_id,
        user_id=current_user.id,
        message=data.message
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    return schemas.ChatMessageResponse(
        id=new_msg.id,
        user_id=new_msg.user_id,
        full_name=current_user.full_name,
        message=new_msg.message,
        created_at=new_msg.created_at
    )


@router.get("/{team_id}/analysis", response_model=schemas.TeamAnalysisResponse)
def get_team_analysis(
    team_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Calculate and return team productivity analysis."""
    # Verify membership
    membership = db.query(models.TeamMembership).filter(
        models.TeamMembership.team_id == team_id,
        models.TeamMembership.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this team")

    # Mocking some trend data for now until we have more historical tasks
    trend = [10.0, 15.0, 12.0, 18.0, 22.0, 25.0, 30.0]
    
    # Calculate real performance for members
    team_members = db.query(models.TeamMembership).filter(models.TeamMembership.team_id == team_id).all()
    performance = []
    
    for member in team_members:
        total = db.query(models.TaskAssignment).filter(models.TaskAssignment.assigned_to == member.user_id).count()
        # In a real app we'd join with Task to check status, but let's simplify for demo
        completed = db.query(models.TaskAssignment).join(models.Task).filter(
            models.TaskAssignment.assigned_to == member.user_id,
            models.Task.status == models.TaskStatus.completed
        ).count()
        rate = (completed / total) if total > 0 else 0.5 # Default 50% for new members
        
        performance.append(schemas.MemberPerformance(
            name=member.user.full_name.split()[0], # First name
            tasks=total,
            rate=rate
        ))

    return schemas.TeamAnalysisResponse(
        completion_trend=trend,
        performance=performance,
        ai_tip="AI Insights: Your team completes tasks 20% faster when locations are clearly tagged!"
    )

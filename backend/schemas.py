"""
Pydantic schemas for request/response validation.
Mirrors the data shown in the Android UI screens.
"""
from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum


# ─────────────────── Enums ───────────────────

class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class NotificationType(str, Enum):
    deadline = "deadline"
    location = "location"
    assignment = "assignment"
    completion = "completion"
    system = "system"


# ─────────────────── Auth Schemas ───────────────────

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v):
        allowed_domains = ["@gmail.com", "@example.com", "@team.com"]
        if not any(v.lower().endswith(domain) for domain in allowed_domains):
            raise ValueError("Only @gmail.com, @example.com, and @team.com emails are allowed")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        errors = []
        if len(v) < 8:
            errors.append("at least 8 characters")
        if not any(c.isdigit() for c in v):
            errors.append("at least one digit")
        if not any(c.islower() for c in v):
            errors.append("at least one lowercase letter")
        if not any(c.isupper() for c in v):
            errors.append("at least one uppercase letter")
        if all(c.isalnum() for c in v):
            errors.append("at least one special character")
        if errors:
            raise ValueError(f"Password must contain {', '.join(errors)}")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v):
        allowed_domains = ["@gmail.com", "@example.com", "@team.com"]
        if not any(v.lower().endswith(domain) for domain in allowed_domains):
            raise ValueError("Only @gmail.com, @example.com, and @team.com emails are allowed")
        return v


class ForgotPassword(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v):
        allowed_domains = ["@gmail.com", "@example.com", "@team.com"]
        if not any(v.lower().endswith(domain) for domain in allowed_domains):
            raise ValueError("Only @gmail.com, @example.com, and @team.com emails are allowed")
        return v


class VerifyResetCode(BaseModel):
    email: EmailStr
    code: str

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v):
        allowed_domains = ["@gmail.com", "@example.com", "@team.com"]
        if not any(v.lower().endswith(domain) for domain in allowed_domains):
            raise ValueError("Only @gmail.com, @example.com, and @team.com emails are allowed")
        return v


class ResetPassword(BaseModel):
    token: str
    new_password: str


class ChangePassword(BaseModel):
    current_password: str
    new_password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    email: str


# ─────────────────── User Schemas ───────────────────

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v):
        allowed_domains = ["@gmail.com", "@example.com", "@team.com"]
        if not any(v.lower().endswith(domain) for domain in allowed_domains):
            raise ValueError("Only @gmail.com, @example.com, and @team.com emails are allowed")
        return v


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    push_notifications: Optional[bool] = None
    location_reminders: Optional[bool] = None
    deadline_alerts: Optional[bool] = None
    location_services: Optional[bool] = None
    daily_reminder: Optional[bool] = None
    is_pro: Optional[bool] = None


class UserPreferences(BaseModel):
    push_notifications: bool
    location_reminders: bool
    deadline_alerts: bool
    location_services: bool
    daily_reminder: bool


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    push_notifications: bool
    location_reminders: bool
    deadline_alerts: bool
    location_services: bool
    daily_reminder: bool
    task_streak: int
    is_pro: bool
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    completion_rate: float
    task_streak: int


# ─────────────────── Task Schemas ───────────────────

class TaskLocationCreate(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None
    place_name: Optional[str] = None
    radius_meters: float = 500.0


class TaskLocationResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    address: Optional[str] = None
    place_name: Optional[str] = None
    radius_meters: float

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "Personal"
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[datetime] = None
    daily_reminder: bool = False
    is_shared: bool = False
    location: Optional[TaskLocationCreate] = None
    assign_to: Optional[List[int]] = None  # list of user IDs

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v):
        if v and v.date() < date.today():
            raise ValueError("Due date cannot be in the past")
        return v


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None
    daily_reminder: Optional[bool] = None
    is_shared: Optional[bool] = None

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v):
        if v and v.date() < date.today():
            raise ValueError("Due date cannot be in the past")
        return v


class AssigneeResponse(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    category: str
    priority: TaskPriority
    status: TaskStatus
    due_date: Optional[datetime] = None
    daily_reminder: bool
    is_shared: bool
    owner_id: int
    location: Optional[TaskLocationResponse] = None
    assignees: List[AssigneeResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskSummary(BaseModel):
    today_count: int
    pending_count: int
    completed_count: int


# ─────────────────── Team Schemas ───────────────────

class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class TeamMemberResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    task_count: int = 0
    joined_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TeamResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_by: int
    member_count: int
    shared_task_count: int
    members: List[TeamMemberResponse] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InviteMember(BaseModel):
    email: EmailStr
    role: str = "Member"


class AssignTaskRequest(BaseModel):
    task_id: int
    member_ids: List[int]


class AcceptInvite(BaseModel):
    token: str


# ─────────────────── Notification Schemas ───────────────────

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    task_id: Optional[int] = None
    type: NotificationType
    title: str
    message: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationUpdate(BaseModel):
    is_read: bool


# ─────────────────── AI / Suggestions Schemas ───────────────────

class AIQueryRequest(BaseModel):
    query: str
    query_type: str = "general"  # general, optimize, suggestions, reschedule, voice


class AIQueryResponse(BaseModel):
    id: int
    query: str
    response: str
    query_type: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AISuggestion(BaseModel):
    title: str
    description: str
    priority: str
    action_type: str  # reschedule, prioritize, delegate, remind


class ProductivityInsight(BaseModel):
    metric: str
    value: str
    trend: str  # up, down, stable
    description: str


# ─────────────────── Location / Map Schemas ───────────────────

class NearbyTaskRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 5.0


class NearbyTaskResponse(BaseModel):
    task: TaskResponse
    distance_km: float


# ─────────────────── Calendar Schemas ───────────────────

class CalendarTask(BaseModel):
    id: int
    title: str
    category: str
    priority: TaskPriority
    status: TaskStatus
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─────────────────── Generic Response ───────────────────

class MessageResponse(BaseModel):
    message: str
    success: bool = True


# ─────────────────── Team Chat & Analysis ───────────────────

class ChatMessageCreate(BaseModel):
    message: str


class ChatMessageResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class MemberPerformance(BaseModel):
    name: str
    tasks: int
    rate: float


class TeamAnalysisResponse(BaseModel):
    completion_trend: List[float]
    performance: List[MemberPerformance]
    ai_tip: str

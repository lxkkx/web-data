"""
TaskMate Backend - Main FastAPI Application
==========================================
Endpoints mirror the Android Jetpack Compose frontend screens:

AUTH
  POST /api/auth/register         → CreateAccountScreen.kt
  POST /api/auth/login            → LoginScreen.kt
  POST /api/auth/forgot-password  → ForgotPasswordScreen.kt
  POST /api/auth/reset-password   → CreateNewPasswordScreen.kt
  POST /api/auth/change-password  → ProfileScreen.kt
  POST /api/auth/logout           → ProfileScreen.kt

USERS
  GET  /api/users/me              → ProfileScreen.kt
  PUT  /api/users/me              → EditProfileScreen.kt
  GET  /api/users/me/stats        → ProfileScreen.kt (stats cards)
  PUT  /api/users/me/preferences  → ProfileScreen.kt (notification/location switches)
  GET  /api/users/search          → AssignTaskScreen.kt (search bar)

TASKS
  POST /api/tasks/                → CreateNewTaskScreen.kt
  GET  /api/tasks/                → HomeScreen.kt / AllTasksScreen.kt
  GET  /api/tasks/summary         → HomeScreen.kt summary cards
  GET  /api/tasks/calendar        → CalendarScreen.kt
  GET  /api/tasks/categories      → TaskCategoriesScreen.kt
  GET  /api/tasks/nearby          → MapScreen.kt nearby tasks
  GET  /api/tasks/{id}            → TaskDetailScreen.kt
  PUT  /api/tasks/{id}            → EditTaskScreen.kt
  PATCH /api/tasks/{id}/complete  → TaskDetailScreen.kt mark complete
  DELETE /api/tasks/{id}          → TaskDetailScreen.kt delete
  POST /api/tasks/{id}/location   → AddLocationScreen.kt

TEAMS
  POST /api/teams/                      → TeamCollaborationScreen.kt
  GET  /api/teams/                      → TeamCollaborationScreen.kt
  GET  /api/teams/{id}                  → TeamCollaborationScreen.kt
  POST /api/teams/{id}/invite           → InviteTeamMemberScreen.kt
  GET  /api/teams/{id}/members          → AssignTaskScreen.kt
  GET  /api/teams/{id}/members/{uid}    → TeamMemberProfileScreen.kt
  POST /api/teams/{id}/assign-task      → AssignTaskScreen.kt
  GET  /api/teams/{id}/tasks            → TeamTaskDetailScreen.kt

NOTIFICATIONS
  GET  /api/notifications/              → NotificationsScreen.kt
  GET  /api/notifications/unread-count  → HomeScreen.kt bell badge
  PATCH /api/notifications/{id}/read   → NotificationsScreen.kt
  PATCH /api/notifications/mark-all-read → NotificationsScreen.kt
  DELETE /api/notifications/{id}       → NotificationsScreen.kt

AI ASSISTANT
  POST /api/ai/chat                    → AiSuggestionsScreen.kt
  GET  /api/ai/suggestions             → AiSuggestionsScreen.kt
  GET  /api/ai/productivity-insights   → ProductivityInsightsScreen.kt
  GET  /api/ai/deadline-risks          → DeadlineRiskAlertsScreen.kt
  GET  /api/ai/smart-reschedule        → SmartReschedulingScreen.kt
  GET  /api/ai/history                 → AiSuggestionsScreen.kt chat history
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
import os

from database import engine, Base
import models  # noqa: F401 – needed for table creation

# Import routers
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.tasks import router as tasks_router
from routes.teams import router as teams_router
from routes.notifications import router as notifications_router
from routes.ai import router as ai_router

# ─── Create all DB tables ───────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── FastAPI App ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="TaskMate API",
    description="Backend API for TaskMate – Task Management, Geolocation & AI Integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    with open("error_log.txt", "a") as f:
        f.write(f"GLOBAL ERROR: {str(exc)}\n")
        traceback.print_exc(file=f)
    print(f"GLOBAL ERROR: {str(exc)}")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal Server Error: {str(exc)}"},
    )

# ─── CORS (allow Android emulator + local dev) ───────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://10.0.2.2",            # Android emulator → host
        "http://10.0.2.2:8000",
        "http://192.168.1.*",         # LAN devices
        "*",                          # ← change to specific origins in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include Routers ─────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(tasks_router)
app.include_router(teams_router)
app.include_router(notifications_router)
app.include_router(ai_router)

# ─── Static Files & Uploads ──────────────────────────────────────────────────
# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads/profile_pictures"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ─── Root / Health ───────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "app": "TaskMate API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "message": "TaskMate backend is running!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

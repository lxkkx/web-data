# TaskMate Backend API 🚀

Welcome to the TaskMate Backend! This is a robust Python FastAPI backend designed to power the Task Management and Geolocation Android application with AI integration.

Built with **FastAPI**, **SQLAlchemy**, **Pydantic**, and **JWT Security**, this API is architected to be scalable, high-performance, and perfectly aligned with the Jetpack Compose frontend.

---

## 🏗️ Technical Architecture

- **Core Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, High-Performance)
- **Database ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (SQLite for simple local development)
- **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Security**: JWT (JSON Web Tokens) with `python-jose` and `passlib` (Bcrypt)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

---

## 📱 Frontend Compatibility Mapping

The API reflects the exact structure of the Android application's UI screens:

| Module | Android Screen (Composables) | API Endpoint Examples |
| :--- | :--- | :--- |
| **Auth** | `LoginScreen`, `CreateAccountScreen` | `POST /api/auth/register`, `POST /api/auth/login` |
| **Tasks** | `HomeScreen`, `AllTasksScreen`, `TaskDetailScreen` | `GET /api/tasks/`, `POST /api/tasks/`, `PATCH /tasks/{id}/complete` |
| **Geo** | `MapScreen`, `AddLocationScreen` | `GET /api/tasks/nearby`, `POST /api/tasks/{id}/location` |
| **Team** | `TeamCollaborationScreen`, `AssignTaskScreen` | `GET /api/teams/`, `POST /api/teams/{id}/assign-task` |
| **AI** | `AiSuggestionsScreen`, `ProductivityInsightsScreen` | `POST /api/ai/chat`, `GET /api/ai/suggestions` |
| **Alerts** | `NotificationsScreen` | `GET /api/notifications/`, `PATCH /notifications/mark-all-read` |

---

## 🚀 Getting Started

### 1. Requirements
*   **Python 3.8+** must be installed.
*   **PIP** (Python Package Installer).

### 2. Installation
1.  Navigate to the backend directory:
    ```bash
    cd c:\xampp\htdocs\Backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### 3. Running the Server

**Option A (Recommended for Windows):**
Double-click the `start_server.bat` file in the project root. This handles dependency checks and server startup automatically.

**Option B (Manual Command):**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📖 API Documentation

Once the server is running, the interactive documentation (Swagger) is available at:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

This allows you to test every endpoint directly from your browser.

---

## 📦 Project Structure

```text
Backend/
├── main.py             # Entry point, App & Router config
├── database.py         # DB connection & Session management
├── models.py           # SQLAlchemy ORM Models (Table schemas)
├── schemas.py          # Pydantic Schemas (Request/Response models)
├── security.py         # JWT & Hashing logic
├── start_server.bat    # Windows startup script
├── requirements.txt    # Library dependencies
├── routes/             # Partitioned API endpoints
│   ├── ai.py           # AI suggestions & productivity logic
│   ├── auth.py         # Registration & login
│   ├── notifications.py # Alert system
│   ├── tasks.py        # Core task management & CRUD
│   ├── teams.py        # Collaboration & shared lists
│   └── users.py        # Profile & Preferences
└── taskmate.db         # SQLite database file (auto-generated)
```

---

## 🔑 Security Notes
The API uses Bearer Token authentication. To access protected endpoints (tasks, teams, profile), you must include the JWT token in the header:
`Authorization: Bearer <your_access_token>`

---

## 🤖 AI Assistant Features
The AI module includes context-aware logic to evaluate your tasks and provide:
*   **Smart Rescheduling**: Suggests new dates for overdue tasks.
*   **Prioritization**: Identifies high-risk tasks to optimize your day.
*   **Insights**: Calculates your task streaks and completion rates.
*   **Voice Integration**: Ready-to-use logic for parsing voice commands via the Android UI.

"""
AI Assistant routes.
Mirrors: AiSuggestionsScreen.kt, SmartReschedulingScreen.kt,
         DeadlineRiskAlertsScreen.kt, ProductivityInsightsScreen.kt, VoiceCommandScreen.kt.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date
from typing import List

from database import get_db
import models, schemas, security

import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


# ─── LLM Helpers ─────────────────────────────────────────────────────────────
def _get_llm_json_response(prompt: str):
    load_dotenv()
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return None
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        full_prompt = prompt + "\n\nRespond ONLY in strictly valid JSON format (an array or object as requested), without any Markdown code blocks or extra text like ```json"
        response = model.generate_content(full_prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print("LLM JSON Error:", e)
        return None

# ─── AI Response Generator ───────────────────────────────────────────────────
# In a real app this would call Gemini / GPT. For now we return smart,
# context-aware rule-based responses based on the user's actual task data.

def _generate_ai_response(query: str, tasks: list, user_name: str, query_type: str) -> str:
    load_dotenv()
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)

    query_lower = query.lower()
    pending = [t for t in tasks if t.status == models.TaskStatus.pending]
    high_priority = [t for t in pending if t.priority == models.TaskPriority.high]
    overdue = [t for t in pending if t.due_date and t.due_date < datetime.utcnow()]

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            if pending:
                task_details = []
                for t in pending[:15]:
                    date_str = t.due_date.strftime('%Y-%m-%d %H:%M') if t.due_date else "No deadline"
                    task_details.append(f"- {t.title} | Priority: {t.priority} | Due: {date_str}")
                context = "User's pending tasks:\n" + "\n".join(task_details)
            
            model = genai.GenerativeModel("gemini-1.5-flash")
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M")
            prompt = (
                f"You are TaskMate AI, a helpful task management assistant. User: {user_name}. "
                f"Current time: {current_time}.\n\n"
                f"Context of their tasks:\n{context}\n\n"
                f"User Question: {query}\n\n"
                "If the user asks about remaining tasks, list them and mention their deadlines. "
                "If they ask about deadlines, highlight the ones approaching soonest. "
                "Provide a friendly, concise, and structured response."
            )
            response = model.generate_content(prompt)
            if response.text:
                return response.text
        except Exception as e:
            print("Gemini API Error:", e)
            # Fall back to rule-based logic below


    if query_type == "optimize" or "optimize" in query_lower or "today" in query_lower or "remaining" in query_lower or "what" in query_lower:
        if pending:
            task_list = "\n".join(f"• {t.title} (Due: {t.due_date.strftime('%b %d') if t.due_date else 'No date'})" for t in pending[:5])
            msg = f"Hi {user_name}! You have {len(pending)} tasks remaining. "
            if high_priority:
                msg += f"I recommend starting with these priority items:\n\n{task_list}"
            else:
                msg += f"Here are your upcoming tasks:\n\n{task_list}"
            return msg
        return f"Hi {user_name}! You have no pending tasks. Great work! 🎉"

    elif query_type == "reschedule" or "reschedule" in query_lower:
        if overdue:
            task_list = "\n".join(f"• {t.title} (was due {t.due_date.strftime('%b %d')})" for t in overdue[:3])
            return (
                f"I noticed some overdue tasks:\n\n{task_list}\n\n"
                "I recommend rescheduling them to the next 2-3 days to get back on track. "
                "Would you like me to suggest new due dates?"
            )
        return "All your tasks are on schedule! No rescheduling needed right now. 👍"

    elif query_type == "suggestions" or "suggest" in query_lower:
        return (
            f"Here are my suggestions for you, {user_name}:\n\n"
            f"1. 📋 You have {len(pending)} pending tasks. Try to complete 3 today.\n"
            f"2. ⏰ Set reminders 30 minutes before due times.\n"
            f"3. 🏃 Break large tasks into smaller sub-tasks.\n"
            f"4. 🤝 Consider delegating lower-priority tasks to your team.\n"
            "Would you like tips on any specific task?"
        )

    elif "deadline" in query_lower or "risk" in query_lower:
        if overdue:
            return (
                f"⚠️ DEADLINE RISK ALERT\n\n"
                f"You have {len(overdue)} overdue task(s). Immediate action needed!\n"
                + "\n".join(f"• {t.title}" for t in overdue[:5])
            )
        upcoming = [t for t in pending if t.due_date and 0 <= (t.due_date - datetime.utcnow()).total_seconds() <= 86400*2]
        if upcoming:
            return (
                f"⚠️ Tasks due in the next 48 hours:\n"
                + "\n".join(f"• {t.title} - due {t.due_date.strftime('%b %d %H:%M')}" for t in upcoming)
            )
        return "✅ No immediate deadline risks. Keep up the great work!"

    elif "productivity" in query_lower or "insight" in query_lower:
        total = len(tasks)
        done = len([t for t in tasks if t.status == models.TaskStatus.completed])
        rate = round((done / total * 100) if total > 0 else 0, 1)
        return (
            f"📊 Your Productivity Insights:\n\n"
            f"• Total tasks: {total}\n"
            f"• Completed: {done}\n"
            f"• Completion rate: {rate}%\n"
            f"• Pending: {len(pending)}\n\n"
            f"{'🔥 Excellent work!' if rate >= 70 else '💪 Keep pushing, you can do it!'}"
        )

    # General / fallback
    return (
        f"Hi {user_name}! I'm your TaskMate AI assistant. I can help you:\n\n"
        "• 🗓️ Optimize your daily schedule\n"
        "• 🔁 Reschedule overdue tasks\n"
        "• 💡 Provide productivity insights\n"
        "• ⚠️ Alert you about deadline risks\n\n"
        "How can I help you today?"
    )


@router.post("/chat", response_model=schemas.AIQueryResponse)
def chat_with_ai(
    request: schemas.AIQueryRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to the AI assistant.
    Mirrors the chat input in AiSuggestionsScreen.kt.
    Now supports actual task creation and deletion via LLM intent parsing!
    """
    today_start = datetime.combine(date.today(), datetime.min.time())
    # Retrieve all pending tasks regardless of due_date for delete context
    tasks = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.status == models.TaskStatus.pending
    ).all()

    response_text = ""
    
    # Prepare brief task context
    task_briefs = [f"ID: {t.id} | Title: {t.title}" for t in tasks]
    
    prompt = (
        f"You are TaskMate AI, assisting {current_user.full_name}.\n"
        f"User question or command: '{request.query}'\n\n"
        f"User's current pending tasks:\n{chr(10).join(task_briefs)}\n\n"
        "Determine if the user wants to CREATE a new task, DELETE a pending task, or just have a GENERAL chat.\n"
        "Respond in STRICT JSON with exactly these keys:\n"
        "- 'intent': 'CREATE', 'DELETE', or 'GENERAL'\n"
        "- 'task_title': (If creating, the new task's title. If deleting, the title of the task to delete. Else null)\n"
        "- 'task_id': (If deleting, the integer ID of the exact task based on the list above. Else null)\n"
        "- 'message': (A friendly, helpful response acknowledging the creation, deletion, or answering the query)\n"
    )

    llm_json = _get_llm_json_response(prompt)
    if llm_json and isinstance(llm_json, dict):
        intent = llm_json.get("intent", "GENERAL")
        message = llm_json.get("message", "Processed your request.")
        
        if intent == "CREATE":
            title = llm_json.get("task_title")
            if title:
                new_task = models.Task(
                    title=title,
                    owner_id=current_user.id,
                    status=models.TaskStatus.pending,
                    priority=models.TaskPriority.medium,
                    category="AI Generated"
                )
                db.add(new_task)
                db.commit()
                response_text = message
            else:
                response_text = "I couldn't determine the task title to create."
        
        elif intent == "DELETE":
            task_id = llm_json.get("task_id")
            task_title = llm_json.get("task_title")
            task_to_del = None
            
            if task_id:
                task_to_del = db.query(models.Task).filter(
                    models.Task.id == task_id,
                    models.Task.owner_id == current_user.id
                ).first()
            if not task_to_del and task_title:
                # Fallback to string matching
                task_to_del = db.query(models.Task).filter(
                    models.Task.title.ilike(f"%{task_title}%"),
                    models.Task.owner_id == current_user.id
                ).first()
                
            if task_to_del:
                db.delete(task_to_del)
                db.commit()
                response_text = message
            else:
                response_text = f"I couldn't find a matching task to delete. {message}"
                
        else:
            response_text = message
    else:
        # Fallback to original logic if LLM parsing completely fails
        response_text = _generate_ai_response(
            request.query, tasks, current_user.full_name, request.query_type
        )

    ai_query = models.AIQuery(
        user_id=current_user.id,
        query=request.query,
        response=response_text,
        query_type=request.query_type
    )
    db.add(ai_query)
    db.commit()
    db.refresh(ai_query)
    return ai_query


@router.get("/suggestions", response_model=list[schemas.AISuggestion])
def get_ai_suggestions(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-generated task suggestions.
    Mirrors the suggestion cards in AiSuggestionsScreen.kt.
    """
    today_start = datetime.combine(date.today(), datetime.min.time())
    tasks = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.status == models.TaskStatus.pending,
        (models.Task.due_date >= today_start) | (models.Task.due_date == None)
    ).all()

    now = datetime.now()

    # Attempt LLM generation first
    task_data = []
    for t in tasks[:10]:
        due = t.due_date.strftime("%Y-%m-%d %H:%M") if t.due_date else "None"
        task_data.append(f"Title: {t.title}, Priority: {t.priority.value}, Due: {due}")

    if task_data:
        prompt = (
            f"You are a task management AI. Based on the user's current tasks:\n{chr(10).join(task_data)}\n\n"
            "Generate 3-4 smart suggestions on what to do next. "
            "Return a JSON array where each object has EXACTLY these keys:\n"
            "- 'title' (string, short punchy title)\n"
            "- 'description' (string, helpful explanation)\n"
            "- 'priority' (string, one of: 'high', 'medium', 'low')\n"
            "- 'action_type' (string, one of: 'reschedule', 'prioritize', 'delegate', 'remind')\n\n"
        )
        llm_json = _get_llm_json_response(prompt)
        if llm_json and isinstance(llm_json, list):
            try:
                # Validate and return
                return [schemas.AISuggestion(**s) for s in llm_json]
            except Exception as e:
                print("LLM parsing fallback:", e)

    # Fallback to rule-based logic
    suggestions = []

    # Prioritize overdue tasks
    overdue = [t for t in tasks if t.due_date and t.due_date < now]
    for task in overdue[:2]:
        suggestions.append(schemas.AISuggestion(
            title=f"Overdue: {task.title}",
            description=f"This task was due on {task.due_date.strftime('%b %d')}. Reschedule or complete it now.",
            priority="high",
            action_type="reschedule"
        ))

    # High priority tasks
    high_prio = [t for t in tasks if t.priority == models.TaskPriority.high and t not in overdue]
    for task in high_prio[:2]:
        suggestions.append(schemas.AISuggestion(
            title=f"Priority: {task.title}",
            description="This high-priority task should be completed soon.",
            priority="high",
            action_type="prioritize"
        ))

    # Upcoming deadlines (next 24 hrs)
    upcoming = [t for t in tasks if t.due_date and 0 <= (t.due_date - now).total_seconds() <= 86400]
    for task in upcoming[:2]:
        suggestions.append(schemas.AISuggestion(
            title=f"Due soon: {task.title}",
            description=f"Due in {int((task.due_date - now).total_seconds() // 3600)} hours.",
            priority="medium",
            action_type="remind"
        ))

    if not suggestions:
        suggestions.append(schemas.AISuggestion(
            title="You're all caught up! 🎉",
            description="No urgent tasks right now. Great productivity!",
            priority="low",
            action_type="remind"
        ))

    return suggestions


@router.get("/productivity-insights", response_model=list[schemas.ProductivityInsight])
def get_productivity_insights(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get productivity insights.
    Mirrors ProductivityInsightsScreen.kt.
    """
    tasks = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id
    ).all()

    total = len(tasks)
    completed = len([t for t in tasks if t.status == models.TaskStatus.completed])
    pending = len([t for t in tasks if t.status == models.TaskStatus.pending])
    rate = round((completed / total * 100) if total > 0 else 0, 1)

    # Attempt LLM generation first
    if total > 0:
        prompt = (
            f"User stats: Total Tasks={total}, Completed={completed}, Pending={pending}, Completion Rate={rate}%, Streak={current_user.task_streak}.\n"
            "Analyze this productivity. Return a JSON array of 4 objects with EXACTLY these keys:\n"
            "- 'metric' (string, e.g., 'Completion Rate', 'Velocity')\n"
            "- 'value' (string, e.g., '70%', '12 tasks')\n"
            "- 'trend' (string, one of: 'up', 'down', 'stable')\n"
            "- 'description' (string, short insightful remark)\n"
        )
        llm_json = _get_llm_json_response(prompt)
        if llm_json and isinstance(llm_json, list) and len(llm_json) > 0:
            try:
                return [schemas.ProductivityInsight(**s) for s in llm_json]
            except Exception as e:
                pass

    # Fallback
    return [
        schemas.ProductivityInsight(
            metric="Completion Rate",
            value=f"{rate}%",
            trend="up" if rate >= 70 else "down",
            description="Percentage of tasks completed vs total"
        ),
        schemas.ProductivityInsight(
            metric="Total Tasks",
            value=str(total),
            trend="stable",
            description="All tasks in your account"
        ),
        schemas.ProductivityInsight(
            metric="Pending Tasks",
            value=str(pending),
            trend="down" if pending > 5 else "stable",
            description="Tasks yet to be completed"
        ),
        schemas.ProductivityInsight(
            metric="Task Streak",
            value=f"{current_user.task_streak} days",
            trend="up" if current_user.task_streak > 0 else "stable",
            description="Consecutive days of completing at least one task"
        ),
    ]


@router.get("/deadline-risks", response_model=list[schemas.AISuggestion])
def get_deadline_risks(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tasks at risk of missing deadline.
    Mirrors DeadlineRiskAlertsScreen.kt.
    """
    now = datetime.utcnow()
    two_days_later = now + timedelta(days=2)

    at_risk = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.status == models.TaskStatus.pending,
        models.Task.due_date <= two_days_later
    ).order_by(models.Task.due_date.asc()).all()

    risks = []
    for task in at_risk:
        if task.due_date < now:
            action = "reschedule"
            desc = f"OVERDUE since {task.due_date.strftime('%b %d')}"
        else:
            hrs = int((task.due_date - now).total_seconds() // 3600)
            action = "prioritize"
            desc = f"Due in approximately {hrs} hours"

        risks.append(schemas.AISuggestion(
            title=task.title,
            description=desc,
            priority=task.priority.value,
            action_type=action
        ))

    return risks


@router.get("/smart-reschedule", response_model=list[schemas.AISuggestion])
def get_smart_reschedule(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Suggest smart rescheduling for overdue/conflicting tasks.
    Mirrors SmartReschedulingScreen.kt.
    """
    now = datetime.utcnow()
    overdue_tasks = db.query(models.Task).filter(
        models.Task.owner_id == current_user.id,
        models.Task.status == models.TaskStatus.pending,
        models.Task.due_date < now
    ).all()

    # Attempt LLM generation
    if overdue_tasks:
        task_data = [f"Title: {t.title}, Priority: {t.priority.value}, Overdue Since: {t.due_date.strftime('%Y-%m-%d')}" for t in overdue_tasks[:10]]
        prompt = (
            f"The following tasks are overdue:\n{chr(10).join(task_data)}\n\n"
            "Suggest smart rescheduling for these tasks. Create a realistic new schedule.\n"
            "Return a JSON array where each object has EXACTLY these keys:\n"
            "- 'title' (string, task title)\n"
            "- 'description' (string, short reason for the new suggested date like 'Suggested for tomorrow morning')\n"
            "- 'priority' (string, 'high', 'medium', or 'low')\n"
            "- 'action_type' (string, MUST be 'reschedule')\n"
        )
        llm_json = _get_llm_json_response(prompt)
        if llm_json and isinstance(llm_json, list) and len(llm_json) > 0:
            try:
                return [schemas.AISuggestion(**s) for s in llm_json]
            except Exception as e:
                pass

    # Fallback
    suggestions = []
    for i, task in enumerate(overdue_tasks):
        suggested_date = (now + timedelta(days=i + 1)).strftime("%b %d, %Y")
        suggestions.append(schemas.AISuggestion(
            title=task.title,
            description=f"Suggested new date: {suggested_date} — move this task to clear your backlog.",
            priority=task.priority.value,
            action_type="reschedule"
        ))

    if not suggestions:
        suggestions.append(schemas.AISuggestion(
            title="No rescheduling needed",
            description="All your tasks are on track. Keep it up! 🎉",
            priority="low",
            action_type="remind"
        ))

    return suggestions


@router.get("/history", response_model=list[schemas.AIQueryResponse])
def get_ai_history(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Get the AI conversation history for the current user."""
    return db.query(models.AIQuery).filter(
        models.AIQuery.user_id == current_user.id
    ).order_by(models.AIQuery.created_at.desc()).limit(50).all()

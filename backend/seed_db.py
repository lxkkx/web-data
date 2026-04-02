"""
Database Seeding Script for TaskMate.
Resets the DB and inserts demo data for Users, Tasks, Teams, and AI history.
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import models, security
from database import SessionLocal, engine, Base

def seed_data():
    # 0. Clear / Recreate Tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        print("🌱 Seeding enriched database with demo data...")

        # 1. Create Users
        hashed_pw = security.hash_password("Password123!")
        
        users = [
            models.User(
                full_name="Rohith Developer",
                email="rohith@example.com",
                password=hashed_pw,
                phone="+91 9876543210",
                bio="Primary developer for TaskMate. Passionate about AI.",
                task_streak=12
            ),
            models.User(
                full_name="Alice Johnson",
                email="alice@team.com",
                password=hashed_pw,
                phone="+1 234567890",
                bio="UI/UX Designer.",
                task_streak=5
            ),
            models.User(
                full_name="Bob Smith",
                email="bob@team.com",
                password=hashed_pw,
                phone="+1 345678901",
                bio="Backend Specialist.",
                task_streak=8
            ),
            models.User(
                full_name="Charlie Brown",
                email="charlie@team.com",
                password=hashed_pw,
                phone="+1 456789012",
                bio="QA Engineer.",
                task_streak=2
            )
        ]
        db.add_all(users)
        db.flush() # Get IDs

        rohith = users[0]
        alice = users[1]
        bob = users[2]
        charlie = users[3]

        # 2. Create Tasks for Rohith
        now = datetime.utcnow()
        tasks = [
            models.Task(
                title="Finalize API Integration",
                description="Connect all screens to the FastAPI backend.",
                category="Dev",
                priority=models.TaskPriority.high,
                status=models.TaskStatus.in_progress,
                due_date=now + timedelta(hours=2),
                owner_id=rohith.id
            ),
            models.Task(
                title="Gym Workout",
                description="Morning cardio and strength training.",
                category="Health",
                priority=models.TaskPriority.medium,
                status=models.TaskStatus.completed,
                due_date=now - timedelta(days=1),
                owner_id=rohith.id
            ),
            models.Task(
                title="Buy Groceries",
                description="Milk, eggs, bread, and fruits.",
                category="Home",
                priority=models.TaskPriority.high,
                status=models.TaskStatus.pending,
                due_date=now + timedelta(hours=5),
                owner_id=rohith.id
            ),
            models.Task(
                title="Team Sync Call",
                description="Discuss next sprint objectives.",
                category="Work",
                priority=models.TaskPriority.medium,
                status=models.TaskStatus.pending,
                due_date=now + timedelta(days=1),
                owner_id=rohith.id,
                is_shared=True
            ),
            models.Task(
                title="Prepare Presentation",
                description="Create slides for the project demo.",
                category="Work",
                priority=models.TaskPriority.high,
                status=models.TaskStatus.pending,
                due_date=now + timedelta(days=2),
                owner_id=rohith.id
            ),
            models.Task(
                title="Pay Electricity Bill",
                description="Must be done before Friday.",
                category="Personal",
                priority=models.TaskPriority.high,
                status=models.TaskStatus.pending,
                due_date=now + timedelta(hours=12),
                owner_id=rohith.id
            )
        ]
        db.add_all(tasks)
        db.flush()

        # 3. Add Geolocation
        locations = [
            models.TaskLocation(
                task_id=tasks[0].id,
                user_id=rohith.id,
                latitude=13.0827,
                longitude=80.2707,
                address="SIMATS Campus, Chennai, India",
                place_name="Development Lab"
            ),
            models.TaskLocation(
                task_id=tasks[2].id,
                user_id=rohith.id,
                latitude=13.0850,
                longitude=80.2100,
                address="Green Supermarket, Anna Nagar",
                place_name="Supermarket"
            )
        ]
        db.add_all(locations)

        # 4. Create Teams
        teams = [
            models.Team(
                name="TaskMate Android Team",
                description="Main development group for the mobile app.",
                created_by=rohith.id
            ),
            models.Team(
                name="Chennai AI Club",
                description="Hobbyist group for AI enthusiasts.",
                created_by=rohith.id
            )
        ]
        db.add_all(teams)
        db.flush()

        # Memberships
        memberships = [
            models.TeamMembership(team_id=teams[0].id, user_id=rohith.id, role="Project Lead"),
            models.TeamMembership(team_id=teams[0].id, user_id=alice.id, role="Designer"),
            models.TeamMembership(team_id=teams[0].id, user_id=bob.id, role="Developer"),
            models.TeamMembership(team_id=teams[0].id, user_id=charlie.id, role="QA"),
            models.TeamMembership(team_id=teams[1].id, user_id=rohith.id, role="Founder"),
            models.TeamMembership(team_id=teams[1].id, user_id=bob.id, role="Moderator")
        ]
        db.add_all(memberships)

        # 5. AI Queries
        queries = [
            models.AIQuery(
                user_id=rohith.id,
                query="Show me my productivity stats.",
                response="You have completed 12 tasks this week. Your completion rate is 75%. Keep up the good work!",
                query_type="productivity"
            ),
            models.AIQuery(
                user_id=rohith.id,
                query="How can I optimize my day?",
                response="You have 3 high-priority tasks due today. I recommend starting with 'Finalize API Integration'.",
                query_type="optimize"
            )
        ]
        db.add_all(queries)

        # 6. Notifications
        notifications = [
            models.Notification(
                user_id=rohith.id,
                type=models.NotificationType.deadline,
                title="Upcoming Deadline",
                message="Finalize API Integration is due in 2 hours!",
                is_read=False
            ),
            models.Notification(
                user_id=rohith.id,
                type=models.NotificationType.location,
                title="Nearby Store",
                message="You are near Green Supermarket. Buy groceries!",
                is_read=False
            )
        ]
        db.add_all(notifications)

        db.commit()
        print("✅ Enriched seeding complete!")
        print(f"Primary User: {rohith.email}")
        print(f"Password: Password123!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

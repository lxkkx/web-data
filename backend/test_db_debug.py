from database import SessionLocal
import models

def test_db():
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == "rohith@example.com").first()
        if user:
            print(f"Found user: {user.full_name}")
            print(f"Email: {user.email}")
            print(f"Password in DB: {user.password}")
            print(f"Is Active: {user.is_active}")
        else:
            print("User not found")
    except Exception as e:
        print(f"Database error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_db()

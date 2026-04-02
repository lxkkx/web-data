from database import SessionLocal
import models

def check_db():
    try:
        db = SessionLocal()
        print("Searching for user: sodalikhitha@gmail.com")
        user = db.query(models.User).filter(models.User.email == "sodalikhitha@gmail.com").first()
        if user:
            print(f"FOUND USER: ID={user.id}, Email={user.email}, Name={user.full_name}")
            print(f"Password in DB: {user.password}")
            print(f"Is Active: {user.is_active}")
        else:
            print("USER NOT FOUND")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check_db()

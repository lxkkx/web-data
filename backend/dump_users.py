import sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, select

DATABASE_URL = "mysql+pymysql://root:@localhost/taskmate_db"
engine = create_engine(DATABASE_URL)

def dump_users():
    try:
        with engine.connect() as conn:
            metadata = MetaData()
            users = Table('users', metadata, autoload_with=engine)
            results = conn.execute(select(users)).fetchall()
            print(f"Total Users: {len(results)}")
            for row in results:
                # Assuming standard column names from models: id, email, full_name, password
                print(dict(row._mapping))
    except Exception as e:
        print(f"Error dumping users: {e}")

if __name__ == "__main__":
    dump_users()

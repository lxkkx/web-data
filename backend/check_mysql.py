import pymysql

def check_databases():
    try:
        conn = pymysql.connect(host='localhost', user='root', password='')
        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES")
        dbs = [db[0] for db in cursor.fetchall()]
        print(f"Databases found: {dbs}")
        if 'taskmate_db' in dbs:
            print("SUCCESS: 'taskmate_db' exists.")
        else:
            print("ERROR: 'taskmate_db' does NOT exist.")
        conn.close()
    except Exception as e:
        print(f"CRITICAL: Failed to connect to MySQL: {e}")

if __name__ == "__main__":
    check_databases()

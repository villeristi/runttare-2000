import sqlite3

DB_NAME = 'runtta.db'


def get_connection() -> sqlite3.Connection:
    return sqlite3.connect(DB_NAME)


def create_table() -> None:
    with get_connection() as db:
        db.execute(
            'CREATE TABLE IF NOT EXISTS runtta (id INTEGER PRIMARY KEY AUTOINCREMENT, runttared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)'
        )


def increment() -> None:
    with get_connection() as db:
        curr = db.cursor()
        curr.execute("INSERT INTO runtta (runttared_at) VALUES (CURRENT_TIMESTAMP)")
        db.commit()


def get_count() -> int:
    with get_connection() as db:
        res = db.execute("SELECT COUNT(*) FROM runtta").fetchone()
        return res[0]

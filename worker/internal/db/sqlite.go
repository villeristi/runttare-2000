package db

import (
	"database/sql"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

type SQLiteDB struct {
	mu sync.Mutex
	db *sql.DB
}

func NewSQLiteDB(dataSourceName string) (DBRepository, error) {
	db, err := sql.Open("sqlite3", dataSourceName)
	if err != nil {
		return nil, err
	}

	createTableSQL := `
  CREATE TABLE IF NOT EXISTS runtta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      runttared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  `

	_, err = db.Exec(createTableSQL)
	if err != nil {
		return nil, err
	}

	return &SQLiteDB{db: db}, nil
}

func (r *SQLiteDB) Increment() (int, error) {
	var count int
	r.mu.Lock()
	defer r.mu.Unlock()

	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}

	_, err = tx.Exec("INSERT INTO runtta (runttared_at) VALUES (CURRENT_TIMESTAMP)")
	if err != nil {
		tx.Rollback()
		return 0, err
	}

	err = tx.QueryRow("SELECT COUNT(*) FROM runtta").Scan(&count)
	if err != nil {
		tx.Rollback()
		return 0, err
	}

	if err = tx.Commit(); err != nil {
		return 0, err
	}

	return count, nil
}

func (r *SQLiteDB) Count() (int, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var count int
	err := r.db.QueryRow("SELECT COUNT(*) FROM runtta").Scan(&count)
	return count, err
}

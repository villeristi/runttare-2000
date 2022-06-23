import sqlite3, {Database, RunResult, Statement} from 'sqlite3';
import { open } from 'sqlite'

const DB_NAME = 'runtta.db';


// you would have to import / invoke this in another file
export async function openDb () {
  return open({
    filename: DB_NAME,
    driver: Database
  })
}

export async function createTable(): Promise<void> {
  const db = await openDb();
  await db.exec('CREATE TABLE IF NOT EXISTS runtta (id INTEGER PRIMARY KEY AUTOINCREMENT, runttared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)')
}

export async function increment() {
  const db = await openDb();
  await db.exec('INSERT INTO runtta (runttared_at) VALUES (CURRENT_TIMESTAMP)')
}

export async function getCount(): Promise<number> {
  const db = await openDb();
  const {cnt} = await db.get('SELECT COUNT(*) as cnt FROM runtta');

  return cnt;
}

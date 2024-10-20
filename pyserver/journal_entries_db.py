#Assuming there is an sqlite database file already made.
import sqlite3
def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}
class Journal_EntriesDB:
    def __init__(self):
        self._connection = sqlite3.connect("journal_entries.db")
        self._connection.row_factory = dict_factory
        self._cursor = self._connection.cursor()
        return
    def create_journal_entry(self, date, entry, author, mood, mood_scale):
        data = [date, entry, author, mood, mood_scale]
        self._cursor.execute("INSERT INTO journal_entries (date, entry, author, mood, mood_scale) VALUES (?, ?, ?, ?, ?)", data)
        self._connection.commit()
    def get_journal_entries(self):
        self._cursor.execute("SELECT * FROM journal_entries")
        entries = self._cursor.fetchall()
        return entries
    def get_journal_entry(self, entry_id):
        data = [entry_id]
        self._cursor.execute("SELECT * FROM journal_entries WHERE id = ?", data)
        journal_entry = self._cursor.fetchone()
        return journal_entry
    def delete_journal_entry(self, entry_id):
        data = [entry_id]
        self._cursor.execute("DELETE FROM journal_entries WHERE id = ?", data)
        self._connection.commit()
    def update_journal_entry(self, date, entry, author, mood, mood_scale, entry_id):
        data = [date, entry, author, mood, mood_scale, entry_id]
        self._cursor.execute("UPDATE journal_entries SET date = ?, entry = ?, author = ?, mood = ?, mood_scale = ? WHERE id = ?", data)
        self._connection.commit()
    def create_user(self, first_name, last_name, email, password):
        data = [first_name, last_name, email, password]
        self._cursor.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)", data)
        self._connection.commit()
    def check_user(self, email):
        data = [email]
        self._cursor.execute("SELECT * FROM users WHERE email = ?", data)
        user_check = self._cursor.fetchone()
        return user_check
    def get_password(self, email):
        data = [email]
        self._cursor.execute("SELECT password FROM users WHERE email = ?", data)
        password = self._cursor.fetchone()
        return password
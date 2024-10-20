from flask import Flask, request, g
from journal_entries_db import Journal_EntriesDB
from passlib.hash import bcrypt
from session_store import SessionStore
session_store = SessionStore()
class MyFlask(Flask):
    def add_url_rule(self, rule, endpoint=None, view_func=None, **options):
        return super().add_url_rule(rule, endpoint, view_func, provide_automatic_options=False, **options)
def load_session_data():
    print("The cookies", request.cookies)
    session_id = request.cookies.get("session_id") #load the session ID from cookie data
    if session_id: #if session ID is present:
        session_data = session_store.getSession(session_id) #load the session data using the session ID
    if session_id == None or session_data == None: #if session ID is missing or invalid:
        session_id = session_store.createSession() #create a new session and session ID
        session_data = session_store.getSession(session_id) #load the session data using the new session ID
    g.session_id = session_id #save the session ID and session data for use in other functions
    g.session_data = session_data
app = MyFlask(__name__)
@app.before_request
def before_request_func():
    load_session_data()
@app.after_request
def after_request_func(response):
    print("session ID:", g.session_id)
    print("session data:", g.session_data)
    response.set_cookie("session_id", g.session_id, samesite="None", secure=True) #send a cookie to the client with the new session ID
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
@app.route("/<path:path>", methods=["OPTIONS"])
def cors_preflight(path):
    return "", 200, {"Access-Control-Allow-Headers":"Content-Type", "Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, OPTIONS"}
@app.route("/journal_entries", methods=["GET"])
def retrieve_journal_entries_collection():
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    db = Journal_EntriesDB()
    journal_entries = db.get_journal_entries()
    return journal_entries
@app.route("/journal_entries/<int:entry_id>", methods=["GET"])
def retrieve_journal_entries_member(entry_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    print("retrieve journal entry member with ID:", entry_id)
    db = Journal_EntriesDB()
    journal_entry = db.get_journal_entry(entry_id)
    if journal_entry:
        return journal_entry
    else:
        return "Journal entry with ID {} not found.".format(entry_id), 404
@app.route("/journal_entries/<int:entry_id>", methods=["DELETE"])
def delete_journal_entries_member(entry_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    print("delete journal entry member with ID:", entry_id)
    db = Journal_EntriesDB()
    journal_entry = db.get_journal_entry(entry_id)
    if journal_entry:
        db.delete_journal_entry(entry_id)
        return "Deleted", 200
    else:
        return "Journal entry with ID {} not found.".format(entry_id), 404
@app.route("/journal_entries/<int:entry_id>", methods=["PUT"])
def edit_journal_entries_member(entry_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    db = Journal_EntriesDB()
    journal_entry = db.get_journal_entry(entry_id)
    date = request.form["date"]
    entry = request.form["entry"]
    author = request.form["author"]
    mood = request.form["mood"]
    mood_scale = request.form["mood_scale"]
    if journal_entry:
        db.update_journal_entry(date, entry, author, mood, mood_scale, entry_id)
        return "Updated", 200
    elif date == "" and entry == "" and author == "" and mood == "" and mood_scale == "":
        return 204
    else:
        return "Journal entry with ID {} not found.".format(entry_id), 404
@app.route("/journal_entries", methods=["POST"])
def create_in_journal_entries_collections():
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    print("the request data is:", request.form)
    db = Journal_EntriesDB()
    date = request.form["date"]
    entry = request.form["entry"]
    author = request.form["author"]
    mood = request.form["mood"]
    mood_scale = request.form["mood_scale"]
    db.create_journal_entry(date, entry, author, mood, mood_scale)
    return "Created", 201
@app.route("/users", methods=["POST"])
def create_user(): #keep this function
    db = Journal_EntriesDB()
    first_name = request.form["first_name"]
    last_name = request.form["last_name"]
    email = request.form["email"]
    password = request.form["password"]
    h = bcrypt.hash(password)
    check = db.check_user(email)
    if check == None:
        db.create_user(first_name, last_name, email, h)
        return "Created User", 201
    else:
        return "User already exists", 422
#@app.route("/users", methods=["GET"])
#def get_users(): #comment out or delete this function
    #db = Journal_EntriesDB()
    #users = db.get_users()
    #return users
#@app.route("/users/<int:user_id>", methods=["GET"])
#def get_user(user_id): #comment out or delete this function
    #print("retrieve user member with ID:", user_id)
    #db = Journal_EntriesDB()
    #user = db.get_user_with_id(user_id)
    #if user:
        #return user
    #else:
        #return "User with ID {} not found.".format(user_id), 404
#@app.route("/users/<int:user_id>", methods=["DELETE"])
#def delete_user(user_id): #comment out or delete this function
    #print("delete user member with ID:", user_id)
    #db = Journal_EntriesDB()
    #journal_entry = db.get_user_with_id(user_id)
    #if journal_entry:
        #db.delete_user(user_id)
        #return "Deleted", 200
    #else:
        #return "User with ID {} not found.".format(user_id), 404
@app.route("/sessions", methods=["POST"])
def login(): #keep with function; authenticate
    email = request.form["email"]
    password = request.form["password"]
    db = Journal_EntriesDB()
    check = db.check_user(email)
    if check:
        h = db.get_password(email)
        pw_verify = bcrypt.verify(password, h["password"])
        if pw_verify:
            g.session_data["user_id"] = check["id"]
            return "Session Created", 201
        else:
            return "Unauthenticated", 401
    else:
        return "Unauthenticated", 401
@app.route("/sessions", methods=["DELETE"])
def logout():
    if "user_id" not in g.session_data:
        return "Unauthenticated", 401
    del g.session_data["user_id"]
    return "Deleted", 200
def main():
    app.run(port=8080)
if __name__ == "__main__":
    main()
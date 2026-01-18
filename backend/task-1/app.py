from flask import Flask, request, jsonify, send_from_directory
import os
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes and origins - allows requests from file://, localhost, and any origin
CORS(app, 
     resources={r"/*": {
         "origins": "*",
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "expose_headers": ["Content-Type"]
     }}, 
     supports_credentials=True)

# Add CORS headers manually as a fallback
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# ----- MongoDB Atlas Connection -----
client = MongoClient("")
db = client["productivity_db"]
users = db["users"]
tasks = db["tasks"]

# ---------- ROOT & HEALTH CHECK ----------

@app.route("/", methods=["GET"])
def root():
    # Serve the test.html file if it exists, otherwise return API info
    test_file = os.path.join(os.path.dirname(__file__), "test.html")
    if os.path.exists(test_file):
        return send_from_directory(os.path.dirname(__file__), "test.html")
    return jsonify({"message": "Flask Productivity API", "status": "running", "endpoints": ["/register", "/login", "/tasks", "/dashboard", "/health"]}), 200

@app.route("/test", methods=["GET"])
def test_page():
    # Alternative route to serve test.html
    return send_from_directory(os.path.dirname(__file__), "test.html")

@app.route("/health", methods=["GET", "OPTIONS"])
def health():
    return jsonify({"status": "ok", "message": "Server is running"}), 200

# ---------- AUTH ----------

@app.route("/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        data = request.json
        if not data:
            return jsonify({"msg": "No data provided"}), 400
        
        if not data.get("username") or not data.get("password"):
            return jsonify({"msg": "Username and password are required"}), 400
        
        if users.find_one({"username": data["username"]}):
            return jsonify({"msg": "User already exists"}), 400

        users.insert_one({
            "username": data["username"],
            "password": generate_password_hash(data["password"])
        })
        return jsonify({"msg": "User created"}), 201
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.json
    user = users.find_one({"username": data["username"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"msg": "Bad credentials"}), 401

    token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(hours=3))
    return jsonify(access_token=token)


# ---------- TASK CRUD ----------

@app.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.json

    deadline = datetime.strptime(data["deadline"], "%Y-%m-%d") if "deadline" in data else None

    tasks.insert_one({
        "user_id": user_id,
        "title": data["title"],
        "description": data.get("description", ""),
        "priority": data.get("priority", "Low"),
        "status": "Pending",
        "deadline": deadline,
        "created_at": datetime.utcnow()
    })

    return jsonify({"msg": "Task created"})


@app.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    user_tasks = tasks.find({"user_id": user_id})

    result = []
    for t in user_tasks:
        overdue = False
        if t.get("deadline") and t["deadline"] < datetime.utcnow() and t["status"] != "Completed":
            overdue = True

        result.append({
            "id": str(t["_id"]),
            "title": t["title"],
            "priority": t["priority"],
            "status": t["status"],
            "deadline": t["deadline"].strftime("%Y-%m-%d") if t.get("deadline") else None,
            "overdue": overdue
        })

    return jsonify(result)


@app.route("/tasks/<id>", methods=["PUT"])
@jwt_required()
def update_task(id):
    user_id = get_jwt_identity()
    data = request.json

    task = tasks.find_one({"_id": ObjectId(id), "user_id": user_id})
    if not task:
        return jsonify({"msg": "Not found"}), 404

    tasks.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "status": data.get("status", task["status"]),
            "priority": data.get("priority", task["priority"])
        }}
    )

    return jsonify({"msg": "Task updated"})


@app.route("/tasks/<id>", methods=["DELETE"])
@jwt_required()
def delete_task(id):
    user_id = get_jwt_identity()
    result = tasks.delete_one({"_id": ObjectId(id), "user_id": user_id})

    if result.deleted_count == 0:
        return jsonify({"msg": "Not found"}), 404

    return jsonify({"msg": "Task deleted"})


# ---------- DASHBOARD ----------

@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()

    total = tasks.count_documents({"user_id": user_id})
    completed = tasks.count_documents({"user_id": user_id, "status": "Completed"})
    overdue = tasks.count_documents({
        "user_id": user_id,
        "deadline": {"$lt": datetime.utcnow()},
        "status": {"$ne": "Completed"}
    })

    completion_rate = round((completed / total) * 100, 2) if total else 0

    return jsonify({
        "total_tasks": total,
        "completed_tasks": completed,
        "overdue_tasks": overdue,
        "completion_rate": completion_rate
    })


# ---------- RUN ----------

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8000)
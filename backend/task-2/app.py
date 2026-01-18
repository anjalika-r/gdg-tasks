from flask import Flask, request, jsonify, send_from_directory
import os
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
from flask_cors import CORS
import jwt as pyjwt

app = Flask(__name__)
# Enable CORS for all routes and origins
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

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# ----- MongoDB Atlas Connection -----
client = MongoClient("mongodb+srv://user:iT0GCgPLG47Mr9lz@cluster0.yd6lycq.mongodb.net/?appName=Cluster0")
db = client["chat_db"]
users = db["users"]
messages = db["messages"]

# Store active user sessions: {user_id: [socket_id, ...]}
active_users = {}

# ---------- ROOT & HEALTH CHECK ----------

@app.route("/", methods=["GET"])
def root():
    # Serve the test.html file if it exists, otherwise return API info
    test_file = os.path.join(os.path.dirname(__file__), "test.html")
    if os.path.exists(test_file):
        return send_from_directory(os.path.dirname(__file__), "test.html")
    return jsonify({
        "message": "Flask Chat API", 
        "status": "running", 
        "endpoints": ["/register", "/login", "/profile", "/messages/<user_id>", "/health"]
    }), 200

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

        user_data = {
            "username": data["username"],
            "password": generate_password_hash(data["password"]),
            "email": data.get("email", ""),
            "profile": {
                "display_name": data.get("display_name", data["username"]),
                "bio": data.get("bio", "")
            },
            "created_at": datetime.utcnow()
        }
        
        users.insert_one(user_data)
        return jsonify({"msg": "User created"}), 201
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        data = request.json
        if not data:
            return jsonify({"msg": "No data provided"}), 400
        
        user = users.find_one({"username": data["username"]})

        if not user or not check_password_hash(user["password"], data["password"]):
            return jsonify({"msg": "Bad credentials"}), 401

        token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(hours=3))
        return jsonify(access_token=token), 200
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


# ---------- PROFILE MANAGEMENT ----------

@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"msg": "Invalid token"}), 401
            
        user = users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        return jsonify({
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user.get("email", ""),
            "profile": user.get("profile", {}),
            "created_at": user.get("created_at").isoformat() if user.get("created_at") else None
        }), 200
    except Exception as e:
        import traceback
        return jsonify({"msg": f"Error: {str(e)}", "traceback": traceback.format_exc()}), 500


@app.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        if not data:
            return jsonify({"msg": "No data provided"}), 400
        
        user = users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        # Only allow updating profile fields
        update_data = {}
        if "email" in data:
            update_data["email"] = data["email"]
        if "profile" in data:
            if "display_name" in data["profile"]:
                if "profile.display_name" not in update_data:
                    update_data["profile"] = user.get("profile", {})
                update_data["profile"]["display_name"] = data["profile"]["display_name"]
            if "bio" in data["profile"]:
                if "profile" not in update_data:
                    update_data["profile"] = user.get("profile", {})
                update_data["profile"]["bio"] = data["profile"]["bio"]
        
        if update_data:
            users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
        
        return jsonify({"msg": "Profile updated"}), 200
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


# ---------- MESSAGE HISTORY ----------

@app.route("/messages/<user_id>", methods=["GET"])
@jwt_required()
def get_messages(user_id):
    try:
        current_user_id = get_jwt_identity()
        
        # Validate that the target user exists
        target_user = users.find_one({"_id": ObjectId(user_id)})
        if not target_user:
            return jsonify({"msg": "User not found"}), 404
        
        # Get query parameters for pagination
        limit = int(request.args.get("limit", 50))
        skip = int(request.args.get("skip", 0))
        
        # Query messages where current user is either sender or receiver with target user
        query = {
            "$or": [
                {"sender_id": current_user_id, "receiver_id": user_id},
                {"sender_id": user_id, "receiver_id": current_user_id}
            ]
        }
        
        # Get messages, sorted by timestamp (newest first)
        message_list = list(
            messages.find(query)
            .sort("timestamp", -1)
            .skip(skip)
            .limit(limit)
        )
        
        # Format messages for response
        result = []
        for msg in reversed(message_list):  # Reverse to get chronological order
            result.append({
                "id": str(msg["_id"]),
                "sender_id": msg["sender_id"],
                "receiver_id": msg["receiver_id"],
                "content": msg["content"],
                "timestamp": msg["timestamp"].isoformat() if msg.get("timestamp") else None,
                "read": msg.get("read", False)
            })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


# ---------- WEBSOCKET EVENTS ----------

def get_user_id_from_token(token):
    """Extract user ID from JWT token"""
    try:
        decoded = pyjwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return decoded.get("sub")
    except:
        return None


@socketio.on("connect")
def handle_connect(auth):
    """Handle WebSocket connection with JWT authentication"""
    try:
        token = None
        if auth and "token" in auth:
            token = auth["token"]
        elif request.args.get("token"):
            token = request.args.get("token")
        
        if not token:
            emit("error", {"msg": "Authentication token required"})
            return False
        
        user_id = get_user_id_from_token(token)
        
        if not user_id:
            emit("error", {"msg": "Invalid authentication token"})
            return False
        
        # Verify user exists
        user = users.find_one({"_id": ObjectId(user_id)})
        if not user:
            emit("error", {"msg": "User not found"})
            return False
        
        # Join user-specific room
        join_room(user_id)
        
        # Track active user session
        if user_id not in active_users:
            active_users[user_id] = []
        active_users[user_id].append(request.sid)
        
        emit("connected", {"msg": "Connected successfully", "user_id": user_id})
    except Exception as e:
        emit("error", {"msg": f"Connection error: {str(e)}"})
        return False


@socketio.on("disconnect")
def handle_disconnect():
    """Handle WebSocket disconnection"""
    try:
        # Find and remove user from active users
        for user_id, socket_ids in list(active_users.items()):
            if request.sid in socket_ids:
                socket_ids.remove(request.sid)
                if not socket_ids:
                    del active_users[user_id]
                leave_room(user_id)
                break
    except Exception as e:
        print(f"Disconnect error: {str(e)}")


@socketio.on("send_message")
def handle_send_message(data):
    """Handle sending a message via WebSocket"""
    try:
        # Get sender from connection
        sender_id = None
        for user_id, socket_ids in active_users.items():
            if request.sid in socket_ids:
                sender_id = user_id
                break
        
        if not sender_id:
            emit("error", {"msg": "Not authenticated"})
            return
        
        # Validate message data
        if not data or "receiver_id" not in data or "content" not in data:
            emit("error", {"msg": "receiver_id and content are required"})
            return
        
        receiver_id = data["receiver_id"]
        content = data["content"]
        
        if not content or not content.strip():
            emit("error", {"msg": "Message content cannot be empty"})
            return
        
        # Validate receiver exists
        receiver = users.find_one({"_id": ObjectId(receiver_id)})
        if not receiver:
            emit("error", {"msg": "Receiver not found"})
            return
        
        # Prevent sending message to self
        if sender_id == receiver_id:
            emit("error", {"msg": "Cannot send message to yourself"})
            return
        
        # Create message document
        message_doc = {
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "content": content.strip(),
            "timestamp": datetime.utcnow(),
            "read": False
        }
        
        # Store message in database
        result = messages.insert_one(message_doc)
        message_id = str(result.inserted_id)
        
        # Prepare message response
        message_response = {
            "id": message_id,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "content": content.strip(),
            "timestamp": message_doc["timestamp"].isoformat(),
            "read": False
        }
        
        # Emit to sender (confirmation)
        emit("message_sent", message_response)
        
        # Emit to receiver if online
        if receiver_id in active_users:
            emit("message_received", message_response, room=receiver_id)
        
    except Exception as e:
        emit("error", {"msg": f"Error sending message: {str(e)}"})


# ---------- RUN ----------

if __name__ == "__main__":
    socketio.run(app, debug=True, host='0.0.0.0', port=8000, allow_unsafe_werkzeug=True)

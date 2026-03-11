from flask import Blueprint, request, jsonify
import os
from services.pinata_service import upload_to_pinata
from services.blockchain_services import (
    register_data,
    get_data,
    grant_access,
    revoke_access,
    check_access,
    get_request_count,
    request_access,
    get_all_data
)
from db import db
from models import DBDocument, AccessRequest, AccessLog, User
import json
from datetime import datetime

data_routes = Blueprint("data_routes", __name__)

@data_routes.route("/upload", methods=["POST"])
def upload_file():
    try:
        file = request.files["file"]
        result = upload_to_pinata(file)
        
        if "IpfsHash" in result:
            return jsonify({"ipfsHash": result["IpfsHash"]})
        else:
            return jsonify({"error": "Pinata upload failed", "details": result}), 500
    except Exception as e:
        print(f"Upload Error: {e}")
        return jsonify({"error": "An error occurred during upload", "message": str(e)}), 500

@data_routes.route("/register", methods=["POST"])
def register():
    try:
        data = request.json

        tx, bid = register_data(
            data["name"],
            data["description"],
            data.get("dataHash")
        )

        user_id = data.get("userId", "anonymous")
        print(f"Registering document: {data['name']}, tx: {tx}, user: {user_id}, bid: {bid}")
        new_doc = DBDocument(
            user_id=user_id,
            name=data["name"],
            type=data.get("type", "DOC"),
            size=data.get("size", "1.0 MB"),
            ipfs_hash=data.get("dataHash"),
            blockchain_tx=tx,
            blockchain_id=bid
        )
        db.session.add(new_doc)
        db.session.commit()

        return jsonify({
            "status": "success",
            "transaction": tx,
            "id": new_doc.id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@data_routes.route("/request-access", methods=["POST"])
def request_access_api():
    try:
        data = request.json
        if not data or "dataId" not in data:
            return jsonify({"error": "Missing dataId"}), 400
            
        data_id = int(data["dataId"])
        
        # Find the actual blockchain ID for this document
        doc = DBDocument.query.get(data_id)
        blockchain_id = doc.blockchain_id if doc and doc.blockchain_id else data_id
        
        print(f"Requesting access for DB ID {data_id}, Blockchain ID {blockchain_id}")
        tx_hash = request_access(blockchain_id)

        new_request = AccessRequest(
            user_id=data.get("userId"),
            user_name=data.get("userName"),
            user_email=data.get("userEmail"),
            organization=data.get("organization"),
            documents=json.dumps(data.get("documents", [])),
            document_names=data.get("document"),
            purpose=data.get("purpose"),
            status='pending',
            requested_date=data.get("requestedDate"),
            expiry_date=data.get("expiryDate"),
            blockchain_tx=tx_hash
        )
        db.session.add(new_request)
        db.session.commit()

        return jsonify({
            "status": "success",
            "transactionHash": tx_hash,
            "requestId": new_request.id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@data_routes.route("/request-count", methods=["GET"])
def request_count_api():
    try:
        data_id = request.args.get("dataId")
        if data_id is None:
            return jsonify({"error": "dataId parameter is required"}), 400

        data_id = int(data_id)
        count = get_request_count(data_id)

        return jsonify({
            "dataId": data_id,
            "requestCount": count
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@data_routes.route("/data/<int:data_id>", methods=["GET"])
def fetch_data(data_id):
    try:
        data = get_data(data_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@data_routes.route("/all-data", methods=["GET"])
def fetch_all_data():
    try:
        user_id = request.args.get("userId")
        if user_id:
            docs = DBDocument.query.filter_by(user_id=user_id).all()
        else:
            docs = DBDocument.query.all()
        return jsonify([doc.to_dict() for doc in docs])
    except Exception as e:
        print(f"Database Error in fetch_all_data: {e}")
        return jsonify([])

@data_routes.route("/get-access-requests", methods=["GET"])
def get_access_requests():
    try:
        user_id = request.args.get("userId")
        email = request.args.get("email")
        org = request.args.get("organization")
        
        query = AccessRequest.query
        if user_id:
            query = query.filter(AccessRequest.user_id == user_id)
        elif email:
            query = query.filter(AccessRequest.user_email == email)
        elif org:
            query = query.filter(AccessRequest.organization == org)
            
        requests_list = query.all()
        return jsonify([req.to_dict() for req in requests_list])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@data_routes.route("/grant-access", methods=["POST"])
def grant():
    try:
        data = request.json
        if not data or "dataId" not in data or "user" not in data:
            return jsonify({"error": "Missing dataId or user parameter"}), 400
            
        tx = grant_access(
            data["dataId"],
            data["user"]
        )

        request_id = data.get("requestId")
        if request_id:
            req = AccessRequest.query.get(request_id)
            if req:
                req.status = 'approved'
                req.blockchain_tx = tx
                req.response_date = datetime.now().strftime('%Y-%m-%d')
                db.session.commit()

        return jsonify({
            "status": "success",
            "transaction": tx
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@data_routes.route("/revoke-access", methods=["POST"])
def revoke():
    try:
        data = request.json
        if not data or "dataId" not in data or "user" not in data:
            return jsonify({"error": "Missing dataId or user parameter"}), 400
            
        tx = revoke_access(
            data["dataId"],
            data["user"]
        )

        return jsonify({
            "status": "success",
            "transaction": tx
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@data_routes.route("/check-access", methods=["GET"])
def check():
    try:
        data_id = request.args.get("dataId")
        user = request.args.get("user")

        if data_id is None or user is None:
            return jsonify({"error": "Missing dataId or user parameter"}), 400

        access = check_access(
            int(data_id),
            user
        )

        return jsonify({
            "hasAccess": access
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@data_routes.route("/log-access", methods=["POST"])
def log_access():
    try:
        data = request.json
        new_log = AccessLog(
            user_id=data.get("userId"),
            organization=data.get("organization"),
            document_names=data.get("documentNames"),
            action=data.get("action"),
            tx_hash=data.get("txHash")
        )
        db.session.add(new_log)
        db.session.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"PostgreSQL logging error: {e}")
        return jsonify({"error": "Failed to log access", "message": str(e)}), 500

@data_routes.route("/users/register", methods=["POST"])
def register_user():
    try:
        data = request.json
        uid = data.get("id")
        name = data.get("name")
        email = data.get("email")
        
        if not uid or not email:
            return jsonify({"error": "Missing uid or email"}), 400
            
        user = User.query.get(uid)
        if not user:
            user = User(id=uid, name=name, email=email)
            db.session.add(user)
            db.session.commit()
            
        return jsonify({"status": "success", "user": user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@data_routes.route("/users/search", methods=["GET"])
def search_users():
    try:
        term = request.args.get("term", "").lower()
        if not term:
            users = User.query.all()
        else:
            users = User.query.filter(
                (User.name.ilike(f"%{term}%")) | 
                (User.email.ilike(f"%{term}%")) | 
                (User.id.ilike(f"%{term}%"))
            ).all()
            
        results = []
        for user in users:
            user_data = user.to_dict()
            docs = DBDocument.query.filter_by(user_id=user.id).all()
            user_data["documents"] = [{"name": doc.name} for doc in docs]
            results.append(user_data)
            
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@data_routes.route("/users/<string:user_id>", methods=["GET"])
def get_user_metadata(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
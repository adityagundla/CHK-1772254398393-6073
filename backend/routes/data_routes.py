from flask import Blueprint, request, jsonify
import os
from supabase import create_client, Client
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

# Initialize Supabase for PostgreSQL logging
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://placeholder.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "placeholder_key")

supabase: Client = None
try:
    if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL != "https://placeholder.supabase.co":
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Failed to initialize Supabase: {e}")

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

        tx = register_data(
            data["name"],
            data["description"],
            data.get("dataHash")
        )

        return jsonify({
            "status": "success",
            "transaction": tx
        })
    except Exception as e:
        # Return error details for easier debugging in the frontend
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
        tx_hash = request_access(data_id)

        return jsonify({
            "status": "success",
            "transactionHash": tx_hash
        })
    except Exception as e:
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
        data_list = get_all_data()
        return jsonify(data_list)
    except Exception as e:
        print(f"Blockchain Error in get_all_data: {e}")
        # Return empty list gracefully so the frontend DataWallet doesn't crash 
        # or misinterpret it as a CORS error if Ganache isn't running/deployed.
        return jsonify([])


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

        return jsonify({
            "status": "success",
            "transaction": tx
        })
    except Exception as e:
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
        if supabase:
            supabase.table("access_logs").insert({
                "user_id": data.get("userId"),
                "organization": data.get("organization"),
                "document_names": data.get("documentNames"),
                "action": data.get("action"),
                "tx_hash": data.get("txHash")
            }).execute()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"PostgreSQL logging error: {e}")
        return jsonify({"error": "Failed to log access", "message": str(e)}), 500
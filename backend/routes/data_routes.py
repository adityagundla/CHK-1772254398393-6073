from flask import Blueprint, request, jsonify
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

data_routes = Blueprint("data_routes", __name__)


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

    data = request.json
    data_id = int(data["dataId"])

    tx_hash = request_access(data_id)

    return jsonify({
        "status": "success",
        "transactionHash": tx_hash
    })    
@data_routes.route("/request-count", methods=["GET"])
def request_count_api():

    data_id = request.args.get("dataId")

    if data_id is None:
        return jsonify({"error": "dataId parameter is required"}), 400

    data_id = int(data_id)

    count = get_request_count(data_id)

    return jsonify({
        "dataId": data_id,
        "requestCount": count
    })

@data_routes.route("/data/<int:data_id>", methods=["GET"])
def fetch_data(data_id):

    data = get_data(data_id)

    return jsonify(data)

@data_routes.route("/all-data", methods=["GET"])
def fetch_all_data():
    data_list = get_all_data()
    return jsonify(data_list)


@data_routes.route("/grant-access", methods=["POST"])
def grant():

    data = request.json

    tx = grant_access(
        data["dataId"],
        data["user"]
    )

    return jsonify({
        "status": "success",
        "transaction": tx
    })


@data_routes.route("/revoke-access", methods=["POST"])
def revoke():

    data = request.json

    tx = revoke_access(
        data["dataId"],
        data["user"]
    )

    return jsonify({
        "status": "success",
        "transaction": tx
    })


@data_routes.route("/check-access", methods=["GET"])
def check():

    data_id = request.args.get("dataId")
    user = request.args.get("user")

    access = check_access(
        int(data_id),
        user
    )

    return jsonify({
        "hasAccess": access
    })
from db import db
from datetime import datetime
import json

class DBDocument(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255))
    type = db.Column(db.String(50))
    size = db.Column(db.String(50))
    ipfs_hash = db.Column(db.String(255))
    blockchain_tx = db.Column(db.String(255))
    blockchain_id = db.Column(db.Integer)
    shared_with = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "blockchainId": self.blockchain_id,
            "user_id": self.user_id,
            "name": self.name,
            "type": self.type,
            "size": self.size,
            "ipfsHash": self.ipfs_hash,
            "blockchainTx": self.blockchain_tx,
            "sharedWith": json.loads(self.shared_with) if self.shared_with else [],
            "date": self.created_at.strftime('%Y-%m-%d')
        }

class AccessRequest(db.Model):
    __tablename__ = 'access_requests'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), nullable=False)
    user_name = db.Column(db.String(255))
    user_email = db.Column(db.String(255))
    organization = db.Column(db.String(255))
    documents = db.Column(db.Text) # JSON string
    document_names = db.Column(db.String(500))
    purpose = db.Column(db.Text)
    status = db.Column(db.String(50), default='pending')
    requested_date = db.Column(db.String(50))
    expiry_date = db.Column(db.String(50))
    blockchain_tx = db.Column(db.String(255))
    response_date = db.Column(db.String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "userName": self.user_name,
            "userEmail": self.user_email,
            "organization": self.organization,
            "documents": json.loads(self.documents) if self.documents else [],
            "document": self.document_names,
            "purpose": self.purpose,
            "status": self.status,
            "requestedDate": self.requested_date,
            "expiryDate": self.expiry_date,
            "blockchainTx": self.blockchain_tx,
            "responseDate": self.response_date
        }

class AccessLog(db.Model):
    __tablename__ = 'access_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255))
    organization = db.Column(db.String(255))
    document_names = db.Column(db.String(500))
    action = db.Column(db.String(50))
    tx_hash = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "organization": self.organization,
            "documentNames": self.document_names,
            "action": self.action,
            "txHash": self.tx_hash,
            "timestamp": self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(255), primary_key=True) # Supabase UID
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "createdAt": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

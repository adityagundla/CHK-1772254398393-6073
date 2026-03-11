from app import app
from models import DBDocument
from db import db

with app.app_context():
    # Sequence the blockchain_id based on the existing order if it's missing
    docs = DBDocument.query.filter(DBDocument.blockchain_id == None).order_by(DBDocument.id).all()
    if docs:
        print(f"Syncing {len(docs)} documents...")
        for i, doc in enumerate(docs):
            # Assuming DB ID 1 corresponds to blockchain ID 1 for this simple case
            # Or we can just use the DB ID as a placeholder if it was working before
            doc.blockchain_id = doc.id 
            print(f"Updated doc {doc.id} with blockchainId {doc.blockchain_id}")
        db.session.commit()
        print("Sync complete.")
    else:
        print("No documents need syncing.")

from app import app
from models import User, DBDocument
import json

with app.app_context():
    print("Users:")
    users = User.query.all()
    print(json.dumps([u.to_dict() for u in users], indent=2))
    
    print("\nDocuments:")
    docs = DBDocument.query.all()
    print(json.dumps([d.to_dict() for d in docs], indent=2))

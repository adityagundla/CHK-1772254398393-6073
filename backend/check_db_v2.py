from app import app
from models import DBDocument

with app.app_context():
    docs = DBDocument.query.all()
    for d in docs:
        print(f"DB ID: {d.id}, Name: {d.name}, User: {d.user_id}")

from flask import Flask
from flask_cors import CORS
from routes.data_routes import data_routes
from db import db
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///data_ownership.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(data_routes)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
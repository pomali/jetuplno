import os
from flask import Flask
from flask_cors import CORS

from database import db
from api.jetuplno import jetuplno_api
from views.index import index_view


app = Flask(__name__, template_folder="templates")




app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "http://localhost:5432/"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(jetuplno_api.blueprint, url_prefix="/api")
app.register_blueprint(index_view)

db.init_app(app)
    

# app = create_app()

if __name__ == "__main__":
    app.run()

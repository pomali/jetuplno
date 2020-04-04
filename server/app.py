import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    from api.jetuplno import jetuplno_api
    from views.index import index_view

    app = Flask(__name__, template_folder='templates')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'http://localhost:5432/'#os.environ['DATABASE_URL']

    app.register_blueprint(jetuplno_api.blueprint, url_prefix='/api')
    app.register_blueprint(index_view)
    
    db.init_app(app)
    return app


if __name__ == '__main__':
    app = create_app()
    app.run()

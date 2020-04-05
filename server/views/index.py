# -*- coding: utf-8 -*-
from flask import render_template, Blueprint

index_view = Blueprint('index', __name__)

@index_view.route('/')
@index_view.route('/<path:dummy>')
def index(dummy=None):
    return render_template('index.html')

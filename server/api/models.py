import datetime
from database import db
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import cast

from geoalchemy2 import Geography, functions


class HeatmapInput(db.Model):
    __tablename__ = "heatmap_input"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(Geography(geometry_type="POINT", srid=4326))
    status = db.Column(db.Float)
    time_added = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    @hybrid_property
    def gps_text(self):
        return functions.ST_AsText(self.position)

    @hybrid_property
    def lat(self):
        return functions.ST_X(cast(self.position, Geography))

    @hybrid_property
    def long(self):
        return functions.ST_Y(cast(self.position, Geography))


class InterestingPoint(db.Model):
    __tablename__ = "interesting_point"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(Geography(geometry_type="POINT", srid=4326))
    name = db.Column(db.String)
    plus_code = db.Column(db.String)
    popularity = db.Column(db.Integer)

    @hybrid_property
    def gps_text(self):
        return functions.ST_AsText(self.position)

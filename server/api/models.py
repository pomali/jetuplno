import datetime
from database import db
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import cast, func as F
from geoalchemy2 import Geography, functions, Geometry


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


def heatmap_query():
    # SELECT ST_AsText(ST_Centroid(unnest(ST_ClusterWithin("position"::geometry, 0.001)))) as p,
    # round( AVG(status)) as s,
    # MAX((time_added)) as ta
    # from heatmap_input hi
    # where age(time_added) < '7 day'

    # return db.session.query(
    #         HeatmapInput,
    #         functions.ST_AsText(
    #             functions.ST_Centroid(
    #                 F.unnest(
    #                     F.ST_ClusterWithin(
    #                         cast(HeatmapInput.position, Geometry), 0.001
    #                         )
    #                     )
    #                 )
    #             ),
    #         F.round(F.AVG(HeatmapInput.status)),
    #         F.MAX(HeatmapInput.time_added)
    #     )



    return db.engine.execute(
        """select
            st_astext(ST_Centroid(unnest(ST_ClusterWithin("position"::geometry, 0.001)))) as p,
            round( avg(status)) as s,
            max(time_added) as ta
        from
            heatmap_input hi
        where
            age(time_added) < '28 day'
        """
    )




# with stat as (
# select
# 	id,
# 	status,
# 	"position",
# 	ST_ClusterDBSCAN("position"::geometry,
# 	0.1,
# 	1) over () as cluster_id
# from
# 	heatmap_input )
# select
# 	cluster_id,
# 	ST_Collect("position"::geometry) as cluster_geom,
# 	array_agg(id) AS ids_in_cluster,
# 	avg(status)
# from
# 	stat
# group by
# 	cluster_id
# order by
# 	cluster_id
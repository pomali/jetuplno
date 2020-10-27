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


def heatmap_query_all():
    return db.session.query(
        HeatmapInput.gps_text, HeatmapInput.status, HeatmapInput.time_added
    )


def heatmap_query_aggregate():
    return db.engine.execute(
        """with stat as (
            select
                id,
                status,
                "position",
                time_added,
                ST_ClusterDBSCAN("position"::geometry,
                0.001,
                1) over () as cluster_id
            from
                heatmap_input
                where age(time_added) < '28 days'
            )
            select
                st_astext(ST_CENTROID(ST_Collect("position"::geometry))) as "position",
                avg(status) as status,
                max(time_added) as time_added
            from
                stat
            group by
                cluster_id
            order by
                cluster_id
        """
    )


def heatmap_query_aggregate_weighted():
    return db.engine.execute(
        """with stat as (
        select
            id,
            status,
            "position",
            time_added,
            extract(epoch from age(time_added)) as t,
            greatest(0, 1 - extract(epoch from age(time_added))/(3600*24*{days_threshold})) as time_weight,
            status * greatest(0, 1 - extract(epoch from age(time_added))/(3600*24*{days_threshold})) as weighted_status,
            ST_ClusterDBSCAN("position"::geometry,
            {cluster_eps},
            1) over () as cluster_id
        from
            heatmap_input
            where age(time_added) < '{days_threshold} days'
        )
        select
            st_astext(ST_CENTROID(ST_Collect("position"::geometry))) as "position",
            round(sum(weighted_status)/sum(time_weight)) as status,
            max(time_added) as time_added
        from
            stat
        group by
            cluster_id
        order by
            cluster_id
            """.format(
            days_threshold=28, cluster_eps=0.001
        )
    )

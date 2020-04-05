import re
from flask import Blueprint, request
from flask_restful import Api, Resource
from main import db
from api.models import HeatmapInput, InterestingPoint
import random


jetuplno_api = Api(Blueprint("jetuplno_api", __name__))  # pylint: disable=invalid-name

LAT_MIN = 47
LAT_MAX = 50
LONG_MIN = 16.5
LONG_MAX = 23


re_get_point = re.compile(r"POINT\((\d+\.\d+) (\d+\.\d+)\)")


def wkt_to_gps(wkt):
    match = re_get_point.match(wkt)
    return (float(match[1]), float(match[2]))


def get_methods(object, spacing=20):
    methodList = []
    for method_name in dir(object):
        try:
            if callable(getattr(object, method_name)):
                methodList.append(str(method_name))
        except:
            methodList.append(str(method_name))
    processFunc = (lambda s: " ".join(s.split())) or (lambda s: s)
    for method in methodList:
        try:
            print(
                str(method.ljust(spacing))
                + " "
                + processFunc(str(getattr(object, method).__doc__)[0:90])
            )
        except:
            print(method.ljust(spacing) + " " + " getattr() failed")


@jetuplno_api.resource("/heatmap-data")
class JetuplnoAPI(Resource):
    @staticmethod
    def get():
        # request_data = request.args
        # try:
        #     lat = float(request_data.get("lat", None))
        #     long = float(request_data.get("long", None))
        # except TypeError:
        #     return (
        #         {"status": "error", "message": "Geo coordinates missing"},
        #         400,
        #     )

        # if lat < LAT_MIN or lat > LAT_MAX or long < LONG_MIN or long > LONG_MAX:
        #     return (
        #         {
        #             "status": "error",
        #             "message": "Geo coordinates out of boundaries \n lat: {} < {} < {} ; long {} < {} < {} ".format(
        #                 LAT_MIN, lat, LAT_MAX, LONG_MIN, long, LONG_MAX
        #             ),
        #         },
        #         400,
        #     )

        all_data = db.session.query(HeatmapInput.gps_text, HeatmapInput.status,)

        heatmap = []
        for point in all_data:
            gps = wkt_to_gps(point.gps_text)
            heatmap.append(
                {"lat": gps[0], "long": gps[1], "status_value": point.status}
            )

        out = {
            "status": "ok",
            "heatmap": heatmap,
        }
        return out, 200

    @staticmethod
    def post():
        request_data = request.get_json(force=True)
        lat = request_data.get("lat", None)
        long = request_data.get("long", None)
        status = request_data.get("status", None)

        if lat is None or long is None or status is None:
            return ({"status": "error", "message": "invalid input"}, 400)

        # TODO logic
        out = {"status": "ok", "lat": lat, "long": long}

        # for i in range(30):
        #     r_lat = random.uniform(48.0, 48.2)
        #     r_long = random.uniform(16.9, 17.3)
        #     point = "POINT ({:f} {:f})".format(r_lat, r_long)
        #     print(point)
        #     db.session.add(HeatmapInput(position=point, status=status))
        #     db.session.commit()

        point = "POINT({:f} {:f})".format(lat, long)
        db.session.add(HeatmapInput(position=point, status=status))
        db.session.commit()
        return out, 200


@jetuplno_api.resource("/pois")
class InterestingPoints(Resource):
    @staticmethod
    def get():

        all_data = db.session.query(InterestingPoint.gps_text, InterestingPoint.name,  InterestingPoint.popularity)

        pois = []
        for point in all_data:
            gps = wkt_to_gps(point.gps_text)
            pois.append({"lat": gps[0], "long": gps[1], "name": point.name, "popularity": point.popularity })

        out = {
            "status": "ok",
            "pois": pois,
        }
        return out, 200

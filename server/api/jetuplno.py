from flask import Blueprint, request
from flask_restful import Api, Resource


jetuplno_api = Api(Blueprint("jetuplno_api", __name__))  # pylint: disable=invalid-name

LAT_MIN = 47
LAT_MAX = 50
LONG_MIN = 16.5
LONG_MAX = 23


@jetuplno_api.resource("/heatmap-data")
class JetuplnoAPI(Resource):
    @staticmethod
    def get():
        request_data = request.args
        try:
            lat = float(request_data.get("lat", None))
            long = float(request_data.get("long", None))
        except TypeError:
            return (
                {"status": "error", "message": "Geo coordinates missing"},
                400,
            )

        if lat < LAT_MIN or lat > LAT_MAX or long < LONG_MIN or long > LONG_MAX:
            return (
                {
                    "status": "error",
                    "message": "Geo coordinates out of boundaries \n lat: {} < {} < {} ; long {} < {} < {} ".format(
                        LAT_MIN, lat, LAT_MAX, LONG_MIN, long, LONG_MAX
                    ),
                },
                400,
            )

        # TODO logic
        out = {
            "status": "ok",
            "heatmap": [{"lat": lat, "long": long, "status_value": 100}],
        }
        return out, 200

    @staticmethod
    def post():
        request_data = request.get_json()
        lat = request_data.get("lat", None)
        long = request_data.get("long", None)

        # TODO logic
        out = {"status": "ok", "lat": lat, "long": long}
        return out, 200

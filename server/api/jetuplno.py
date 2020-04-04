from flask import Blueprint, request
from flask_restful import Api, Resource

jetuplno_api = Api(Blueprint('jetuplno_api', __name__))  # pylint: disable=invalid-name

LAT_MIN = 16.9
LAT_MAX = 17.3
LONG_MIN = 48.0
LONG_MAX = 48.3

@jetuplno_api.resource('/heatmap-data')
class JetuplnoAPI(Resource):
    
    @staticmethod
    def get():
        request_data = request.get_json()
        lat = request_data.get('lat', None)
        long = request_data.get('long', None)
        
        if lat < LAT_MIN or lat > LAT_MAX or long < LONG_MIN or long > LONG_MAX:
            return {'status': 'error', 'message': 'Geo coordinates out of boundaries'}, 400

        # TODO logic
        out = {'status': 'ok', 'lat': lat, 'long': long}
        return out, 200
    
    @staticmethod
    def post():
        request_data = request.get_json()
        lat = request_data.get('lat', None)
        long = request_data.get('long', None)
        
        # TODO logic
        out = {'status': 'ok', 'lat': lat, 'long': long}
        return out, 200

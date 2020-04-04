import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  console.errorr(arguments);
  // infoWindow.setPosition(pos);
  // infoWindow.setContent(browserHasGeolocation ?
  //                       'Error: The Geolocation service failed.' :
  //                       'Error: Your browser doesn\'t support geolocation.');
  // infoWindow.open(map);
}

function usePosition(defaultPosition) {
  const [currentPosition, setCurrentPosition] = useState(
    defaultPosition
      ? { lat: defaultPosition.lat, lng: defaultPosition.lng }
      : { lat: 0, lng: 0 }
  );

  useEffect(() => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentPosition(pos);
        },
        function () {
          handleLocationError("error");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError("no geolocation");
    }
  }, []);

  return [currentPosition, setCurrentPosition];
}

function SimpleMap(props) {
  const [zoom, setZoom] = useState(props.zoom || 8);
  const [currentPosition, setCurrentPosition] = usePosition(props.center);
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        center={currentPosition}
        defaultZoom={zoom}
      >
        <AnyReactComponent lat={48.955413} lng={17.337844} text="😜" />
      </GoogleMapReact>
    </div>
  );
}

export default SimpleMap;

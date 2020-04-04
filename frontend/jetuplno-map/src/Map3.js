import React, { Component, useState, useEffect } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

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
          console.error("error");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      console.error("no geolocation");
    }
  });

  return [currentPosition, setCurrentPosition];
}

export function MapContainer(props) {
  const [currentPosition, setCurrentPosition] = usePosition(null);
  const onMarkerClick = () => {};
  const onInfoWindowClose = () => {};

  return (
    <Map google={props.google} zoom={14} initialCenter={{ currentPosition }}>
      <Marker onClick={onMarkerClick} name={"Current location"} />

      <InfoWindow onClose={onInfoWindowClose}>
        <div>{/* <h1>{this.state.selectedPlace.name}</h1> */}</div>
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);

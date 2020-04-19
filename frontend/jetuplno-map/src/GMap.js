import React, { useState, useEffect, useLayoutEffect } from "react";
import GoogleMapReact from "google-map-react";
import { usePosition } from "./position";

import { defaultZoom, defaultCenter } from "./constants";

import { useFetchHeatmap, useFetchPois } from "./server";

import Popup from "./components/Popup";
import MapControls from "./components/MapControls";
import BottomButtons from "./components/BottomButtons";
import { Heart, CurrentPosMarker, Cloud } from "./components/Markers";

// import { log as originalLog } from "./log";
// const log = originalLog.child({ module: "GMap" });

function distanceToMouse(point, mousePosition, markerProps) {
  if (point && mousePosition) {
    return Math.sqrt(
      (point.x - mousePosition.x) * (point.x - mousePosition.x) +
        (point.y - mousePosition.y) * (point.y - mousePosition.y)
    );
  }
}

function createMapOptions(maps) {
  return {
    panControl: false,
    gestureHandling: "greedy",
    // scrollwheel: false,
    zoomControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    mapTypeControlOptions: {style: maps.MapTypeControlStyle.HORIZONTAL_BAR, position: maps.ControlPosition.TOP_RIGHT}
    // styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
  };
}

function compareFloatEq(a, b, precision) {
  const diff = Math.abs(a - b);

  return diff <= precision;
}

const comparePrecision = 0.001;
function comparePositionEq(a, b) {
  // TODO: use https://en.wikipedia.org/wiki/Haversine_formula

  return (
    compareFloatEq(a.lat, b.lat, comparePrecision) &&
    compareFloatEq(a.lng, b.lng, comparePrecision)
  );
}

function useMapChanges(position) {
  const [isMapMoved, setIsMapMoved] = useState(false);

  const [centerPosition, setCenterPosition] = useState(null);
  const [zoom, setZoom] = useState(defaultZoom);

  useLayoutEffect(() => {
    if (!isMapMoved) {
      setCenterPosition({
        lat: position.latitude,
        lng: position.longitude,
      });
    }
  }, [position, isMapMoved]);

  function onChange(changes) {
    const isSameAsDefaultCenter =
      typeof defaultCenter === "undefined" ||
      typeof changes.center === "undefined" ||
      comparePositionEq(defaultCenter, changes.center);

    const isSameAsCenter =
      typeof centerPosition === "undefined" ||
      typeof changes.center === "undefined" ||
      comparePositionEq(centerPosition, changes.center);

    if (zoom !== changes.zoom) {
      setZoom(changes.zoom);
    }

    if (!(isSameAsCenter || isSameAsDefaultCenter)) {
      setIsMapMoved(true);
    }
  }

  return [
    centerPosition,
    setCenterPosition,
    zoom,
    setZoom,
    isMapMoved,
    setIsMapMoved,
    onChange,
  ];
}

function GMap() {
  const [messages, setMessages] = useState([]);
  const position = usePosition();
  const { heatmap } = useFetchHeatmap();
  const [temporaryHeatmap, setTemporaryHeatmap] = useState([]);
  const { pois } = useFetchPois();

  const [
    centerPosition,
    setCenterPosition,
    zoom,
    setZoom,
    isMapMoved,
    setIsMapMoved,
    onChange,
  ] = useMapChanges(position);

  // useRandomTestMessage(setMessages);

  const removeLastMessage = () => {
    setMessages((m) => {
      m.splice(-1, 1);
      return [...m];
    });
  };
  const addMessage = (msg) => {
    setMessages((m) => [...m, msg]);
  };

  useEffect(() => {
    if (position.error) {
      addMessage({ message: position.error });
    }
  }, [position]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Popup messages={messages} onCloseMessage={removeLastMessage} />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        center={centerPosition}
        onChange={onChange}
        zoom={zoom}
        distanceToMouse={distanceToMouse}
        options={createMapOptions}
      >
        <CurrentPosMarker flex {...centerPosition} />

        {heatmap.map((x, i) => (
          <Cloud
            lat={x.lat}
            lng={x.long}
            status={x.status_value}
            key={`hm${i}`}
          />
        ))}

        {pois.map((x, i) => (
          <Heart
            lat={x.lat}
            lng={x.long}
            name={x.name}
            popularity={x.popularity}
            key={`pm${i}`}
          />
        ))}

        {temporaryHeatmap.map((x, i) => (
          <Cloud
            lat={x.lat}
            lng={x.long}
            status={x.status_value}
            key={`thm${i}`}
          />
        ))}
      </GoogleMapReact>

      <MapControls
        setZoom={setZoom}
        isMapMoved={isMapMoved}
        setIsMapMoved={setIsMapMoved}
        setCenterPosition={setCenterPosition}
      />

      <BottomButtons
        position={position}
        addMessage={addMessage}
        setTemporaryHeatmap={setTemporaryHeatmap}
      />
    </div>
  );
}

export default GMap;

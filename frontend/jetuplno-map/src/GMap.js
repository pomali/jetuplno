import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { usePosition } from "./position";

import { defaultZoom, defaultCenter } from "./constants";

import { useFetchHeatmap, useFetchPois } from "./server";

import Popup from "./components/Popup";
import MapControls from "./components/MapControls";
import BottomButtons from "./components/BottomButtons";
import { Heart, CurrentPosMarker, Cloud } from "./components/Markers";
import { ReactComponent as CloudFullImg } from "./img/img1.svg";

import { cloudFullPurpleStyle, cloudFullWhiteStyle } from "./colors";

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

function isFirstVisit() {
  return !document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("jetuplno-splash-shown="));
}

function createMapOptions(maps) {
  return {
    panControl: false,
    gestureHandling: "greedy",
    // scrollwheel: false,
    zoomControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    mapTypeControlOptions: {
      style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: maps.ControlPosition.TOP_RIGHT,
    },
    // styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
  };
}

function compareFloatEq(a, b, precision) {
  const diff = Math.abs(a - b);

  return diff <= precision;
}

const dateTimeFormat = new Intl.DateTimeFormat("sk", {
  month: "narrow",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
});
function formatPastTime(strTime) {
  if (typeof strTime === "undefined" || !strTime) {
    return "";
  }
  const time = new Date(strTime);
  const f = dateTimeFormat.formatToParts(time);
  const [
    { value: day },
    ,
    { value: month },
    ,
    { value: hour },
    ,
    { value: minute },
  ] = f;
  return <div><div>{day}.{month}.</div><div> <b>{hour}:{minute}</b></div></div>
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

function WelcomeMessage() {
  return (
    <div>
      <h2>Je tu plno?</h2>
      <p>
        Na tomto mieste vieš zistiť ako plno, či prázdno, je na mieste, kam
        pôjdeš na prechádzku.
      </p>
      <h3>Chceš pomôcť?</h3>
      <p>
        Daj vedieť či je <b>plno</b>
        <CloudFullImg style={cloudFullPurpleStyle} /> alebo <b>prázdno</b>
        <CloudFullImg style={cloudFullWhiteStyle} /> tam, kde sa práve
        nachádzaš.
      </p>
      <h3>Prístup k tvojej polohe?</h3>
      <p>
        <ul style={{ textAlign: "left" }}>
          <li>len s tvojím súhlasom</li>
          <li>aby si vedel, kde si</li>
          <li>
            pri zaznačení <CloudFullImg style={cloudFullPurpleStyle} /> /{" "}
            <CloudFullImg style={cloudFullWhiteStyle} />
          </li>
        </ul>
      </p>
      <h3>Cookies?</h3>
      <p>
        Používame cookies{" "}
        <span role="img" aria-label="cookie">
          🍪
        </span>
        .
      </p>
      <p>Viac info v ľavom hornom rohu.</p>
    </div>
  );
}

function GMap() {
  const [messages, setMessages] = useState([]);
  const [getGpsPosition, setGetGpsPosition] = useState(!isFirstVisit());
  const position = usePosition(getGpsPosition);
  const { heatmap } = useFetchHeatmap();
  const [temporaryHeatmap, setTemporaryHeatmap] = useState([]);
  const { pois } = useFetchPois();

  const mapRef = useRef(null);

  const [
    centerPosition,
    ,
    zoom,
    setZoom,
    isMapMoved,
    setIsMapMoved,
    onChange,
  ] = useMapChanges(position);

  // useRandomTestMessage(setMessages);

  const removeLastMessage = () => {
    setMessages((m) => {
      m.splice(0, 1);
      return [...m];
    });
  };
  const addMessage = (msg) => {
    setMessages((m) => [...m, msg]);
  };

  function handleApiLoaded(map, maps) {
    mapRef.current = map;
  }

  function recenter() {
    mapRef.current.panTo({ lat: position.latitude, lng: position.longitude });
  }

  useEffect(() => {
    if (position.error) {
      addMessage({ message: position.error });
    }
  }, [position]);

  useEffect(() => {
    if (isFirstVisit()) {
      const message = <WelcomeMessage />;
      addMessage({
        message,
        onClose: () => {
          setGetGpsPosition(true);
          document.cookie =
            "jetuplno-splash-shown=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        },
      });
    }
  }, []);

  return (
    <div className="google-map-container">
      <Popup messages={messages} onCloseMessage={removeLastMessage} />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        center={centerPosition}
        onChange={onChange}
        zoom={zoom}
        distanceToMouse={distanceToMouse}
        options={createMapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {getGpsPosition && !position.error ? (
          <CurrentPosMarker flex {...centerPosition} />
        ) : null}

        {heatmap.map((x, i) => (
          <Cloud
            lat={x.lat}
            lng={x.long}
            status={x.status_value}
            time_added={formatPastTime(x.time_added)}
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
        recenter={recenter}
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

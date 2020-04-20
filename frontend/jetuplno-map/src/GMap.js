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
      <h1>Vitaj dobrý človek</h1>
      <p>
        Nájdeš u nás kde sa oplatí ísť na vychádzku lebo tam je menej ľudí a ak
        chceš pomôcť môžeš nám dať vedieť či <b>je tu plno</b>{" "}
        <CloudFullImg style={cloudFullPurpleStyle} /> alebo prázdno{" "}
        <CloudFullImg style={cloudFullWhiteStyle} /> na tomto mieste
      </p>
      <p>
        Prístup k tvojej <b>polohe</b>{" "}
        <span role="img" aria-label="poloha">
          🗺
        </span>{" "}
        používame keď chceš zobraziť svoju polohu{" "}
        <span role="img" aria-label="pin">
          📍
        </span>{" "}
        a ak budeš chcieť tak na oznamovanie stavu na mieste kde si{" "}
        <span role="img" aria-label="hory">
          🏔
        </span>
        .
      </p>
      <p>
        Používame cookies{" "}
        <span role="img" aria-label="cookie">
          🍪
        </span>
        .
      </p>
      <p>
        Viac info nájdeš po kliknutí na{" "}
        <i
          style={{
            fontSize: "larger",
            margin: "0.2em",
            color: "rgb(43, 25, 138)",
          }}
        >
          i
        </i>{" "}
        v ľavom hornom rohu.
      </p>
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

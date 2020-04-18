import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { usePosition } from "./position";
import { motion } from "framer-motion";

import { log as originalLog } from "./log";
import { colorPurple, colorWhite, popularityToColor } from "./colors";
import { useFetchHeatmap, useFetchPois } from "./server";
import Button from "./components/Button";
// import { ReactComponent as CloudOutlineImg } from "./img/img2.svg";
import { ReactComponent as CloudFullImg } from "./img/img1.svg";
import { ReactComponent as HeartImg } from "./img/img_heart.svg";
import { ReactComponent as CloudOutlineImg } from "./img/img2.svg";
import currentPositionIcon from "./img/map_pin_whole.png";

import gtag from "./gtag";
import Popup from "./components/Popup";

const log = originalLog.child({ module: "GMap" });

const HEATMAP_STATUS = {
  empty: 0,
  full: 1,
};

const cloudFullWhiteStyle = { stroke: colorPurple, fill: colorWhite };
const cloudFullPurpleStyle = { stroke: colorWhite, fill: colorPurple };
const Cloud = ({ status, lat, lng }) => (
  <CloudFullImg
    lat={lat}
    lng={lng}
    style={{
      position: "absolute",
      transform: "translate(-50%, -50%)",
      ...(status === HEATMAP_STATUS.empty
        ? cloudFullWhiteStyle
        : cloudFullPurpleStyle),
    }}
  />
);

function Heart({ lat, lng, name, popularity }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
      variants={{
        open: { width: "80px", height: "80px", zIndex: 1 },
        closed: { width: "28px", height: "28px", zIndex: 0 },
      }}
      animate={isOpen ? "open" : "closed"}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        width: "28px",
        height: "28px",
      }}
    >
      <HeartImg
        lat={lat}
        lng={lng}
        className="markerSvg"
        style={{
          fill: popularityToColor(popularity),
        }}
      />
      <span
        style={{
          position: "absolute",
          left: "17%",
          top: "17%",
          // transform: "translate(-50%, -50%)",
        }}
      >
        {isOpen ? name : null}
      </span>
    </motion.div>
  );
}

function CurrentPosMarker() {
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -100%)",
        zIndex: 100000,
      }}
    >
      <img
        src={currentPositionIcon}
        width={31}
        height={44}
        alt="current position"
      />
    </div>
  );
}

function distanceToMouse(point, mousePosition, markerProps) {
  if (point && mousePosition) {
    return Math.sqrt(
      (point.x - mousePosition.x) * (point.x - mousePosition.x) +
        (point.y - mousePosition.y) * (point.y - mousePosition.y)
    );
  }
}

function onSendPositionClick(
  position,
  status,
  addMessage,
  setTemporaryHeatmap
) {
  gtag("event", "send_position");
  if (position) {
    setTemporaryHeatmap((tmpHeatmap) => [
      ...tmpHeatmap,
      {
        lat: position.latitude,
        long: position.longitude,
        status_value: status,
      },
    ]);
  }
  sendPosition(position, status)
    .then((response) => {
      log.info({ response: response });
      addMessage({ message: response.text });
    })
    .catch((reason) => {
      log.error({ reason });
      addMessage({ message: reason });
      setTemporaryHeatmap((tmpHeatmap) => {
        const i = tmpHeatmap.findIndex(
          (x) =>
            x.lat === position.latitude &&
            x.long === position.longitude &&
            x.status_value === status
        );
        tmpHeatmap.splice(i, 1);
        return [...tmpHeatmap];
      });
    });
}

function sendPosition(position, status) {
  if (position.error) {
    log.error(position.error);
    return Promise.resolve("Nemám polohu");
  }

  const bodyData = {
    lat: position.latitude,
    long: position.longitude,
    status: status,
  };
  log.info({ bodyData });
  return fetch(process.env.REACT_APP_SERVER_URL + "/heatmap-data", {
    method: "POST",
    body: JSON.stringify(bodyData),
  }).then(async (response) => {
    log.info({ response });
    if (response.ok) {
      return { status: "ok", text: "Ďík za info!" };
    } else {
      return { status: "not ok", text: await response.text() };
    }
  });
}

function createMapOptions(maps) {
  return {
    panControl: false,
    mapTypeControl: false,
    // scrollwheel: false,
    // zoomControl: false,
    fullscreenControl: false,
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

function useRandomTestMessage(setMessages) {
  return useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMessages((m) => [
        ...m,
        { message: `random message ${new Date().toISOString()}`, type: "info" },
      ]);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [setMessages]);
}

function GMap() {
  const [messages, setMessages] = useState([]);
  const position = usePosition();
  // const position = { latitude: 48.1397848, longitude: 17.1033551, error: null };
  const { heatmap } = useFetchHeatmap();
  const [temporaryHeatmap, setTemporaryHeatmap] = useState([]);
  const { pois } = useFetchPois();
  const [isMapMoved, setIsMapMoved] = useState(false);
  // useRandomTestMessage(setMessages);

  // const [centerPosition, setCenterPosition] = useState({
  //   lat: position.latitude,
  //   lng: position.longitude,
  // });

  // setCenterPosition({
  //   lat: position.latitude,
  //   lng: position.longitude,
  // });
  // const centerPosition = { lat: 48.1397848, lng: 17.1033551 };
  const centerPosition = { lat: position.latitude, lng: position.longitude };

  const defaultZoom = 12;
  const defaultCenter = { lat: 48.139712, lng: 17.104302 };

  const removeLastMessage = () => {
    setMessages((m) => {
      m.splice(-1, 1);
      return [...m];
    });
  };
  const addMessage = (msg) => {
    setMessages((m) => [...m, msg]);
  };

  // // useEffect(() => {
  //   const x = setInterval(() => {
  //     // setCenterPosition((x) => ({ lat: x.lat + 1, lng: x.lng + 1 }));
  //   }, 1000);
  //   return () => {
  //     clearIntervposition.latitude);
  //   position.longitude};
  // });

  console.log(centerPosition, position, isMapMoved);
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <Popup messages={messages} onCloseMessage={removeLastMessage} />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={defaultCenter}
        center={
          isMapMoved ? [position.latitude, position.longitude] : undefined
        }
        onChange={function (changes) {
          const isSameAsDefaultCenter =
            typeof defaultCenter === "undefined" ||
            typeof changes.center === "undefined" ||
            comparePositionEq(defaultCenter, changes.center);

          const isSameAsCenter =
            typeof centerPosition === "undefined" ||
            typeof changes.center === "undefined" ||
            comparePositionEq(centerPosition, changes.center);

          const isSameZoom = defaultZoom === changes.zoom;

          console.log(changes, {
            isSameAsCenter,
            isSameAsDefaultCenter,
            isSameZoom,
          });

          if (!(isSameAsDefaultCenter || isSameAsCenter) || !isSameZoom) {
            log.info("map changed");
            setIsMapMoved(true);
          }
        }}
        defaultZoom={defaultZoom}
        distanceToMouse={distanceToMouse}
        options={createMapOptions}
      >
        <CurrentPosMarker
          // lat={position.latitude} lng={position.longitude}
          flex
          {...centerPosition}
        />

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

      <div
        style={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          style={{ background: colorWhite, color: colorPurple }}
          onClick={() =>
            onSendPositionClick(
              position,
              HEATMAP_STATUS.empty,
              addMessage,
              setTemporaryHeatmap
            )
          }
        >
          <CloudOutlineImg
            style={{
              marginRight: "5px",
              height: "1em",
            }}
          />{" "}
          Je tu prázdno
        </Button>
        <Button
          style={{ background: colorPurple, color: colorWhite }}
          onClick={() =>
            onSendPositionClick(
              position,
              HEATMAP_STATUS.full,
              addMessage,
              setTemporaryHeatmap
            )
          }
        >
          <CloudOutlineImg
            style={{
              marginRight: "5px",
              height: "1em",
            }}
          />{" "}
          Je tu plno
        </Button>
      </div>
    </div>
  );
}

export default GMap;

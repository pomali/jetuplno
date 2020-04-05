import { useLayoutEffect, useState, useEffect, useRef } from "react";
import img1 from "./img1.svg";
// import img2 from "./img2.svg";
// import heartIconPath from "./img3.svg";
import "./icons.css";
import currentPositionIcon from "./map_pin_whole.png";

const img2 =
  "M33.9978 13.9422V14.0952C33.919 16.8283 31.7206 18.9941 29.0511 19C29.0508 19 29.0505 19 29.0502 19L6.62156 19C3.53178 19 1 16.4499 1 13.2689C1 10.0878 3.53178 7.53778 6.62156 7.53778C6.96056 7.53778 7.29418 7.57041 7.62343 7.63045L8.98901 7.87944L8.79277 6.50529C8.7686 6.33605 8.75578 6.1633 8.75578 5.98889C8.75578 3.96104 10.3678 2.34556 12.3233 2.34556C13.4631 2.34556 14.4828 2.89291 15.1405 3.75608L15.9283 4.78995L16.7257 3.76345C18.0368 2.07556 20.0573 1 22.3223 1C26.1862 1 29.355 4.13933 29.4525 8.08249L29.4714 8.84553L30.2124 9.02859C32.3749 9.56284 33.9978 11.5526 33.9978 13.9422Z";
const heartIconPath =
  "M14 25.4545L11.97 23.6235C4.76 17.1454 0 12.8729 0 7.62943C0 3.35695 3.388 0 7.7 0C10.136 0 12.474 1.12361 14 2.89918C15.526 1.12361 17.864 0 20.3 0C24.612 0 28 3.35695 28 7.62943C28 12.8729 23.24 17.1454 16.03 23.6374L14 25.4545Z";
/*

https://developers.google.com/maps/documentation/javascript/examples/control-positioning

*/

// const currentPositionIcon =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAQlBMVEVMaXFCiv9Civ9Civ9Civ9Civ9Civ9Civ9Civ+Kt/9+r/9Pkv90qf9hnf9Civ9wpv9Ee/+Jtf9Gjf9/sP9Kj/9KXf+JdfukAAAACXRSTlMAGCD7088IcsuTBctUAAAAYUlEQVR4XlWOWQrAIBBDx302d73/VSu0UMxfQsgLAMSEzmGKcGRCkZylBHPyMJQmk44QIRWdVCuxlgQoRNLaoi4ILs/a9m6VszuGf4PSaX21eyD6oZ256/AHa/0L9RauOw+4XAWqGLX26QAAAABJRU5ErkJggg==";

function randomizeInDev(f) {
  if (process.env.NODE_ENV === "development") {
    return f + Math.random() * 0.2 - 0.1;
  }
  return f;
}

function popularityToColor(popularity) {
  switch (popularity) {
    case 1:
      return "#FF0303";
    case 2:
      return "#FF8D8D";
    default:
      return "#FED5D5";
  }
}

export const usePosition = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  const onChange = ({ coords }) => {
    setPosition({
      latitude: randomizeInDev(coords.latitude),
      longitude: randomizeInDev(coords.longitude),
    });
  };
  const onError = (error) => {
    setError(error.message);
  };
  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);
  if (!position) {
    return { error: "Not Ready" };
  }
  return { ...position, error };
};

function fetchHeatmap(position) {
  // if (position.error) {
  //   console.log(position.error);
  //   return Promise.reject("position");
  // }
  // const params = new URLSearchParams();
  // params.append("lat", position.latitude);
  // params.append("long", position.longitude);
  return fetch(
    process.env.REACT_APP_SERVER_URL + "/heatmap-data" // "?" + params.toString()
  )
    .then((x) => {
      console.log(x);
      return x;
    })
    .then(async (response) => {
      if (response.status !== 200) {
        // TODO
        console.error("nieco sa pokazilo");
        throw Error("network request failed");
      }
      const json = response.json();
      json.then(console.log);
      return (await json).heatmap;
    });
}

function fetchPois() {
  return fetch(process.env.REACT_APP_SERVER_URL + "/pois")
    .then((x) => {
      console.log(x);
      return x;
    })
    .then(async (response) => {
      if (response.status !== 200) {
        // TODO
        console.error("nieco sa pokazilo");
        throw Error("network request failed");
      }
      const json = response.json();
      json.then(console.log);
      return (await json).pois;
    });
}

/*  global google map globalThis */
function useGoogleMap() {
  const position = usePosition();
  const heatmapEmptyRef = useRef(null);
  const heatmapFullRef = useRef(null);
  const positionMarkerRef = useRef(null);
  const markersRef = useRef(null);

  function sendPosition(statusType) {
    if (position.error) {
      console.log(position.error);
      return false;
    }

    let status;
    switch (statusType) {
      case "full":
        status = 1;
        break;
      case "empty":
        status = 0;
        break;
      default:
        return false;
    }

    fetch(process.env.REACT_APP_SERVER_URL + "/heatmap-data", {
      method: "POST",
      body: JSON.stringify({
        lat: position.latitude,
        long: position.longitude,
        status: status,
      }),
    }).then((response) => {
      console.log(response);

      alert("Ďík za info!");
    });
  }

  useLayoutEffect(() => {
    const heatmapPromise = fetchHeatmap();
    const poisPromise = fetchPois();

    function showHeatmap() {
      /* Heatmaps */
      heatmapPromise
        .then((heatmapData) => {
          if (heatmapEmptyRef.current) {
            heatmapEmptyRef.current.setMap(null);
          }
          const heatmapEmpty = new google.maps.visualization.HeatmapLayer({
            data: heatmapData
              .filter((point) => point.status_value < 0.5)
              .map((point) => {
                return {
                  location: new google.maps.LatLng(point.lat, point.long),
                  weight: point.status_value,
                };
              }),
            radius: 30,
            gradient: ["rgba(255,255,255,0)", "rgb(255,255,255)"], //  "rgb(43,25,138)"
          });

          if (heatmapFullRef.current) {
            heatmapFullRef.current.setMap(null);
          }
          const heatmapFull = new google.maps.visualization.HeatmapLayer({
            data: heatmapData
              .filter((point) => point.status_value > 0.5)
              .map((point) => {
                return {
                  location: new google.maps.LatLng(point.lat, point.long),
                  weight: point.status_value,
                };
              }),
            radius: 30,
            gradient: ["rgba(43,25,138, 0)", "rgb(43,25,138)"],
          });

          heatmapFull.setMap(map);
          heatmapFullRef.current = heatmapFull;

          heatmapEmpty.setMap(map);
          heatmapEmptyRef.current = heatmapEmpty;
        })
        .catch((reason) => {
          if (reason === "position") {
            return false;
          }
        });

      /* Points of interest */
      poisPromise
        .then((poiData) => {
          if (markersRef.current) {
            markersRef.current.forEach((point) => point.setMap(null));
          }
          markersRef.current = poiData.map((point) => {
            return new google.maps.Marker({
              position: new google.maps.LatLng(point.lat, point.long),
              map: map,
              icon: {
                path: heartIconPath,
                fillColor: popularityToColor(point.popularity),
                fillOpacity: 1,
                anchor: new google.maps.Point(0, 0),
                strokeWeight: 0,
                scale: 1,
              },
              draggable: false,
            });
          });
        })
        .catch((reason) => {
          if (reason === "position") {
            return false;
          }
        });
    }

    function centerMap() {
      if (position.error) {
        console.error(position.error);
        return false;
      }
      if (positionMarkerRef.current) {
        positionMarkerRef.current.setMap(null);
      }

      const map = globalThis.map;

      console.log("center map");
      var pos = {
        lat: position.latitude,
        lng: position.longitude,
      };

      var positionMarker = new google.maps.Marker({
        map: map,
        position: pos,
        icon: {
          url: currentPositionIcon,
          size: new google.maps.Size(41, 58),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(19, 28),
          scaledSize: new google.maps.Size(20, 29),
        },
      });

      map.setCenter(pos);
      positionMarker.setPosition(pos);
      positionMarkerRef.current = positionMarker;
      google.maps.event.trigger(map, "resize");
    }

    function onMapReady() {
      console.log("map ready");
      centerMap();
      showHeatmap();
    }

    if (globalThis.googleMapsLoaded) {
      onMapReady();
    } else {
      globalThis.googleMapsET.addEventListener("ready", onMapReady);
    }

    return () => {
      globalThis.googleMapsET.removeEventListener("ready", onMapReady);
    };
  }, [position]);

  return sendPosition;
}

export default useGoogleMap;

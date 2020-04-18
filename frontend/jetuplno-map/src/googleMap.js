import { useLayoutEffect, useRef } from "react";
import { usePosition } from "./position";
import "./icons.css";
import currentPositionIcon from "./img/map_pin_whole.png";
import {
  colorPurple,
  colorPurpleTransparent,
  colorWhite,
  colorWhiteTransparent,
  popularityToColor,
} from "./colors";
import { heartIconPath } from "./img/images";
import { fetchHeatmap, fetchPois } from "./server";



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
            gradient: [colorWhiteTransparent, colorWhite],
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
            maxIntensity: 1,
            gradient: [colorPurpleTransparent, colorPurple],
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
            const marker = new google.maps.Marker({
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
              // label: point.name,
              title: point.name,
              draggable: false,
            });
            const infoWindow = new google.maps.InfoWindow({
              content: point.name,
            });
            marker.addListener("click", () => infoWindow.open(map, marker));

            return marker;
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

import { useLayoutEffect } from "react";

function getPosition() {
  return new Promise(function (resolve, reject) {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition((position) =>
        resolve(position)
      );
    }
    return reject("Error: Your browser doesn't support geolocation.");
  });
}

function fetchHeatmap(position) {
  const params = new URLSearchParams();
  params.append("lat", position.coords.latitude);
  params.append("long", position.coords.longitude);
  return fetch(
    process.env.REACT_APP_SERVER_URL + "/heatmap-data?" + params.toString()
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

function handleLocationError(map, browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
/*  global google map globalThis */
function useGoogleMap() {
  useLayoutEffect(() => {
    const positionPromise = getPosition();
    const heatmapPromise = positionPromise.then((position) =>
      fetchHeatmap(position)
    );

    function showHeatmap() {
      heatmapPromise.then((heatmapData) => {
        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData.map((point) => {
            return {
              location: new google.maps.LatLng(point.lat, point.long),
              weight: point.status_value,
            };
          }),
          radius: 20,
        });

        heatmap.setMap(map);
      });
    }

    function centerMap() {
      const map = globalThis.map;
      const infoWindow = new google.maps.InfoWindow();

      var icon =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAQlBMVEVMaXFCiv9Civ9Civ9Civ9Civ9Civ9Civ9Civ+Kt/9+r/9Pkv90qf9hnf9Civ9wpv9Ee/+Jtf9Gjf9/sP9Kj/9KXf+JdfukAAAACXRSTlMAGCD7088IcsuTBctUAAAAYUlEQVR4XlWOWQrAIBBDx302d73/VSu0UMxfQsgLAMSEzmGKcGRCkZylBHPyMJQmk44QIRWdVCuxlgQoRNLaoi4ILs/a9m6VszuGf4PSaX21eyD6oZ256/AHa/0L9RauOw+4XAWqGLX26QAAAABJRU5ErkJggg==";

      console.log("center map");

      positionPromise
        .then(
          function (position) {
            console.log(position);
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            var marker = new google.maps.Marker({
              map: map,
              position: pos,
              icon: icon,
            });

            map.setCenter(pos);
            marker.setPosition(pos);
            google.maps.event.trigger(map, "resize");
          },
          function () {
            handleLocationError(map, true, infoWindow, map.getCenter());
          }
        )
        .catch(() => {
          handleLocationError(map, false, infoWindow, map.getCenter());
        });
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
  }, []);
}

export default useGoogleMap;

import { useState, useEffect } from "react";

const randomLat = Math.random();
const randomLong = Math.random();
function randomizeInDev(coords) {
  return {
    latitude: coords.latitude + randomLat * 0.2 - 0.1,
    longitude: coords.longitude + randomLong * 0.2 - 0.1,
  };
}

export const usePosition = () => {
  const [position, setPosition] = useState({
    latitude: 48.145494,
    longitude: 17.1208062,
  });

  const onChange = ({ coords }) => {
    console.log(coords);
    if (process.env.NODE_ENV === "development") {
      setPosition(randomizeInDev(coords));
    } else {
      setPosition({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setPosition((pos) => ({ ...pos, error: "Geolocation is not supported" }));
      return;
    }

    const watcher = geo.watchPosition(onChange, (error) => {
      let x = "";
      console.log(error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          x = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          x = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          x = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
        default:
          x = "An unknown error occurred.";
          break;
      }
      setPosition((pos) => ({ ...pos, error: `${x} ${error.message}` }));
    });
    return () => geo.clearWatch(watcher);
  }, []);

  if (!position) {
    setPosition({ error: "Not Ready" });
  }

  return position;
};

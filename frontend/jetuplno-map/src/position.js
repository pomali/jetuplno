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
      setPosition((pos) => ({ ...pos, error: error.message }));
    });
    return () => geo.clearWatch(watcher);
  }, []);

  if (!position) {
    setPosition({ error: "Not Ready" });
  }

  return position;
};

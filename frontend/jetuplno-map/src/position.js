import React, { useState, useEffect } from "react";

const randomLat = Math.random();
const randomLong = Math.random();
function randomizeInDev(coords) {
  return {
    latitude: coords.latitude + randomLat * 0.2 - 0.1,
    longitude: coords.longitude + randomLong * 0.2 - 0.1,
    accuracy: coords.accuracy,
  };
}

export const usePosition = (getGpsPosition) => {
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
        accuracy: coords.accurac,
      });
    }
  };

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setPosition((x) => ({
  //       latitude: x.latitude + 0.001,
  //       longitude: x.longitude + 0.001,
  //     }));
  //   }, 3000);
  //   return () => {
  //     clearInterval(id);
  //   };
  // }, []);

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setPosition((pos) => ({
        ...pos,
        error:
          "Toto zariadenie nepodporuje geolokáciu. Ak si na smarfóne skús použiť novší internetový prehliadač.",
      }));
      return;
    }
    let watcher = null;
    if (getGpsPosition) {
      watcher = geo.watchPosition(onChange, (error) => {
        console.log(error);
        let x = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            x = (
              <>
                <p>
                  Nedal si nám povolenie na prístup k tvojej polohe{" "}
                  <span role="img" aria-label="smutný emoji">
                    😞
                  </span>
                </p>{" "}
                <p>
                  Pokračujeme v obmedzenom režime{" "}
                  <span role="img" aria-label="silný emoji">
                    💪
                  </span>
                  , ale ak chceš odosielať situáciu na mieste kde sa nachádzaš,
                  povoľ nám prístup ku geolokácii{" "}
                  <span role="img" aria-label="múdry emoji">
                    🤓
                  </span>
                </p>
              </>
            );
            break;
          case error.POSITION_UNAVAILABLE:
            x = "Nastal problém so získavaním tvojej polohy 🕵️‍♀️";
            break;
          case error.TIMEOUT:
            x =
              "Nestihol si nám dať prístup ku polohe. Nabudúce budeš rýchlejší 😉";
            break;
          case error.UNKNOWN_ERROR:
          default:
            x = "An unknown error occurred. ⁉️";
            break;
        }
        setPosition((pos) => ({
          ...pos,
          error: (
            <>
              {x} ({error.message})
            </>
          ),
          errorCode: error.code,
        }));
      });
    }
    return () => {
      if (watcher) {
        geo.clearWatch(watcher);
      }
    };
  }, [getGpsPosition]);

  return position;
};

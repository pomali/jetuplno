import { useState, useLayoutEffect } from "react";
import { log as originalLog } from "./log";

const log = originalLog.child({ module: "server" });

export function useFetchHeatmap(_position) {
  const [fetchState, setFetchState] = useState({
    state: "prefetch",
    heatmap: [],
    error: null,
  });

  useLayoutEffect(() => {
    fetchHeatmap()
      .catch((reason) => {
        if (reason === "network request failed") {
          return [];
        } else {
          throw reason;
        }
      })
      .then((heatmap) =>
        setFetchState({ state: "ready", heatmap, error: null })
      );
  }, []);

  return fetchState;
}

export function fetchHeatmap(position) {
  // if (position.error) {
  //   return Promise.reject("position");
  // }
  // const params = new URLSearchParams();
  // params.append("lat", position.latitude);
  // params.append("long", position.longitude);
  return fetch(
    process.env.REACT_APP_SERVER_URL + "/heatmap-data" // "?" + params.toString()
  )
    .then((x) => {
      log.info(x);
      return x;
    })
    .then(async (response) => {
      if (response.status !== 200) {
        // TODO
        log.error("nieco sa pokazilo");
        // throw Error("network request failed");
        return [];
      }
      const json = response.json();
      json.then((r) => log.info(r));
      return (await json).heatmap;
    });
}

export function useFetchPois(position) {
  const [fetchState, setFetchState] = useState({
    state: "prefetch",
    pois: [],
    error: null,
  });
  useLayoutEffect(() => {
    fetchPois().then((pois) =>
      setFetchState({ state: "ready", pois, error: null })
    );
  }, []);

  return fetchState;
}
export function fetchPois() {
  return fetch(process.env.REACT_APP_SERVER_URL + "/pois")
    .then((x) => {
      log.info({ response: x });
      return x;
    })
    .then(async (response) => {
      if (response.status !== 200) {
        // TODO
        console.error("nieco sa pokazilo");
        // throw Error("network request failed");
        return [];
      }
      const json = response.json();
      json.then((r) => log.info(r));
      return (await json).pois;
    });
}

import React from "react";
import Button from "./Button";

import { colorWhite, colorPurple } from "../colors";
import { HEATMAP_STATUS } from "../constants";
import { ReactComponent as CloudOutlineImg } from "../img/img2.svg";

import { log as originalLog } from "../log";
import gtag from "../gtag";
import { addScore } from "../score";

const log = originalLog.child({ module: "BottomButtons" });

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
      log.info({ response });
      addMessage({ message: response.message });
      addScore();
    })
    .catch((reason) => {
      log.error({ reason });

      // Show error on screen
      addMessage({ message: reason });

      // On failure remove optimistic update
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
    return Promise.reject(
      <div>
        <p>
          Neviem tvoju polohu{" "}
          <span role="img" aria-label="emotikon premýšlam">
            🤔
          </span>
        </p>{" "}
        {position.error}
      </div>
    );
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
      return {
        status: "ok",
        message: "Ďakujeme! 😊 Touto informáciou pomáhaš ostatným 👍",
      };
    } else {
      return { status: "error", message: await response.text() };
    }
  });
}

export default function BottomButtons({
  position,
  addMessage,
  setTemporaryHeatmap,
}) {
  return (
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
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  popularityToColor,
  cloudFullWhiteStyle,
  cloudFullPurpleStyle,
} from "../colors";

// import { ReactComponent as CloudOutlineImg } from "./img/img2.svg";
import { ReactComponent as CloudFullImg } from "../img/img1.svg";
import { ReactComponent as HeartImg } from "../img/img_heart.svg";
import currentPositionIcon from "../img/map_pin_whole.png";
import { HEATMAP_STATUS } from "../constants";

export function Cloud({ status, lat, lng }) {
  return (
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
}

export function Heart({ lat, lng, name, popularity }) {
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
        }}
      >
        {isOpen ? name : null}
      </span>
    </motion.div>
  );
}

export function CurrentPosMarker() {
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -100%)",
        zIndex: 2,
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

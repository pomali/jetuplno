import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  popularityToColor,
  colorWhite,
  colorPurple,
  cloudFullWhiteStyle,
  cloudFullPurpleStyle,
} from "../colors";

// import { ReactComponent as CloudOutlineImg } from "./img/img2.svg";
import { ReactComponent as CloudFullImg } from "../img/img1.svg";
import { ReactComponent as HeartImg } from "../img/img_heart.svg";
import currentPositionIcon from "../img/map_pin_whole.png";
import { HEATMAP_STATUS } from "../constants";

function Enlarger({ children, openAddon, size }) {
  if (typeof size == "undefined") {
    size = "28px";
  }
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
      variants={{
        open: { width: "80px", height: "80px", zIndex: 1 },
        closed: { width: size, height: size, zIndex: 0 },
      }}
      animate={isOpen ? "open" : "closed"}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
      }}
    >
      {children}
      {isOpen ? openAddon : null}
    </motion.div>
  );
}

export function Cloud({ status, time_added }) {
  return (
    <Enlarger
      openAddon={
        <span
          style={{
            position: "absolute",
            left: "36%",
            bottom: "31%",
            color: status === HEATMAP_STATUS.empty ? colorPurple : colorWhite,
          }}
        >
          {time_added}
        </span>
      }
    >
      <CloudFullImg
        className="markerSvg"
        style={{
          ...(status === HEATMAP_STATUS.empty
            ? cloudFullWhiteStyle
            : cloudFullPurpleStyle),
        }}
      />
    </Enlarger>
  );
}

export function Heart({ lat, lng, name, popularity }) {
  return (
    <Enlarger
      size="16px"
      openAddon={
        <span
          style={{
            position: "absolute",
            left: "17%",
            top: "17%",
          }}
        >
          {name}
        </span>
      }
    >
      <HeartImg
        lat={lat}
        lng={lng}
        className="markerSvg"
        style={{
          fill: popularityToColor(popularity),
        }}
      />
    </Enlarger>
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

import React from "react";
import useGoogleMap from "./googleMap";
import cloudOutlineImg from "./img/img2.svg";
import More from "./More";
import { motion } from "framer-motion";
import { colorPurple, colorWhite } from "./colors";

function Button({ style, text, onClick }) {
  return (
    <motion.button
      style={{
        height: "3.5em",
        width: "12em",
        border: 0,
        borderRadius: "3em",
        margin: "0.5em 1em",
        fontWeight: 500,
        ...style,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <img
        src={cloudOutlineImg}
        style={{
          width: "2em",
          marginRight: "5px",
        }}
        alt="Cloud Outline"
      ></img>
      {text}
    </motion.button>
  );
}

function App() {
  const sendPosition = useGoogleMap();

  return (
    <div>
      <More />
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
          text="Je tu prázdno"
          style={{ background: colorWhite, color: colorPurple }}
          onClick={() => sendPosition("empty")}
        />
        <Button
          text="Je tu plno"
          style={{ background: colorPurple, color: colorWhite }}
          onClick={() => sendPosition("full")}
        />
      </div>
    </div>
  );
}

export default App;

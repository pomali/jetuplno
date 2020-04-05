import React from "react";
import useGoogleMap from "./googleMap";
import cloudOutlineImg from "./img2.svg";

const colorPurple = "rgb(43,25,138)";
const colorWhite = "rgb(255,255,255)";

function Button({ style, text, onClick }) {
  return (
    <button
      style={{
        height: "3em",
        width: "12em",
        border: 0,
        borderRadius: "3em",
        ...style,
      }}
      onClick={onClick}
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
    </button>
  );
}

function App() {
  const sendPosition = useGoogleMap();

  return (
    <div>
      <div
        style={{
          width: "100%",
          position: "fixed",
          bottom: "0.5em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
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

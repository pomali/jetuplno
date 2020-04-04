import React from "react";
import "./App.css";
// import SimpleMap from './SimpleMap';
// import MyMapComponent from "./Map3";
// import LLMap from "./LeafletMap";

function Button({ style, text }) {
  return (
    <button style={{ height: "100%", width: "50%", border: 0, ...style }}>{text}</button>
  );
}

function App() {
  return (
    <div className="App">
      {/* <LLMap /> */}
      {/* <SimpleMap/> */}
      {/* <MyMapComponent /> */}
      <div
        style={{
          width: "100%",
          height: "10vh",
        }}
      >
        <Button text="Plno 🌖" style={{ background: "red" }} />
        <Button text="Prázdno 🌘" style={{ background: "green" }} />
      </div>
    </div>
  );
}

export default App;

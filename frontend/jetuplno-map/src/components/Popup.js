import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import "./Popup.css";
import { colorPurple, colorWhite } from "../colors";

function Popup(props) {
  const handleClose = () => {
    if (props.onCloseMessage) {
      props.onCloseMessage();
    }
  };

  return (
    <motion.div
      className="popup-overlay"
      onClick={handleClose}
      variants={{
        open: { opacity: 1, display: "block" },
        closed: {
          opacity: 0,
          transitionEnd: {
            display: "none",
          },
        },
      }}
      style={{ opacity: 0, display: "none" }}
      animate={props.messages.length > 0 ? "open" : "closed"}
    >
      {props.messages.length > 0 ? (
        <div className="popup-box">
          <div className="popup-content">{props.messages[0].message}</div>
          <Button style={{ background: colorPurple, color: colorWhite }}>
            Close
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}

export default Popup;

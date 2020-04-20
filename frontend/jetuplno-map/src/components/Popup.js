import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import "./Popup.css";
import { colorPurple, colorWhite } from "../colors";

function Popup(props) {
  const currentMessage = props.messages.length > 0 ? props.messages[0] : null;

  const handleClose = () => {
    if (currentMessage.onClose) {
      currentMessage.onClose();
    }

    if (props.onCloseMessage) {
      props.onCloseMessage();
    }
  };

  return (
    <motion.div
      className="popup-overlay"
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
      animate={currentMessage ? "open" : "closed"}
    >
      {currentMessage ? (
        <div className="popup-box">
          <div className="popup-content">{currentMessage.message}</div>
          <Button
            style={{ background: colorPurple, color: colorWhite }}
            onClick={handleClose}
          >
            OK
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}

export default Popup;

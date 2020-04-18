import React from "react";
import { motion } from "framer-motion";


export default function Button({ style, children, onClick }) {
  return (
    <motion.button
      style={{
        height: "3.5em",
        width: "12em",
        border: 0,
        borderRadius: "3em",
        margin: "0.5em",
        fontSize: "1rem",
        fontWeight: 500,
        ...style,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
}

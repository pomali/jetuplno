import React from "react";
import { colorPurple, colorWhite } from "../colors";
import { motion } from "framer-motion";

export default function MapControls({
  setZoom,
  isMapMoved,
  setIsMapMoved,
  setCenterPosition,
}) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: "40%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        flexDirection: "column",
      }}
    >
      <motion.button
        style={{
          fill: colorPurple,
          background: colorWhite,
          width: "1.5em",
          height: "1.5em",
          border: 0,
          borderTopLeftRadius: "3em",
          borderTopRightRadius: "3em",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          margin: "0 0.5rem",
          fontSize: "2rem",
          fontWeight: 500,
          padding: 0,
        }}
        variants={{
          on: {
            fill: colorPurple,
          },
          off: {
            fill: colorWhite,
            stroke: colorPurple,
          },
        }}
        animate={isMapMoved ? "off" : "on"}

        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsMapMoved((x) => !x);
          // setCenterPosition((x) => {
          //   return { ...x };
          // });
        }}
      >
        <svg
          style={{ width: "1em", height: "1em" }}
          width="31"
          height="31"
          viewBox="0 0 31 31"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M31 13.5625H27.9446C27.1076 8.16656 22.8334 3.89244 17.4375 3.05544V0H13.5625V3.05544C8.16656 3.89244 3.89244 8.16656 3.05544 13.5625H0V17.4375H3.05544C3.89244 22.8334 8.16656 27.1076 13.5625 27.9446V31H17.4375V27.9446C22.8334 27.1076 27.1076 22.8334 27.9446 17.4375H31V13.5625ZM24.0017 13.5625H20.9812C20.397 11.9108 19.0892 10.602 17.4375 10.0188V6.99825C20.6925 7.73934 23.2597 10.3075 24.0017 13.5625ZM15.5 17.4375C14.4295 17.4375 13.5625 16.5705 13.5625 15.5C13.5625 14.4295 14.4295 13.5625 15.5 13.5625C16.5705 13.5625 17.4375 14.4295 17.4375 15.5C17.4375 16.5705 16.5705 17.4375 15.5 17.4375ZM13.5625 6.99825V10.0188C11.9108 10.603 10.602 11.9108 10.0188 13.5625H6.99825C7.73934 10.3075 10.3075 7.74031 13.5625 6.99825ZM6.99825 17.4375H10.0188C10.603 19.0892 11.9108 20.398 13.5625 20.9812V24.0017C10.3075 23.2607 7.74031 20.6925 6.99825 17.4375ZM17.4375 24.0017V20.9812C19.0892 20.397 20.398 19.0892 20.9812 17.4375H24.0017C23.2607 20.6925 20.6925 23.2597 17.4375 24.0017Z" />
          <circle cx="15.5" cy="15.5" r="6.64286" fill="white" />
          <path d="M13.5071 15.3339C13.0488 15.3339 12.6768 15.7059 12.6768 16.1643C12.6768 16.6226 13.0488 16.9946 13.5071 16.9946C13.9655 16.9946 14.3375 16.6226 14.3375 16.1643C14.3375 15.7059 13.9655 15.3339 13.5071 15.3339ZM17.4928 15.3339C17.0345 15.3339 16.6625 15.7059 16.6625 16.1643C16.6625 16.6226 17.0345 16.9946 17.4928 16.9946C17.9512 16.9946 18.3232 16.6226 18.3232 16.1643C18.3232 15.7059 17.9512 15.3339 17.4928 15.3339ZM15.5 8.85714C11.8331 8.85714 8.85712 11.8331 8.85712 15.5C8.85712 19.1669 11.8331 22.1429 15.5 22.1429C19.1668 22.1429 22.1428 19.1669 22.1428 15.5C22.1428 11.8331 19.1668 8.85714 15.5 8.85714ZM15.5 20.8143C12.5705 20.8143 10.1857 18.4295 10.1857 15.5C10.1857 15.3074 10.199 15.1147 10.2189 14.9287C11.7866 14.2312 13.0288 12.9491 13.6798 11.3615C14.8822 13.0621 16.8618 14.1714 19.1004 14.1714C19.6185 14.1714 20.1168 14.1116 20.595 13.9987C20.7345 14.4704 20.8143 14.9752 20.8143 15.5C20.8143 18.4295 18.4295 20.8143 15.5 20.8143Z" />
        </svg>
      </motion.button>
      <motion.button
        onClick={() => setZoom((x) => x + 1)}
        style={{
          background: colorWhite,
          width: "1.5em",
          height: "1.5em",
          border: 0,
          borderRadius: 0,
          margin: "0 0.5rem",
          fontSize: "2rem",
          fontWeight: 500,
          color: colorPurple,
        }}
        whileTap={{ scale: 0.9 }}
      >
        +
      </motion.button>
      <motion.button
        onClick={() => setZoom((x) => x - 1)}
        style={{
          background: colorWhite,
          width: "1.5em",
          height: "1.5em",
          border: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "3em",
          borderBottomRightRadius: "3em",
          margin: "0 0.5rem",
          fontSize: "2rem",
          fontWeight: 500,
          color: colorPurple,
        }}
        whileTap={{ scale: 0.9 }}
      >
        -
      </motion.button>
    </div>
  );
}

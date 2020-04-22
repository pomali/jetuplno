import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  colorPurple,
  cloudFullWhiteStyle,
  cloudFullPurpleStyle,
  popularityToColor,
  colorWhite,
} from "./colors";
// import { Github, Twitter } from "@icons-pack/react-simple-icons";
import Github from "@icons-pack/react-simple-icons/lib/Github";
import Twitter from "@icons-pack/react-simple-icons/lib/Twitter";

import { ReactComponent as CloudFullImg } from "./img/img1.svg";
import { ReactComponent as HeartImg } from "./img/img_heart.svg";
import currentPositionIcon from "./img/map_pin_whole.png";

import "./More.css";
import { getScore } from "./score";

const wrapperStyle = {
  position: "fixed",
  left: "0",
  top: "0",
  width: "auto",
  height: "auto",
  zIndex: 100,
};

const innerStyle = {
  background: "#fff",
  // color: colorPurple,
  margin: "1em",
  borderRadius: "1em",
  transition: "height 1s ease 1s",
};

const btnStyle = {
  width: "2em",
  height: "2em",
  borderRadius: "2em",
  border: "1px solid",
  color: colorPurple,
  borderColor: colorPurple,
  background: colorWhite,
  fontWeight: "bolder",
  fontSize: "1.1rem",
  position: "absolute",
  // fontStyle: "italic",
};

const variants = {
  open: {
    opacity: 1,
    // x: 0,
    width: "100%",
    height: "auto",
  },
  closed: {
    opacity: 0,
    // x: "-100%",
    width: 0,
    height: 0,
  },
};

function Content({ isOpen }) {
  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      style={{ overflow: "auto", maxHeight: "calc(100vh - 2em)" }}
    >
      <div style={{ padding: "1em 2em" }}>
        <h1>jetuplno</h1>
        <p>
          Cieľom <b>jetuplno</b> je inforomvať používateľov o zaplnenosti
          verejných priestorov, najmä v čase obmedzení v súvislosti s
          koronavírusom COVID-19.
        </p>

        <h2>Pomohol si: {getScore()}-krát</h2>

        <h2>Legenda</h2>

        <div className="legend">
          <table>
            <tbody>
              <tr>
                <td>
                  <CloudFullImg style={cloudFullPurpleStyle} />{" "}
                </td>
                <td> je tu plno</td>
              </tr>
              <tr>
                <td>
                  <CloudFullImg style={cloudFullWhiteStyle} />
                </td>
                <td> je tu prázdno</td>
              </tr>
              <tr>
                <td>
                  <img
                    style={{
                      height: "1.5em",
                      width: "auto",
                    }}
                    src={currentPositionIcon}
                    width={31}
                    height={44}
                    alt="current position"
                  />
                </td>
                <td> tu si</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td>
                  <HeartImg
                    style={{
                      fill: popularityToColor(3),
                    }}
                  />
                </td>
                <td> veľmi známe miesto</td>
              </tr>
              <tr>
                <td>
                  <HeartImg
                    style={{
                      fill: popularityToColor(2),
                    }}
                  />
                </td>
                <td> stredne známe miesto</td>
              </tr>
              <tr>
                <td>
                  <HeartImg
                    style={{
                      fill: popularityToColor(1),
                    }}
                  />
                </td>
                <td> menej známe miesto</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>O vzniku</h2>
        <p>
          <b>jetuplno</b> vzniklo počas{" "}
          <a href="https://www.hackthecrisis.sk/">Hack the Crisis SK</a>, kde sa
          nám podarilo umiestniť v top 7 z 31 projektov.
        </p>

        <p>Za spoluprácu ďakujeme mestu Bratislava.</p>

        <h3>Autori</h3>
        <ul>
          <li>
            Stanislav Párnický (dev){" "}
            <a
              href="https://twitter.com/_pomali?ref_src=jetuplno"
              // eslint-disable-next-line react/jsx-no-target-blank
              target="_blank"
              rel="noopener"
            >
              <Twitter
                color={colorPurple}
                size={20}
                style={{
                  verticalAlign: "middle",
                }}
              />
            </a>
          </li>
          <li>Mária Dzureková (PR)</li>
          <li>Martin Žofaj (gamification)</li>
          <li>Anna Ulahelova (UX)</li>
          <li>Damián Leporis (data)</li>
        </ul>

        <p>
          Zdrojový kód nájdete na{" "}
          <a href="https://github.com/pomali/jetuplno/">
            GitHub-e
            <Github color="black" fill="black" size={20} />
          </a>
        </p>
        <h2>Privacy policy</h2>
        <p>
          Používame tvoju polohu, keď stlačíš tlačidlo "Je tu plno" alebo "Je tu
          prázdno". Polohu posielame bez identifikátoru a ukladáme spolu s
          časom (aby sme vedeli mazať staré polohy). Všetky polohy používame na
          zobrazenie miest, ktoré sú plné a ktoré sú prázdne.
        </p>
        <p>
          Používame cookies kvôli{" "}
          <a href="https://policies.google.com/technologies/types?hl=sk">
            Google Analytics
          </a>{" "}
          a aby sme ti stále neukazovali uvítanie.
        </p>
        <p style={{ color: "grey" }}>
          {`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`}
        </p>
      </div>
    </motion.div>
  );
}

export default function More(props) {
  const [isOpen, setIsOpen] = useState(false);
  const openStyle = isOpen
    ? {
        width: "100%",
        height: "100%",
      }
    : null;
  return (
    <motion.div
      style={{ ...wrapperStyle, ...openStyle }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { background: "rgba(240, 240, 240, 0.7)" },
        closed: { background: "rgba(240, 240, 240, 0)" },
      }}
    >
      <div style={innerStyle}>
        <motion.button
          style={btnStyle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen((x) => !x);
          }}
        >
          {isOpen ? "╳" : "i"}
        </motion.button>
        <Content isOpen={isOpen} />
      </div>
    </motion.div>
  );
}

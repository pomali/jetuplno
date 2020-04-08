import React, { useState } from "react";
import { motion } from "framer-motion";
import { colorPurple } from "./colors";
// import { Github, Twitter } from "@icons-pack/react-simple-icons";
import  Github  from "@icons-pack/react-simple-icons/lib/Github";
import  Twitter  from "@icons-pack/react-simple-icons/lib/Twitter";

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
  width: "3em",
  height: "3em",
  borderRadius: "3em",
  border: "1px solid",
  borderColor: colorPurple,
  fontWeight: "bolder",
  position: "absolute",
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
  console.log(isOpen);
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
          je aplikácia, ktorá zbiera dáta o zaplnení verejných priestorov od
          používateľov, a informuje kde nie je príliš veľa ľudí pre bezpečnenjší
          pohyb v časoch rozšíreného COVID-19.
        </p>
        <h2>O vzniku</h2>
        <p>
          <b>jetuplno</b> vzniklo počas{" "}
          <a href="https://www.hackthecrisis.sk/">Hack the Crisis SK</a>, kde sa
          nám podarilo umiestniť v top 7 z 31 projektov.
        </p>

        <p>Za spoluprácu ďakujeme aj mestu Bratislava,...</p>

        <h3>Autori</h3>
        <ul>
          <li>
            Stanislav Párnický{" "}
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
          <li>Mária Dzureková</li>
          <li>Martin Žofaj</li>
          <li>Anna Ulahelova</li>
          <li>Damián Leporis</li>
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
          Používame tvoju polohu keď stlačíš tlačidlo "Je tu plno" alebo "Je tu
          prázdno". S polohu posielame bez identifikátoru a ukladáme spolu s
          časom (aby sme vedeli mazať staré polohy). Všetky polohy používame na
          zobrazenie miest ktoré sú plné a ktoré sú prázdne.
        </p>
        <p>
          Používame cookies kvôli{" "}
          <a href="https://policies.google.com/technologies/types?hl=sk">
            Google Analytics
          </a>
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
          {isOpen ? "X" : "?"}
        </motion.button>
        <Content isOpen={isOpen} />
      </div>
    </motion.div>
  );
}

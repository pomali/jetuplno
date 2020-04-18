// import bunyan from "bunyan";

// export const log = bunyan.createLogger({ name: "jetuplno-map" });

export const log = {
  info: console.log,
  error: console.error,
  child: () => log,
};

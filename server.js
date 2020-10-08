/** Server startup for app.js */
const server = require("./app");
const nodeEnv = process.env.NODE_ENV || "development";

const PORT = 8124;
server.listen(PORT, () => {
  console.log("Express server listening on port %d in %s mode", PORT, nodeEnv);
});

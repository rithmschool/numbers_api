const server = require("./graphql_app");
const nodeEnv = process.env.NODE_ENV || "development";
const PORT = 4001;
server.listen(PORT, () => {
  console.log("Express server listening on port %d in %s mode", PORT, nodeEnv);
});

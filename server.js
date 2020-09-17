const app = require("./app");
const nodeEnv = process.env.NODE_ENV || "development";

const PORT = 8124;
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, nodeEnv);

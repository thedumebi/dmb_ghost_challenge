const cors = require("./cors");
const error = require("./error");

module.exports = {
  ...cors,
  ...error,
};

const fs = require("fs");

const read_file = (fileName) => {
  return JSON.parse(fs.readFileSync(`./models/${fileName}`));
};

const write_file = (fileName, data) => {
  fs.writeFileSync(`./models/${fileName}`, JSON.stringify(data, null, 2));
};

module.exports = {
  read_file,
  write_file
}
const fs = require("fs");

const readFile = (fileName) => {
  return JSON.parse(fs.readFileSync(`./models/${fileName}`));
};

const writeFile = (fileName, data) => {
  fs.writeFileSync(`./models/${fileName}`, data);
};

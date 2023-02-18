const http = require("http");
const { read_file, write_file } = require("./fs-functions/fs");
const productsFileName = "products.json";
const options = { "content-type": "aplication/json" };

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/products/list") {
      res.writeHead(200, options);
      res.end(JSON.stringify(read_file(productsFileName)));
    }
  }

  if (req.method === "POST") {
    if (req.url === "/create/product") {
      req.on("data", (chunk) => {
        const newProduct = JSON.parse(chunk);
        const products = read_file(productsFileName);
        products.push({
          id: products[products.length - 1]
            ? products[products.length - 1].id + 1
            : 1,
          ...newProduct,
        });
        write_file(productsFileName, products);
        res.writeHead(201, options);
        res.end(JSON.stringify({ msg: "Successfully created"}))
      });
    }
  }
});

server.listen(3000, () => {
  console.log("server is running on 3000 port");
});

const http = require("http");
const { read_file, write_file } = require("./fs-functions/fs");
const productsFileName = "products.json";
const options = {
  "content-type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const server = http.createServer((req, res) => {
  const productId = +req.url.split("/")[3];

  if (req.method === "GET") {
    if (req.url === "/product/list") {
      res.writeHead(200, options);
      res.end(JSON.stringify(read_file(productsFileName)));
    }
    if (req.url === `/product/retrieve/${productId}`) {
      const productsArr = read_file(productsFileName);
      const fond = productsArr.find(({ id }) => id === productId);
      if (fond) {
        res.writeHead(200, options);
        res.end(JSON.stringify(fond));
      } else {
        res.writeHead(404, options);
        res.end(JSON.stringify({ msg: "Product not found" }));
      }
    }
  }

  if (req.method === "POST") {
    if (req.url === "/product/create") {
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
        res.end(JSON.stringify({ msg: "Successfully created" }));
      });
    }
  }

  if (req.method === "PUT") {
    if (req.url === `/product/update/${productId}`) {
      req.on("data", (newData) => {
        const { title, price } = JSON.parse(newData);
        const productsArr = read_file(productsFileName);
        let fileChanged = false;

        productsArr.forEach((product) => {
          if (product.id === productId) {
            product.title = title ? title : product.title;
            product.price = price ? price : product.price;
            fileChanged = true;
            res.writeHead(200, options);
            return res.end(JSON.stringify({ msg: "Successfully updated!" }));
          }
        });

        write_file(productsFileName, productsArr);
        if (!fileChanged) {
          res.writeHead(404, options);
          res.end(JSON.stringify({ msg: "Product not founded" }));
        }
      });
    }
  }

  if (req.method === "DELETE") {
    if (req.url === `/product/destroy/${productId}`) {
      const productsArr = read_file(productsFileName);
      const destroy = productsArr.findIndex(
        (product) => product.id == productId
      );

      if (destroy == -1) {
        res.writeHead(404, options);
        res.end(JSON.stringify({ msg: "Product not found" }));
      } else {
        productsArr.splice(destroy, 1);
        write_file(productsFileName, productsArr);
        console.log(productsArr);
        res.writeHead(200, options);
        res.end(JSON.stringify({ msg: "Deleted!" }));
      }
    }
  }
});

server.listen(3000, () => {
  console.log("server is running on 3000 port");
});

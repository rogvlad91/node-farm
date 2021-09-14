const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate"); ///Подключаем свой модуль

////////SERVER//////////////

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const dataObj = JSON.parse(data); /// парсим данные в массив dataObj из джейсона

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); /// запрашиваем у объекта урл его query - тип айди
  ///pathname - где находится

  //Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(""); /// заменяем в темплейт карточках динамически все на те вещи, которые в джецсоне
    const output = tempOverview.replace("%PRODUCT_CARDS%}", cardsHtml); /// заменяем карточки в овервью
    res.end(output);
  }

  // Product
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id]; /// выбмраем из джейсона нужную информауию по айди
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  ///API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  ///NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello World",
    });
    res.end("<h1>This page cannot be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to port 8000");
});

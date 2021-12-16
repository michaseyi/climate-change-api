const PORT = process.env.PORT || 3000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = newspaper.base + $(this).attr("href");

        articles.push({ title, url, source: newspaper.name });
      });
    })
    .catch((error) => {
      console.log(error.code);
    });
});

app.get("/", (req, res) => {
  res.json("Welcome to my first api");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperid", (req, res) => {
  const newspaperId = req.params.newspaperid;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaperId === newspaper.name
  )[0].address;

  const newspaperBase = newspapers.filter(
    (newspaper) => newspaperId === newspaper.name
  )[0].base;

  const specificArticle = [];
  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = newspaperBase + $(this).attr("href");

        specificArticle.push({ title, url, source: newspaperId });
      });
      res.json(specificArticle);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

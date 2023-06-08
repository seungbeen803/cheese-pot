// const express = require("express");
// const app = express();
// const test = require(".//Router/test");

// app.use("/", test);

// const port = 5000; //React가 3000번 포트를 사용하기 때문에 node 서버가 사용할 포트넘버는 다른 넘버로 지정해준다.
// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });

let express = require("express");
let ejs = require("ejs");
let app = express();
let path = require("path");
var mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

require("dotenv").config();

var dbconn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD,
  database: "cheesepot",
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("/ 시작");

  res.render("index");
});

app.get("/order", (req, res) => {
  let order = req.query.order;
  console.log(`/order 시작`);
  if (order == "AtoZ") {
    dbconn.query("SELECT * FROM contents order by contit", (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        console.log(results);
        res.send(results);
      }
    });
  } else if (order == "price") {
    dbconn.query("SELECT * FROM contents order by contit", (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        console.log(results);
        res.send(results);
      }
    });
  } else if (order == "open") {
    dbconn.query("SELECT * FROM contents order by open", (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        console.log(results);
        res.send(results);
      }
    });
  } else if (order == "genre") {
    dbconn.query("SELECT * FROM contents order by genre", (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        console.log(results);
        res.send(results);
      }
    });
  }
});

app.get("/search", (req, res) => {
  let search = req.query.search;
  console.log(`/search 시작`);
  //console.log("search 는" + search + "다");
  dbconn.query(
    "SELECT * FROM contents WHERE contit LIKE ?",
    ["%" + search + "%"],
    (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        console.log(results);
        res.send(results);
      }
    }
  );
});

app.get("/api/content/:content", (req, res) => {
  console.log(`/get/${req.params.content} 시작`);
  dbconn.query(
    "select * from contents where conca=?",
    [req.params.content],
    (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        res.send(results);
        // res.render("movie", { datalist: results });
      }
    }
  );
});

const joinquery = 'left outer join contents on location.connum=contents.connum';
app.get(`/api/bookmarks`, (req, res) => {
  //req query
  dbconn.query(
    `select contit,location.connum,locnum,potolin from location ${joinquery} where locnum in (${req.query.locnum})`,
    (err, results) => {
      if (err) {
        // where locnum()
        console.log("db select error" + err);
      } else {
        res.send(results);
      }
    }
  );
});

app.get(`/api/locdata/:connum`, (req, res) => {
  // let { conca, connum } = req.params;
  dbconn.query(
    "select * from location where connum=?",
    [parseInt(req.params.connum)],
    (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        res.send(results);
      }
    }
  );
});

app.get(`/api/locdetail/:locnum`, (req, res) => {
  let { connum, locnum } = req.params;
  dbconn.query(
    "select * from location where locnum=?",
    [parseInt(locnum)],
    (err, results) => {
      if (err) {
        console.log("db select error" + err);
      } else {
        res.send(results);
      }
    }
  );
});

app.listen(5000, () => {
  console.log("5000 서버가 시작");
});

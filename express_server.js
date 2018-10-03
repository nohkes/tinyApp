var express = require("express");
var app = express();
var PORT = 8080; // default port 8080



const bodyParser = require("body-parser");


function generateRandomString () {
let r = Math.random().toString(36).substring(7);
return r;
}

var giveMeNum = generateRandomString();

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});



app.get("/url", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)	
});
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  // let shortURL = req.params[shortURL]
  // let shortURL = generateRandomString();
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body); 
  urlDatabase[giveMeNum] = req.body.longURL;
  // let shortURL = generateRandomString() // debug statement to see POST parameters
  // urlDatabase[shortURL] = req.body.longURL;
  res.redirect("http://localhost:8080/urls/" + giveMeNum);         // Respond with 'Ok' (we will replace this)
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
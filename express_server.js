var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString () {
let r = Math.random().toString(36).substring(7);
return r;
}


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


app.set("view engine", "ejs")




const getEmailsbyPerson = email => {
	console.log({email});
	console.log(users);
	for (var key in users) {
		console.log({key});
		if (users[key].email === email){

			return users[key];
		}	
	}
	return null;
}



app.get("/login", (req, res) => {
	res.render("login");
})


app.post("/login", (req, res) => {
// 	res.cookie("username", req.body.username)
// 	res.redirect("/urls")
const {email, password} = req.body;
	console.log({email, password})
	if (email && password) {
		const user = getEmailsbyPerson(email);
		console.log("user : ", user);
		
		if(user.password === password){
			res.cookie("user_id", user.id)
			res.redirect("/urls");
		} else {

			console.log("404");
			res.redirect("/login")
		}
	} else {
		console.log("404");
		res.redirect("/login")
	} 
})

app.post("/logout", (req, res) => {
	res.clearCookie("email", req.body.email)
	res.redirect("/login")
})

app.get("/register", (req, res) => {
	res.render("register");
})

app.post("/register", (req, res)=> {
const {email, password} = req.body; //single username
	if (email && password) {
		const userID = generateRandomString();
			const user = {
				id: userID,
				email: email,
				password: password
			};
			users[userID] = user;
		console.log({user});
			res.cookie("user_id", user.id)
			res.redirect("/urls")
		} else {
			console.log("400");
			res.redirect("/register")
		}	

})
  

app.get("/urls/new", (req, res) => {
  let templateVars = {user_id : req.cookies["user_id"]}
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, 
  // const user = fetchUser(parseInt(req.cookies.user_id, 10));
  user_id : req.cookies["user_id"]}
  res.render("urls_index", templateVars)	
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id],
  user_id : req.cookies["user_id"]}
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
  var giveMeNum = generateRandomString();

  urlDatabase[giveMeNum] = req.body.longURL;

  // let shortURL = generateRandomString() // debug statement to see POST parameters
  // urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + giveMeNum);         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
delete urlDatabase[req.params.id];
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
	urlDatabase[req.params.id] = req.body.changeURL
	res.redirect("/urls")
})

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
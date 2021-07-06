require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.set("view engine", "ejs");

const bodyParser = require('body-parser');
const expressSession = require("express-session");
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }));
 
const User = require("./models/User");

app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/login');
  }
  next()
}

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

//const { PORT } = process.env;
const { PORT, MONGODB_URI } = process.env;


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

/*Esto ahora lo lleva el controller
app.get("/tasters", (req, res) => {
  res.render("tasters");
});
*/

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

//Mongoose
const mongoose = require("mongoose");

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//*************************REVIEWS CONTROLLER*************************

const reviewController = require("./controllers/review");
app.get("/reviews", reviewController.list);

app.get("/reviews/delete/:id", reviewController.delete);
//app.get("/create-review", reviewController.createView);
app.get("/create-review", authMiddleware, (req, res) => {
  res.render("create-review", { errors: {} });
});

app.post("/create-review", reviewController.create);

app.get("/reviews/update/:id", reviewController.edit);
app.post("/reviews/update/:id", reviewController.update);
//*************************USER CONTROLLER*************************
const userController = require("./controllers/user");
app.get("/users", userController.list);
app.get("/users/delete/:id", userController.delete);
//This line shows the form
app.get("/join", (req, res) => {
  
  res.render("create-user", {errors: {}});
});
app.post("/create-user", userController.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})



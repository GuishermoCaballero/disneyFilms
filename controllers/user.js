const User = require("../models/User");
const bcrypt = require('bcrypt');
const session = require("express-session");

exports.list = async (req, res) => {
  try {
    const users = await User.find({});
    res.render("users", { users: users });
  } catch (e) {
    res.status(404).send({ message: "could not list users" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndRemove(id);
    res.redirect("/users");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

//res.send("done");

exports.create = async (req, res) => {
  let user = new User({ email: req.body.email, password: req.body.password, country: req.body.country, age: req.body.age });
  try {
    await user.save();
    console.log(user)
    res.redirect('/')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-user', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.render('login-user', { errors: { email: { message: 'email not found' } } })
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      
      req.session.userID = user.id;
      console.log(req.session.userID);
      res.redirect('/reviews');
      
      return
      console.log('authenticated');
    }

    res.render('login-user', { errors: { password: { message: 'password does not match' } } })


  } catch (e) {
    console.log(e);
  }
}




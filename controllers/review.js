const Review = require("../models/Review");

exports.list = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.render("reviews", { reviews: reviews });
  } catch (e) {
    res.status(404).send({ message: "could not list reviewsdsasda" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Review.findByIdAndRemove(id);
    res.redirect("/reviews");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};


exports.createView = async (req, res) => {
  try {
    res.render("create-review");

  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}

exports.create = async (req, res) => {   
  let review = new Review({ title: req.body.title, Running_time_int: req.body.Running_time_int, Release_date_datetime: req.body.Release_date_datetime, Budget: req.body.Budget, imdb_rating: req.body.imdb_rating, rotten_tomatoes: req.body.rotten_tomatoes });
  try {
   await review.save();
   res.redirect('/reviews')
 } catch (e) {
   return res.status(400).send({
     message: JSON.parse(e),
   });  
 }
}
//////////////////// EDIT FUNCTIONS

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const review = await Review.findById(id);
    res.render('update-review', { review: review, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find review ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const review = await Review.updateOne({ _id: id }, req.body);
    res.redirect('/reviews');
  } catch (e) {
    res.status(404).send({
      message: `could find taster ${id}.`,
    });
  }
};

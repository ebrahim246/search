const router = require("express").Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  authors: [{type: String, required: true}],
  description: String,
  image: {type: String, trim: true},
  link: {type: String, trim: true},
  date: { type: Date, default: Date.now }
});

const DBBook = mongoose.model("Book", bookSchema);

const controllerDB = {
  findAll: function (req, res) {
    DBBook
      .find(req.query)
      .sort({
        date: -1
      })
      .then(mm => res.json(mm))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    DBBook
      .findById(req.params.id)
      .then(mm => res.json(mm))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    DBBook
      .create(req.body)
      .then(mm => res.json(mm))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    DBBook
      .findOneAndUpdate({
        _id: req.params.id
      }, req.body)
      .then(mm => res.json(mm))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    DBBook
      .findById({
        _id: req.params.id
      })
      .then(mm => mm.remove())
      .then(mm => res.json(mm))
      .catch(err => res.status(422).json(err));
  }
};
router.route("/")
  .get(controllerDB.findAll)
  .post(controllerDB.create);

router
  .route("/:id")
  .get(controllerDB.findById)
  .put(controllerDB.update)
  .delete(controllerDB.remove);
module.exports = router;

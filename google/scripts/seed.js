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

mongoose.connect("mongodb://localhost/googlebooks", {
  useNewUrlParser: true,
  useFindAndModify: false,
   useUnifiedTopology: true
});
const bookSeed = [{
    authors: ["Suzanne Collins"],
    description: "Set in a dark vision of the near future, a terrifying reality TV show is taking place. Twelve boys and twelve girls are forced to appear in a live event called The Hunger Games. There is only one rule: kill or be killed. When sixteen-year-old Katniss Everdeen steps forward to take her younger sister's place in the games, she sees it as a death sentence. But Katniss has been close to death before. For her, survival is second nature.",
    image: "http://books.google.com/books/content?id=sazytgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    link: "http://books.google.com/books?id=sazytgAACAAJ&dq=title:The+Hunger+Games&hl=&source=gbs_api",
    title: "The Hunger Games",
}]

DBBook
  .remove({})
  .then(() => DBBook.collection.insertMany(bookSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

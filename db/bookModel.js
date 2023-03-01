const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    comments: [String],
    commentcount: {type: Number, default: 0}
});

const bookModel = mongoose.model("book", bookSchema);


module.exports = bookModel;
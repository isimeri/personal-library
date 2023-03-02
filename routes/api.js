/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const express = require('express');
const router = express.Router();
const bookModel = require("../db/bookModel.js");
const { Types: { ObjectId } } = require('mongoose');



router.get("/", async (req, res) => {
  //response will be array of book objects
  //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
  const bookArr = await bookModel.find().select({ __v: 0, comments: 0 });
  res.json(bookArr);
});

router.post('/', async (req, res) => {
  let title = req.body.title;

  if (!title) {
    return res.send("missing required field title");
  }
  //response will contain new book object including atleast _id and title
  const newBook = new bookModel({
    title: title,
    comments: []
  });

  newBook.save((err, data) => {
    if (err) {
      return res.json({ error: `could not create a new book ${err}` });
    }
    return res.json({ _id: data._id, title: data.title });
  });
});

router.delete('/', async (req, res) => {
  await bookModel.deleteMany();
  //if successful response will be 'complete delete successful'
  res.send("complete delete successful");
});


router.get("/:id", async (req, res) => {
  let bookid = req.params.id;
  let book;
  if (ObjectId.isValid(bookid)) {

    book = await bookModel.findById(bookid);
    if (!book) {
      return res.send("no book exists");
    }
  } else {
    return res.send("no book exists");
  }
  //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
  res.json(book);
});

router.post("/:id", async (req, res) => {
  let bookid = req.params.id;
  let comment = req.body.comment;
  let book;
  //json res format same as .get
  if (!comment) {
    return res.send('missing required field comment');
  }

  if (ObjectId.isValid(bookid)) {

    book = await bookModel.findById(bookid);
    if (!book) {
      return res.send("no book exists");
    }
  } else {
    return res.send("no book exists");
  }

  book.comments.push(comment);
  book.commentcount++;

  book.save((err, data) => {
    if (err) {
      return res.json({ error: `could not add a new comment ${err}` });
    }
    res.json(data);
  });
});

router.delete("/:id", async (req, res) => {
  let bookid = req.params.id;
  //if successful response will be 'delete successful'
  let book;

  if (ObjectId.isValid(bookid)) {

    book = await bookModel.findById(bookid);
    if (!book) {
      return res.send("no book exists");
    }
  } else {
    return res.send("no book exists");
  }

  await book.delete();
  res.send("delete successful");
});

module.exports = router;
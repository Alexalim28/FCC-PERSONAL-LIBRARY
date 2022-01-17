"use strict";
const { ObjectId } = require("mongodb");

module.exports = function (app, database) {
  app
    .route("/api/books")
    .get(function (req, res) {
      const cursor = database.find({});

      cursor
        .toArray()
        .then((result) => {
          res.json(result);
        })
        .catch((err) => console.log(err));
    })

    .post(function (req, res) {
      let title = req.body.title;

      if (!title) {
        return res.send("missing required field title");
      }

      const content = {
        title,
        comments: [],
        commentcount: 0,
      };

      database.insert(content, (err, doc) => {
        if (err) {
          console.log(err);
        }
        const id = doc.insertedIds[0];
        database.findOne({ _id: id }, (err, book) => {
          if (err) {
            console.log(err);
          }
          res.json({ _id: book._id, title: book.title });
        });
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      database.deleteMany({}, (err, result) => {
        if (err || !result.deletedCount) {
          console.log(err);
        }
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;

      database.findOne({ _id: new ObjectId(bookid) }, (err, book) => {
        if (err) {
          console.log(err);
        }
        if (!book) {
          return res.send("no book exists");
        }
        res.json(book);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment");
      }

      database.updateOne(
        { _id: new ObjectId(bookid) },
        {
          $push: {
            comments: comment,
          },
          $inc: {
            commentcount: 1,
          },
        },
        (err, doc) => {
          database.findOne({ _id: new ObjectId(bookid) }, (err, book) => {
            if (err) {
              console.log(err);
            }
            if (!book) {
              return res.send("no book exists");
            }
            res.json(book);
          });
        }
      );
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      database.deleteOne({ _id: new ObjectId(bookid) }, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (!result.deletedCount) {
          return res.send("no book exists");
        }
        res.send("delete successful");
      });
    });
};

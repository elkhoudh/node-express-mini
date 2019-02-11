// implement your API here
const express = require("express");
const cors = require("cors");
const db = require("./data/db");
const server = express();
server.use(cors());
server.use(express.json());

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => res.status(200).json(users))
    .catch(error =>
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." })
    );
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});

server.post("/api/users", (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(user)
      .then(() => {
        db.find().then(users => res.status(201).json(users));
      })
      .catch(() =>
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        })
      );
  }
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(user => {
      if (user) {
        db.find()
          .then(users => res.status(200).json(users))
          .catch(() => res.status(500).json({ error: "Server Error" }));
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(() =>
      res.status(500).json({ error: "The user could not be removed" })
    );
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changed = req.body;

  if (!changed.name || !changed.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, changed)
      .then(user => {
        if (user) {
          db.find()
            .then(users => res.status(200).json(users))
            .catch(() => res.status(500).json({ error: "Server Error" }));
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(() =>
        res
          .status(500)
          .json({ error: "The user information could not be modified." })
      );
  }
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("listening on port 5000..."));

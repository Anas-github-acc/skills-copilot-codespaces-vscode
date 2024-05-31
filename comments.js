// Create web server
// npm i express

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/comments', (req, res) => {
  fs.readFile('comments.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  });
});

app.post('/comments', (req, res) => {
  const newComment = req.body;
  fs.readFile('comments.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const comments = JSON.parse(data);
      comments.push(newComment);
      fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send('Your comment has been posted!');
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// create a form in public directory
// create a comments.json file in the root directory
// create a comments.js file in public directory
// create a index.html file in public directory

// Path: public/comments.js
const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('comments');

commentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(commentForm);
  const comment = formData.get('comment');
  fetch('/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  })
    .then((response) => response.text())
    .then((result) => {
      alert(result);
      fetchComments();
    });
});

// Require Modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

//const PORT = 3001;

const port = process.env.PORT || 3001

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);




app.listen(port, () =>
  console.log(`App listening at http://localhost:${port} 🚀`)
);


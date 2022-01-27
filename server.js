// Require Modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const port = process.env.PORT || 3001

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// GET Route for the start page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Read a file (async)
const readFromFile = util.promisify(fs.readFile);

// Write to a file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

// Read and append a file
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET route for retrieving stored notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  // Destructure the json information
  const { title, text } = req.body;

  // if the body exists
  if (req.body) {
    // create new note structure
    const new_note = {
      title,
      text,
    };
    // Read from json file then append the note to the file
    readAndAppend(new_note, './db/db.json');
    res.json(`note added successfully`);
  } else {
    res.json('error in adding note');
  }
});


// DELETE route for a note





// App listens on the given port
app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);


// required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
var uniqid = require('uniqid');

// declare port
const port = process.env.PORT || 3001

const app = express();

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// GET route for the start page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// read from a file (async)
const readFromFile = util.promisify(fs.readFile);

// write to a file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

// read and append a file
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

// GET route for retrieving all stored notes from the json file
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST route for a new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  // destructure the json information
  const { title, text, } = req.body;

  // if the body exists
  if (req.body) {
    // create new note structure
    const new_note = {
      title,
      text,
      id: uniqid(),
    };
    // read from json file then append the note to the file
    readAndAppend(new_note, './db/db.json');
    res.json(`note added successfully`);
  } else {
    res.json('error in adding note');
  }
});

// DELETE route for a note
app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  // read from JSON file
  readFromFile('./db/db.json')
  .then((data) => {  
    
    // create array to hold parsed data
    var data_array = JSON.parse(data);

    // finds the array index of the selected note
    const itemIndex = data_array.findIndex(({ id }) => id === req.params.id);

    // if the delete id geven is one that exists:
    if (itemIndex >= 0) {

      // splice out the selected item from the array
      data_array.splice(itemIndex, 1)
      
      // write over the data in the file
      writeToFile('./db/db.json',data_array)
      res.json(`note successfully deleted`);
    } else {
      res.json(`error in deleting note`);
    }
  });
});


// app listens on the given port
app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);


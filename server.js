const express = require('express');
const path = require('path')
const fs = require('fs')
const PORT = 3001;
const notes = require('./db/db.json');
// const { application } = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

// gets route for the notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// gets route for db.json database
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {err ? console.log(err) : res.json(JSON.parse(data))})
})

// app.post()


// get routes for anything that isn't /notes
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.listen(PORT, () =>
  console.log(`http://localhost:${PORT} `)
);

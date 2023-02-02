const express = require('express');
const path = require('path')
const fs = require('fs')
const PORT = 3001;
const notes = require('./db/db.json');
// const { json } = require('body-parser');
// const { notStrictEqual } = require('assert');
// // const { application } = require('express');

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

// will read db file and add new note obj to the array. It will also give the object a unique id.
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to submit notes`);

    const { title, text } = req.body

    if(title && text) {
        const newNote = {
            title, 
            text, 
            id: Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1),
        }    
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) {
                console.log(err)
            } else {
                const newData = JSON.parse(data);

                newData.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(newData, null, 4), (err) => err ? console.log(err) : console.log('Success!'))
            }   
        })
    }
})

// deletes note entries from db.json file
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const newNotes = JSON.parse(data)
            const newData = newNotes.filter(obj => obj.id !== req.params.id)
            fs.writeFile('./db/db.json', JSON.stringify(newData, null, 4), (err) => err ? console.log(err) : console.log('Success!'))
        }
    })
})

// get routes for anything that isn't /notes
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.listen(PORT, () =>
  console.log(`http://localhost:${PORT} `)
);

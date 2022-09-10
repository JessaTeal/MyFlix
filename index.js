const express = require('express'),
      app = express(),
      morgan = require('morgan');

let topMovies = [
  {
    title: 'Pitch Perfect',
    genre: 'Musical'
  },
  {
    title: 'Sweet Home Alabama',
    genre: 'Romantic Comedy'
  },
  {
    title: 'Into the Woods',
    genre: 'Musical',
  },
  {
    title: 'Captain Marvel',
    genre: 'Action'
  },
  {
    title: 'Avengers',
    genre: 'Action'
  },
  {
    title: 'Frozen',
    genre: 'Drama'
  },
  {
    title: 'Elf',
    genre: 'Holiday'
  },
  {
    title: 'Harry Potter',
    genre: 'Action'
  },
  {
    title: 'Beauty and the Beast',
    genre: 'Musical'
  },
  {
    title: 'Hook',
    genre: 'Action'
  },
];

app.use(morgan('common'));
app.get('/', (req, res) => {
  res.send('My Top Movies!');
});
app.use(express.static('public'));
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Yikes! Something isnt right!');
})

app.listen(8080);
console.log('My first Node test server is running on Port 8080.');

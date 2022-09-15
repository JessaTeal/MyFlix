const express = require('express'),
      app = express(),
      morgan = require('morgan'),
      bodyParser = require('body-parser');

app.use(bodyParser.json());

let topMovies = [
  {
    title : "Pitch Perfect",
    imageUrl : "https://m.media-amazon.com/images/I/91bAKJ3lMVL._SY679_.jpg",
    genre : ["Comedy", "Music", "Romance"],
    director : "Jason Moore",
    tagline : "Get Pitch Slapped",
    description : "Becca, a freshman at Barden University, is cajoled into joining the Bellas, her school's all-girls singing group. Injecting some much needed energy into their repertoire, The Bellas take on their male rivals in a campus competition."
  },
  {
    title : "Sweet Home Alabama",
    imageUrl : "https://flxt.tmsimg.com/assets/p30076_p_v12_aq.jpg",
    genre : ["Comedy", "Romance"],
    director : "Andy Tennant",
    tagline : "Sometimes what you're looking for is right where you left it.",
    description : "A young woman who has reivented herself as a New York City socialite must return home to Alabama to obtain a divorce from her husband after seven years of separation."
  },
  {
    title : "Into the Woods",
    imageUrl : "https://lumiere-a.akamaihd.net/v1/images/p_intothewoods_19906_d3b548e1.jpeg",
    genre : ["Adventure", "Comedy", "Drama", "Fantasy", "Musical"],
    director : "Rob Marshall",
    tagline : "Be careful what you wish for.",
    description : "A witch tasks a childless baker and his wife with procuring magical items from classic fairy tales to reverse the curse put on their family tree."
  },
  {
    title : "Captain Marvel",
    imageUrl : "https://m.media-amazon.com/images/M/MV5BMTE0YWFmOTMtYTU2ZS00ZTIxLWE3OTEtYTNiYzBkZjViZThiXkEyXkFqcGdeQXVyODMzMzQ4OTI@._V1_FMjpg_UX1000_.jpg",
    genre : ["Action", "Adventure", "Sci-Fi"],
    director : "Anna Boden",
    tagline : "Discover what makes a (her)o.",
    description : "Carol Danvers becomes one of the universe's most powerful heroes when Earth is caught in the middle of a galactic war between two alien races."
  },
  {
    title : "Avengers",
    imageUrl : "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    genre : ["Action"],
    director : "Joss Whedon",
    tagline : "Avengers Assemble!",
    description : "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity."
  },
  {
    title : "Frozen",
    imageUrl : "https://lumiere-a.akamaihd.net/v1/images/p_frozen_18373_3131259c.jpeg?region=0%2C0%2C540%2C810",
    genre : ["Animation", "Musical", "Adventure"],
    director : "Chris Buck",
    tagline : "Some people are worth melting for.",
    description : "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition."
  },
  {
    title : "Elf",
    imageUrl : "https://m.media-amazon.com/images/M/MV5BMzUxNzkzMzQtYjIxZC00NzU0LThkYTQtZjNhNTljMTA1MDA1L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
    genre : ["Holiday", "Comedy", "Adventure"],
    director : "John Favreau",
    tagline : "A comedy of Elf-ish proportions",
    description : "Raised as an oversized Elf, Buddy travels from the North Pole to New York City to meet his biological father, Walter Hobbs, who doesn't know he exists and is in desperate need of some Christmas spirit."
  },
  {
    title : "Harry Potter and the Sorcerer's Stone",
    imageUrl : "https://m.media-amazon.com/images/M/MV5BMzkyZGFlOWQtZjFlMi00N2YwLWE2OWQtYTgxY2NkNmM1NjMwXkEyXkFqcGdeQXVyNjY1NTM1MzA@._V1_.jpg",
    genre : ["Adventure", "Family", "Fantasy"],
    director : "Chris Columbus",
    tagline : "Let the magic begin.",
    description : "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family, and the terrible evil that haunts the magical world"
  },
  {
    title : "Beauty and the Beast",
    imageUrl : "https://m.media-amazon.com/images/M/MV5BMTUwNjUxMTM4NV5BMl5BanBnXkFtZTgwODExMDQzMTI@._V1_.jpg",
    genre : ["Musical", "Family", "Adventure"],
    director : "Bill Condon",
    tagline : "Be our guest.",
    description : "A selfish Prince is cursed to become a monster for the rest of his life, unless he learns to fall in love with a beautiful young woman he keeps prisoner."
  },
  {
    title : "Hook",
    imageUrl : "https://m.media-amazon.com/images/M/MV5BNmE0MGZjZjItZmQzMC00Nzg5LWE2YjctMjVlMTEyZWMwYmQwXkEyXkFqcGdeQXVyODc0OTEyNDU@._V1_.jpg",
    genre : ["Family", "Adventure", "Comedy"],
    director : "Steven Spielberg",
    tagline : "To live would be an awfully big adventure.",
    description : "When Captain James Hook kidnaps his children, an adult Peter Pan must return to Neverland and reclaim his youthful spirit in order to challenge his old enemy"
  },
];

app.use(morgan('common'));
app.get('/', (req, res) => {
  res.send('My Top Movies!');
});


app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
    res.json(topMovies.find((movie) =>
    { return movie.title === req.params.title }));
});

app.get('/movies/:title/genre', (req, res) => {
  let movie = topMovies.find( (movie) =>
  {return movie.title === req.params.title });

  if (movie) {
    let movieGenre = Object.values(movie.genre);
    res.status(201).send('Genre of ' + req.params.title + ': ' + movieGenre);
  }else {
    res.status(404).send('Movie not found');
  }
});

app.get('/movies/:title/director', (req, res) => {
    let movie = topMovies.find( (movie) =>
    {return movie.title === req.params.title });

    if (movie) {
      let movieDirector =   movie.director;
      res.status(201).send('Director of ' + req.params.title + ': ' + movieDirector);
    }else {
      res.status(404).send('Movie not found');
    }
});

app.post('/users', (req, res) => {
    res.send('Successfully registered username');
});

app.put('/users/:username', (req, res) => {
    res.send('Successfully changed username');
});

app.post('/users/:username/favorites', (req, res) => {
    res.send('Successfully added movie to favorites');
});

app.delete('/users/:username/favorites', (req, res) => {
    res.send('Successfully removed the movie from favorites');
});

app.delete('/users/:username/delete', (req, res) => {
    res.send('Successfully deregistered account');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Yikes! Something isnt right!');
})

app.listen(8080);
console.log('My first Node test server is running on Port 8080.');

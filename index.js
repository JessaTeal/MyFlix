require('dotenv').config();
const express = require('express'),
      app = express(),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      Models = require('./models.js'),
      cors = require('cors');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

mongoURL = process.env.CONNECTION_URI;

mongoose.connect( mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(morgan('common'));
app.get('/', (req, res) => {
  res.send('My Top Movies!');
});


app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

app.get('/movies/:Title/genre', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});


app.get('/movies/:Title/director', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ Title: req.params.Title})
    .then((movie) =>{
      res.json(movie.Director)
    })
    .catch((err) => {
      res.status(500).send('Error: ' + err);
    });
});

app.post('/users',
  [
  check('Username', 'Username is required').isLength({min:5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  ],

  (req, res) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }

    let hashedPassword = Users.hashPassword(req.params.Password);

    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if(user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Name: req.body.Name,
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).send('User has been added! \n' + user)})
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
        }
      })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
      });

app.put('/users/:Username',  passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate(
      {Username: req.params.Username},
      {$set:
        {
          Username : req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      {new: true},
      (err, updatedUser) => {
        if(err) {
          console.error(error);
          res.status(500).send('Error: ' + err);
        } else {
          res.send('Information has been updated! \n' + updatedUser);
        }
    });
});

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate(
      {Username: req.params.Username},
      {$push: {FavoriteMovies: req.params.MovieID}},
      {new: true},
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
          } else {
            res.json(updatedUser);
          }
      });
});

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate(
      {Username: req.params.Username},
      {$pull: {FavoriteMovies: req.params.MovieID}},
      {new: true},
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
          } else {
            res.json(updatedUser);
          }
      });
});

app.delete('/users/:Username/delete', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if(!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", {root: _dirname});
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Yikes! Something isnt right!');
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

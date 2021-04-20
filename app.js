const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoSanitize = require('express-mongo-sanitize')
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const saucesRoutes = require('./routes/sauces')

mongoose
  .connect(
    "mongodb+srv://sophie:pekocko@cluster3.p7igg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(mongoSanitize());
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/auth', authRoutes);
  app.use('/api/sauces', saucesRoutes);

module.exports = app;
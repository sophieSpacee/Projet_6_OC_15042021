const express = require("express");
const mongoose = require("mongoose");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const path = require('path');
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const authRoutes = require('./routes/auth');
const saucesRoutes = require('./routes/sauces')

mongoose
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true }
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
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use(mongoSanitize());
  app.use(helmet());
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/auth', authRoutes);
  app.use('/api/sauces', saucesRoutes);

module.exports = app;
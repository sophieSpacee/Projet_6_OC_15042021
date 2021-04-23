const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/auth");
var CryptoJS = require("crypto-js");

function encodeBase64(email) {
  const encodedWord = CryptoJS.enc.Utf8.parse(email);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

exports.signup = (req, res, next) => {
  var base64Email = encodeBase64(req.body.email);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: base64Email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: "User created !" });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const base64Email = encodeBase64(req.body.email);
  User.findOne({ email: base64Email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Incorrect password !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM-TOKEN-SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

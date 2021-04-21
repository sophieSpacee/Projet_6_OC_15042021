const Sauce = require("../models/Sauce");
const fs = require("fs");
const { db } = require("../models/Sauce");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes:0,
    dislikes:0
  });
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "added sauce" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  if(req.file){
      Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "modified sauce " }))
          .catch((error) => res.status(400).json({ error }));
    });})} else {
       Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "modified sauce " }))
    .catch((error) => res.status(400).json({ error }));
    }
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const userId = req.body.userId;
      const like = req.body.like;
      const usersLiked = sauce.usersLiked;
      const usersDisliked = sauce.usersDisliked;
      const userIdInUsersLiked = usersLiked.includes(userId);
      const userIdInUsersDisliked = usersDisliked.includes(userId);
     
      if (
        like === -1 &&
        userIdInUsersLiked === false &&
        userIdInUsersDisliked === false
      ) {
        console.log("in case -1");
        sauce.usersDisliked.push(userId);
        console.log(usersDisliked);
        sauce.dislikes ++
        sauce.save();
      }
      if (
        like === 0 &&
        userIdInUsersLiked === true &&
        userIdInUsersDisliked === false
      ) {
        console.log("in case 0 true false");
        console.log(usersLiked);
        const indexOfUserIdLiked = usersLiked.indexOf(userId);
        console.log(indexOfUserIdLiked);
        const removeUserIdFromUsersLiked = usersLiked.splice(
          indexOfUserIdLiked,
          1
        );
        console.log(usersLiked);
        sauce.likes --

        sauce.save();
      }

      if (
        like === 0 &&
        userIdInUsersLiked === false &&
        userIdInUsersDisliked === true
      ) {
        console.log("in case 0 false true");
        console.log(usersDisliked);
        const indexOfUserIdDisliked = usersDisliked.indexOf(userId);
        console.log(indexOfUserIdDisliked);
        const removeUserIdFromUsersDisliked = usersDisliked.splice(
          indexOfUserIdDisliked,
          1
        );
        console.log(usersDisliked);
        sauce.dislikes --
        sauce.save();
      }

      if (
        like === 1 &&
        userIdInUsersLiked === false &&
        userIdInUsersDisliked === false
      ) {
        console.log("in case 1");
        sauce.usersLiked.push(userId);
        console.log(usersLiked);
        sauce.likes ++
        sauce.save();
      }
    })
    .then(() => res.status(200).json({ message: "liked sauce" }))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "deleted sauce" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

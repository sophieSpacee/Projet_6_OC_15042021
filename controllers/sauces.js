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
    likes: 0,
    dislikes: 0,
  });
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
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "modified sauce " }))
          .catch((error) => res.status(400).json({ error }));
      });
    });
  } else {
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

      if (like === -1 && !userIdInUsersLiked && !userIdInUsersDisliked) {
        console.log('userId', userId)
        console.log('usersDisliked list before sauce is saved', usersDisliked)
        sauce.usersDisliked.push(userId);
        sauce.dislikes++;
        sauce.save();
        console.log('usersDisliked list after sauce is saved', usersDisliked)

      }
      if (like === 0 && userIdInUsersLiked && !userIdInUsersDisliked) {
        console.log('userId', userId)
        console.log('usersLiked list before sauce is saved', usersLiked)
        const indexOfUserIdLiked = usersLiked.indexOf(userId);
        usersLiked.splice(indexOfUserIdLiked, 1);
        sauce.likes--;
        sauce.save();
        console.log('usersLiked list after sauce is saved', usersLiked)

      }

      if (like === 0 && !userIdInUsersLiked && userIdInUsersDisliked) {
        
        console.log('userId', userId)
        console.log('usersDisliked list before sauce is saved', usersDisliked)
        const indexOfUserIdDisliked = usersDisliked.indexOf(userId);
        usersDisliked.splice(indexOfUserIdDisliked, 1);
        sauce.dislikes--;
        sauce.save();
        console.log('usersDisliked list after sauce is saved', usersDisliked)

      }

      if (like === 1 && !userIdInUsersLiked && !userIdInUsersDisliked) {
        console.log('userId', userId)
        console.log('usersLiked list before sauce is saved', usersLiked)
        sauce.usersLiked.push(userId);
        sauce.likes++;
        sauce.save();
        console.log('usersLiked list after sauce is saved', usersLiked)

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

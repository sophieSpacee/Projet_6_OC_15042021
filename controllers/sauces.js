const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);  
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    console.log(sauce);
    sauce
      .save()
      .then(() => res.status(201).json({ message: "objet enregistre" }))
      .catch((error) => res.status(400).json({ message: 'erreur ajout' }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? 
  { 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: "objet modifie" }))
      .catch((error) => res.status(400).json({ error }));
};

// exports.likeSauce = (req, res, next) => {
    // chek user

    // check squce

    //check input 

    //cas 1

    // cas -
//     const sauceObject = JSON.parse(req.body.sauce); 
//     Sauce.updateOne({ _id: req.params.id }, { sauceObject, _id: req.params.id })
//         .then(() => res.status(200).json({ message: "objet modifie" }))
//         .catch((error) => res.status(400).json({ error }));
//   };

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne( {_id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "objet supprime" }))
      .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({error}))
   
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

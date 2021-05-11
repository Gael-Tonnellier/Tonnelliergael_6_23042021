const Sauce = require("../models/sauces");
const fs = require("fs");

//ROUTE POUR CREER UNE SAUCE
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //JE DEFINI LE NOMBRE DE LIKE DISLIKE ET J'INDIQUE LA ROUTE POUR LES IMAGES
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });
  //SAUVEGARDE DE L OBJET
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Post saved successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

// JE RECUPERE UNE SAUCE AVEC SON ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

//MODIFICATION DE LA SAUCE 
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
      //  MIS A JOUR DE LA SAUCE SUR LA DB
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      res.status(201).json({ message: "Sauce updated successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

// SUPPRESSION DE LA SAUCE PAR L ID ET SUPPRESSION DE L IMAGE ASSOCIE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Deleted!" }))
          .catch((error) => res.status(400).json({ error: error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// RECUPERATION DE TOUTES LES SAUCES
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//GESTION DES REQUETES LIKE DISLIKE
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // SWITCH CASE POUR CHAQUE TYPE DE REPONSE
      switch(req.body.like){
        case 1 : 
          // VERIFICATION QUE L USER N A PAS DEJA LIKE        
          if(sauce.usersLiked.find(user=>user==req.body.userId)){
            throw console.error('Vous avez déjà Like');
          }
          //PUSH DE L USER DANS SON TABLEAU
          else{
            sauce.usersLiked.push(req.body.userId);
          sauce.likes+=1;
          }
          break;
        case -1 :
          if(sauce.usersDisliked.find(user=>user==req.body.userId)){
            throw console.error('Vous avez déjà Dislike')
          }else{
            sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes+=1;
          }
          break;
        case 0: 
        // RETIRE LE LIKE OU DISLIKE EN FONCTION DU TABLEAU DE L USER
          if(sauce.usersLiked.find(user=>user==req.body.userId)){
            const indexUser= sauce.usersLiked.indexOf(req.body.user);
            sauce.usersLiked.splice(indexUser,1);
            sauce.likes-=1;
          }else{
            const indexUser= sauce.usersLiked.indexOf(req.body.user);
            sauce.usersDisliked.splice(indexUser,1);
            sauce.dislikes-=1;
          }
          break;
      }
      // UPDATE DE LA COLLECTION
      sauce.update({ $set: {
          likes : sauce.likes,
          dislikes : sauce.dislikes,
          usersLiked : sauce.usersLiked,
          usersDisliked : sauce.usersDisliked
          }})
        .then(() => res.status(201).json({ message: "Avis pris en compte" }))
        .catch((error) => res.status(400).json({ error: error }));
    })

    .catch((error) => res.status(500).json({ error }));
};

const Sauce = require("../models/sauces");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject.id;
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
    .then(() => {
      res.status(201).json({ message: "Post saved successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
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

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch(req.body.like){
        case 1 : 
          sauce.usersLiked.push(req.body.userId);
          sauce.likes+=1;
          break;
        case -1 :
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes+=1;
          break;
        case 0: 
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

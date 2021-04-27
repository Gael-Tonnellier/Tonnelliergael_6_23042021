const Sauce = require('../models/sauces');
const fs = require("fs");


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject.id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes : 0,
    dislikes : 0,
  });
  sauce.save()
    .then(() => {
      res.status(201).json({message: "Post saved successfully!",});
    })
    .catch((error) => {
      res.status(400).json({error: error,});
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id,})
    .then((sauce) => {res.status(200).json(sauce);})
    .catch((error) => {
      res.status(404).json({error: error,});
    });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      res.status(201).json({message: "Sauce updated successfully!",});
    })
    .catch((error) => {
      res.status(400).json({error: error,});
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Deleted!",}))
          .catch((error) =>res.status(400).json({error: error,})); 
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch((error) => {
      res.status(400).json({error: error,});
    });
};

exports.likeSauce = (req,res,next)=>{
 function modify(){
   Sauce.findOne({ _id: req.params.id })
  .then((sauce)=>{
      if(req.body.like == 1){
      sauce.update({$set:{ usersLiked:[req.body.userId]}})
      .then(() => res.status(201).json({ message: "Liked!",}))
      .catch((error) =>res.status(400).json({error: error,}));
     }else if(req.body.like ==-1){
      sauce.update({$set:{ usersDisliked:[req.body.userId]}})
      .then(() => res.status(201).json({ message: "DisLiked!",}))
      .catch((error) =>res.status(400).json({error: error,}));
     }else{
       sauce.update({$pull:{ usersLiked: req.body.userId, usersDisliked: req.body.userId }})
      .then(() => res.status(201).json({ message: "Removed",}))
      .catch((error) =>res.status(400).json({error: error,}));    
     };
     
    })
  
  .catch((error) => res.status(500).json({ error }));
 }
 modify();

  async function count(){
    await Sauce.findOne({_id:req.params.id})
    .then((sauce)=>{
    const likeCount = sauce.usersLiked.length;
      const dislikeCount = sauce.usersDisliked.length;
    sauce.update({$set:{likes : likeCount, dislikes : dislikeCount}})
    console.log(sauce)
    console.log(sauce.usersLiked.length);
    console.log(req.body.userId);
    console.log(req.body.like);
    console.log(req.body.usersLiked)
  })
  .catch((error) =>res.status(400).json({error: error,}));  
  }count();

  
  
};
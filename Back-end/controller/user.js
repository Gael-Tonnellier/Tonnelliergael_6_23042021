const bcrypt =require('bcrypt');

const User=require('../models/user');

const jwt = require('jsonwebtoken');

// ROUTE POUR INSCRIPTION
exports.signup = (req, res, next) =>{
    // HASH DU PASSWORD RECU EN REQUEST
    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
        //CREATION DE L USER AVEC SON EMAIL ET SON MDP HASH
        const user= new User({
            email: req.body.email,
            password: hash
        });
        // SAUVEGARDE DE L USER
        user.save()
        .then(()=>res.status(201).json({message:'Utilisateur crée !'}))
        .catch(error => res.status(400).json({error: 'Nom de compte déjà pris'}));
    })
    .catch(error =>res.status(500).json({error}))
};

//ROUTE POUR LA CONNECTION
exports.login = (req, res , next) =>{
    //RECUPERATION DE L USER
    User.findOne({email: req.body.email})
    .then(user =>{
        if(!user){
            return res.status(401).json({error:'utilisateur non trouvé!'});
        }
        //COMPARAISON DE L ORIGINE DU MOT DE PASSE AVEC BCRYPT
        bcrypt.compare(req.body.password,user.password)
        .then(valid =>{
            if(!valid){
                return res.status(401).json({error:'mot de passe incorrect'})
            }
            // ENVOI DE LA REPONSE AVEC ATTRIBUTION DE L ID USER ET CREATION D UN TOKEN POUR LA SESSION
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.JWT_TOKEN,
                    { expiresIn: '24h' }
                  )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}))
}
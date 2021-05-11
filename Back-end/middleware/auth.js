const jwt= require('jsonwebtoken');

// MIDDLEWARE D AUTHENTIFICATION POUR LES DIFFERENTES ROUTES
module.exports=(req,res,next)=>{
    try{
        // RECUPERATION DU TOKEN SANS LE BEARER
        const token = req.headers.authorization.split(' ')[1];
        // VERIFICATION DU TOKEN CORRESPONDANT AVEC CELUI ATTRIBUE A L USER
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        } else {
            next();
        }
    }catch (error){
        res.status(401).json({error:error | 'requete non authentifiée ! '});
    }
}
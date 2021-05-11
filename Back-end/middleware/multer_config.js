const multer = require('multer');

// DECLARATION DE TYPE EN FONCTION DE L EXTENSION DE L IMAGE
const MIME_TYPES ={
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png',
};
// INDIQUE A MULTER OU ENREGISTRER LES IMAGES
const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'images')
    },
    filename:(req,file,callback)=>{
        // INDIQUE A MULTER D UTILISER LE NOM D ORIGINE ET DE REMPLACER LES ESPACE PAR DES UNDERSCORES
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        // AJOUTE AU NOM UN TIMESTAMP ET AJOUTE LE MIME TYPE 
        callback(null, name + Date.now()+ '.'+extension);
    }
});

module.exports = multer({storage}).single('image');
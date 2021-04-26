const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controller/sauces');
const auth =require('../middleware/auth');
const multer =require('../middleware/multer_config')

router.get('/',auth,multer,saucesCtrl.getAllSauces);
router.get('/:id',auth,multer,saucesCtrl.getOneSauce);
router.post('/',auth,multer,saucesCtrl.createSauce);
router.post('/:id/like',saucesCtrl.likeSauce);
router.put('/:id',auth,multer,saucesCtrl.modifySauce);
router.delete('/:id',auth,multer,saucesCtrl.deleteSauce);

module.exports = router;
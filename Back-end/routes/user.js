const express = require('express');
const router = express.Router();

const rate= require('../middleware/rate_limit')
const userCtrl =require ('../controller/user');

router.post('/signup',rate, userCtrl.signup);
router.post('/login',rate, userCtrl.login);

module.exports = router;
const express = require('express');
const router = express.Router();
const categoriesCtrl = require('../controller/user.controller'); 


router.get('/', categoriesCtrl.getAllCategories);



module.exports = router;

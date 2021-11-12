const userController = require('../controller/userController.js');
const firebaseController = require('../controller/firebaseController.js');
const aiController = require('../controller/aiController.js');
const viewController = require('../controller/viewController.js');

const express = require('express');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));

//userRouter
router.post('/join', userController.join); //1. 회원가입
router.post('/login', userController.login); //2. 로그인

//firebaseRouter
router.post('/upload/style', firebaseController.styleUpload); //1. styleSourceImage upload
router.post('/upload/content', firebaseController.contentUpload); //2. contentSourceImage upload
router.post('/upload/result', firebaseController.resultUpload); //3. resultImage upload

//aiRouter
router.post('/model/test', aiController.testModel); //1. test model
router.post('/model/nst', aiController.nstModel); //2. nst model
router.post('/model/aiartist', aiController.aiArtistModel); //3. ai Artist model

router.post('/artist/add', viewController.addArtist)
router.get('/artist/list', viewController.artistList)

router.post('/art/list', viewController.artList)
router.post('/art/del', viewController.artDelete)

module.exports = router;
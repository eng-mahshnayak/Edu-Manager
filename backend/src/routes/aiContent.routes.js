const express = require('express');

const {  generateQuestionPaper } = require('../controllers/aiContent.controller');

const router = express.Router();


router.post('/draw/questionpapper', generateQuestionPaper);


router.post('/generate', generateQuestionPaper);
// router.post('/save', saveQuestionPaper);


module.exports = router;
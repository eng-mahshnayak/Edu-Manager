const express = require('express');

const {  generateQuestionPaper } = require('../controllers/aiContent.controller');
const { generateImageWithAIAndMakeStory } = require('../controllers/aiTest.controller');

const router = express.Router();





router.post('/process', generateImageWithAIAndMakeStory);
// router.post('/save', saveQuestionPaper);


module.exports = router;
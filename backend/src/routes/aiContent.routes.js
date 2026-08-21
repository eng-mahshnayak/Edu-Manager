const express = require('express');

const {  generateQuestionPaper, savePaper, getSavedPapers } = require('../controllers/aiContent.controller');

const {  getFruits, getAnimals, getFlowers, getVegetables, getTrees, getPlants, getBirds, getCountries, getIndianStates, getFamousPlaces, getCitiesMP, getMonuments, getMountains, getRivers, getOceans, getIslands, getVolcanoes, getThings, getTransport, getPeople, getRelations } = require('../controllers/basicKnowledge.controller');
const { getStory, translateStory } = require('../controllers/story.controller');

const router = express.Router();



//================= working basic knowledge routes ==================

router.get('/getfruits', getFruits);
router.get('/getanimals', getAnimals);
router.get('/getflowers', getFlowers);
router.get('/getvegetables', getVegetables);
router.get('/gettrees', getTrees);
router.get('/getplants', getPlants);
router.get('/getbirds', getBirds);

router.get('/getcountries', getCountries);
router.get('/getstates', getIndianStates);
router.get('/getplaces', getFamousPlaces);
router.get('/getcities', getCitiesMP);


router.get('/getmonuments', getMonuments);
router.get('/getmountains', getMountains);
router.get('/getrivers', getRivers);
router.get('/getoceans', getOceans);
router.get('/getislands', getIslands);
router.get('/getvolcanoes', getVolcanoes);


router.get('/getthings', getThings);
router.get('/gettransport', getTransport);
router.get('/getpeople', getPeople);
router.get('/getrelations', getRelations);




router.get('/story', getStory);
router.post("/translate-story", translateStory);



router.post('/draw/questionpapper', generateQuestionPaper);





router.post('/generate', generateQuestionPaper);
router.post("/save-paper", savePaper);
router.get("/saved-papers", getSavedPapers);




router.post('/draw/questionpapper', generateQuestionPaper);



module.exports = router;
const router = require('express').Router();
const {jwtMiddleware} = require('../jwtAuth');
const candidateController = require('../controllers/candidateController');

router.post('/createCandidate', jwtMiddleware, candidateController.createCandidate);

router.put('/updateCandidate/:cId', jwtMiddleware, candidateController.updateCandidate);

router.delete('/deleteCandidate/:cId', jwtMiddleware, candidateController.deleteCandidate);

router.put('/castVote/:cId', jwtMiddleware, candidateController.castVote);

router.get('/voteCount', candidateController.candidateVoteCount);

router.get('/getCandidates', candidateController.getCandidates);

module.exports = router;
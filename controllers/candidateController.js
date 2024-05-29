const { generateToken } = require('../jwtAuth');
const Candidate = require('../models/Candidates');
const User = require('../models/User');

const checkAdmin = async (userID) => {
    try{
        const user = await User.findById(userID);
        
        if(user.role === 'admin') return true;
    }catch(err){
        return false;
    }
}
const checkVoter = async (userID) => {
    try{
        const user = await User.findById(userID);
        
        if(user.role === 'voter') return true;
    }catch(err){
        return false;
    }
}

exports.createCandidate = async (req,res) => {
    try{
        const admin = await checkAdmin(req.user.id);
        if(!admin) {
            return res.status(404).json({message: "Unauthorized role"});
        }

        const candidateData = req.body;

        if(candidateData == null){
            return res.status(400).json({message: "Candidate data cannot be empty"});
        }

        const newCandidate = new Candidate(candidateData);
        const response = await newCandidate.save();

        const payload = {
            id : response.id
        }
        const token = generateToken(payload);

        res.status(200).json({response : response,token : token});
    }catch(err){
        res.status(500).json({err,message:"some error occured"});
    }
}

exports.updateCandidate = async (req,res) => {
    try{
        if(!await checkAdmin(req.user.id))  return res.status(404).json({message: "Unauthorized role"});
        
        const candidateData = req.body;
        const candidateId = req.params.cId;
        const candidate = await Candidate.findByIdAndUpdate(candidateId,candidateData ,{
            new : true,
            runValidators : true
        });
        
        res.status(200).json({response : candidate, message: "Updated successfully"});
    }catch(err){
        res.status(500).json({err,message:"some error occured"});
    }
}

exports.deleteCandidate = async (req,res) => {
    try{
        if(!await checkAdmin(req.user.id))  return res.status(404).json({message: "Unauthorized role"});
        
        const candidateId = req.params.cId;
        
        if(candidateId == null) res.status(400).json({message: "Candidate id is missing"});
        
        const response = await Candidate.findByIdAndDelete(candidateId);

        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        res.status(500).json({err,message:"some error occured"});
    }
}

exports.castVote = async (req,res) => {
    try{
        if(! await checkVoter(req.user.id)){
            return res.status(404).json({message: "Unauthorized role"});
        }
        console.log('1');
        const candidateId = req.params.cId;
        const userid = req.user.id;
        const user = await User.findById(userid);
        if(! user){
            return res.status(404).json({message: "User not found"});
        }

        const cast = await Candidate.findByIdAndUpdate(candidateId, 
            {
                $push: {votes: {userId: userid, votedAt: Date.now()}}, 
                $inc: {voteCount: 1}
            },
            {
                new : true,
                runValidators : true
            }
        );
        user.isVoted = true;
        await user.save();

        res.status(200).json({cast: cast, message: "Voted successfully"});
    }catch(err){
        res.status(500).json({err,message:"some error occured"});
    }
}

exports.candidateVoteCount = async (req,res) => {
    try{
        const getCandidate = await Candidate.find().sort({voteCount: 'desc'});
        const record = getCandidate.map((data) => {
            return {
                party: data.partyName,
                vote: data.voteCount
            }
        })
        res.status(200).json({getVoteCount:record});
    }catch(err){
        res.status(500).json({err,message:"some error occured"});
    }
}

exports.getCandidates = async (req,res) => {
    try{
        // const allCandidates = await Candidate.aggregate([
        //     {$match: {name: {$exists : true}}},
        //     {$project: {_id: 0, name: 1}}
        // ]);

        const getList = await Candidate.find();
        const record = getList.map((data) => {
            return {
                party: data.partyName
            }
        })

        // if(!allCandidates){
        //     return res.status(404).json({message: "Candidates not found"});
        // }
        if(!getList){
            return res.status(404).json({message: "Candidates not found"});
        }
        res.status(200).json({allCandidates:record});
    }catch(err){
        res.status(500).json({err,message:"some error occured"});
    }
}
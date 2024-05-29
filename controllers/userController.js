const User = require('../models/User');
const {generateToken, jwtMiddleware} = require('../jwtAuth');

exports.signup = async (req,res) => {
    try{
        const userData = req.body;
        const newUser = new User(userData);
        const response = await newUser.save();
        const payload = {
            id : response.id
        }
        const token = generateToken(payload);

        res.status(200).json({response : response,token : token});
    }catch(err){
        res.status(500).json({err,message:"some error occured"});
    }
}

exports.signIn = async (req,res) => {
    try{
        const {uniqueId, passWord} = req.body;
        const user = await User.findOne({uniqueId: uniqueId});
        
        if(!user || !(await user.comparePassword(passWord))) return res.status(401).josn({message: "user or password is incorrect"});
        
        const payload = {
            id : user.id
        }

        const token = generateToken(payload);

        res.status(200).json({token});
    }catch(err){
        res.status(500).json({message: "Internal server error", error: err})
    }
}

exports.profile = async (req,res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        
        if(!user) return res.status(400).json({message: "User is not registered"});

        res.status(200).json({user});
    }catch(err){
        res.status(500).json({message: "Internal server error", error: err})
    }
}

exports.updateProfile = async(req,res) => {
    try{
        const userId = req.user.userId;
        const {currentPassword,newPassword} = req.body;
        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({message: 'user not found'});
        }

        if(! await User.comparePassword(currentPassword)) {
            return res.status(400).json({message: "Password dosen\'t match"})
        }
        user.passWord = newPassword;
        await user.save();

        res.status(200).json({message: "Password updated successfully"});
    }catch(err){
        res.status(500).json({message: "Internal server error", error: err})
    }
}

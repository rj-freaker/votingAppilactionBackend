const mongooose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongooose.Schema({
    passWord: {
        type : String,
        required : true,
        minLength : 8
    },
    mobile: {
        type : String,
        default : null
    },
    age: {
        type : Number,
        min : 18
    },
    name : {
        type : String,
        required : true,
    },
    address: {
        type : String,
        required : true
    },
    uniqueId : {
        type : String,
        required : true,
        unique : true
    },
    role: {
        type: String,
        enum : ['voter','admin'],
        default : 'voter'
    },
    isVoted: {
        type : Boolean,
        default : false
    }
});

userSchema.methods.comparePassword = async function(userPassword){
    try{
        const isMatch = await bcrypt.compare(userPassword,this.passWord);
        return isMatch;
    }catch(err){
        throw err;
    }
}

userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified('passWord')) return next();
    
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.passWord, salt);

        user.passWord = hashedPassword;

        if(user.uniqueId.length !== 12){
            return next(new Error('Unique id must be of 12 digit only not more not less'));
        }
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.index({ mobile: 1 }, { unique: true, partialFilterExpression: { mobile: { $type: "string" } } });

const User = mongooose.model('user',userSchema);

module.exports = User;
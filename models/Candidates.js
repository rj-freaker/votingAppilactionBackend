const mongooose = require('mongoose');

const CandidateSchema = new mongooose.Schema({
    name: {
        type : String,
        required : true
    },
    partyName: {
        type : String,
        required : true,
        unique : true
    },
    age: {
        type : Number
    },
    leader: {
        type : String,
        required : true
    },
    votes: [
        {
            userId: {
                type : mongooose.Schema.Types.ObjectId,
                ref : 'User',
                required : true
            },
            votedAt: {
                type : Date,
                default : Date.now()
            }
        }
    ],
    voteCount: {
        type : Number,
        default : 0
    }
})

const Candidate = mongooose.model('candidate', CandidateSchema);
module.exports = Candidate;
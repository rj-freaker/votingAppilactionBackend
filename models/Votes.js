const mongooose = require('mongoose');

const VoteSchema = new mongooose.Schema({
    userInfo: {
        type : mongooose.Schema.Types.ObjectId,
        ref : 'User'
    },
    voteInfo: {
        type : mongooose.Schema.Types.ObjectId,
        ref : 'Candidate'
    }
})

const Vote = mongooose.model('vote', VoteSchema);
module.exports = Vote;
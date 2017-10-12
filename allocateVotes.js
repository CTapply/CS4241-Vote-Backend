const findCandidate = require("./findCandidate.js");

var allocateVotes = function(votes, candidates) {
  // console.log('\x1b[32m', 'allocate votes: ', '\x1b[0m') 
  // console.log(JSON.stringify(votes)) 
  // console.log("to candidates:\n" + JSON.stringify(candidates.map((c) => c.id)))
  for (i = 0; i < votes.length; i++) {
      var cv = findCandidate(votes[i], candidates)
      if (cv) { 
          var cand = cv.candidate
          votes[i] = cv.vote
          // console.log('allocating vote ' + JSON.stringify(votes[i]) + " to candidate " + JSON.stringify(cand.id))
          cand.votes.push(votes[i])
      }
      else {
          //ignore exhausted ballots
          // console.log('allocating vote ' + JSON.stringify(votes[i]) + " to candidate null")
      }
  }
  return candidates
}

module.exports = allocateVotes;

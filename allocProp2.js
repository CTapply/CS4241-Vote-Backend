const allocateVotes = require("./allocateVotes.js");
const findCandidateById = require("./findCandidateById.js");
const getKeys = require("./getKeys.js");

var _allocProp2 = function (winner, candidates, winTotal) {
  // basic idea: figure out which votes to allocate to their next choices, then allocate them
  // console.log('\x1b[32m', "enter function _allocProp2", '\x1b[0m')
  // console.log('winner: ' + JSON.stringify(winner))
  // console.log('candidates: ' + JSON.stringify(candidates, null, 2))
  var map = {}
  var votes = (winner.votes
               .map((vote) => vote.next))
               .filter((vote) => vote) // drop null votes, i.e. exhausted ballot

  var numExtra = votes.length - winTotal // how many extra votes does this candidate have, beyond the minimum they need to win?
  var fracExtra = numExtra / (votes.length)
  var remainders = [] //the fractional part, so you can sort by it
  var total = 0 // total allocated, so we can know exactly when to stop

  //bin votes by their chosen candidate
  // key: candidate.id, value: candidate.votes
  for (i = 0; i < votes.length; i++) {
      if (map[votes[i].choice]) {
          map[votes[i].choice].push(votes[i])
      }
      else {
          map[votes[i].choice] = [votes[i]]
      }
  }

  for (var key in map) {
      var numToDrop = Math.floor(map[key].length * fracExtra)
      if (numToDrop > map[key].length) throw "numToDrop > number of votes. this should not happen";

      candidates = allocateVotes(map[key].slice(0, numToDrop), candidates)
      map[key].slice(numToDrop)
      var rem = {}
      rem[key] = (map[key].length * fracExtra) - numToDrop
      remainders.push(rem)
      total += numToDrop
      /*var cand = findCandidateById(map[key][0].choice, candidates)
      if (cand) {
          // console.log('\x1b[32m', "candidates before:", '\x1b[0m')
          // console.log(JSON.stringify(candidates))
          cand.votes = cand.votes.concat(map[key].slice(0, numToDrop)) //give excess to next choice
          // console.log('\x1b[32m', "candidates after:", '\x1b[0m')
          // console.log(JSON.stringify(candidates))
          map[key].slice(numToDrop) //drop everything up to but not including numToDrop
          var rem = {}
          rem[cand.id] = (map[key].length * fracExtra) - numToDrop
          remainders.push(rem)
          total += numToDrop
      }
      else {
          //what to do here: figure out how many votes are supposed to get reallocated, then use allocateVotes to allocate them
          // console.log('\x1b[31m', "Error: could not find " + map[key][0].choice + " in list of candidates", '\x1b[0m')
          crash //idk what to do here yet
      }*/
  }
  remainders = remainders.sort((a, b) => b - a)
  let infiniteLoopCounter = 0;
  while (total < numExtra) {
      r = remainders[0]
      remainders = remainders.slice(1) //remove first element
      var id = getKeys(r)[0] //should just have the one key
      var cand = findCandidateById(id, candidates)
      if (cand) {
          console.log("appending remainder to candidate: " + JSON.stringify(cand))
          cand.votes.push(map[id][0])
          total += 1
      }
      if (infiniteLoopCounter < 10000) {
        infiniteLoopCounter++;
      } else {
        break;
      }
      console.log('inside of this while loop in allocprop2', total, numExtra, cand)
  }
  return candidates
}

module.exports = _allocProp2;

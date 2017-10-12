
/* Given a vote, find the next candidate it should go to. 
 *
 * TODO this fails if it actually follows vote.next to find a candidate, needs to return the modified vote too. 
 */
var findCandidate = function(vote, candidates) {
  // console.log("findCandidate: " +JSON.stringify(vote.choice))
  if (vote && vote.choice) {
      c = candidates.find((c) => c.id == vote.choice)
      if (c) {
          return {vote:vote, candidate:c}
      }
      else {
          return findCandidate(vote.next, candidates)
      }
  }
  else {
      // console.log('warning: findCandidate returned null. This may indicate a bug')
      return null
  }
}

module.exports = findCandidate;

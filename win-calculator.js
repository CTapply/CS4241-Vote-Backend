/* Algorithm to compute stv and all its supporting machinery should go in here. 
 *
 * NEVER CALL ANY FUNCTION WITH AN UNDERSCORE BEFORE ITS NAME UNLESS YOU KNOW WHAT YOU ARE DOING
 *
 * Primary Maintainer: Forrest Cinelli
 *
 * Right now this does not handle incomplete ballots, i.e. ballots that don't rank every candidate
 */

var _ = require('lodash')

const _allocProp2 = require("./allocProp2.js");
const allocateVotes = require("./allocateVotes.js");
const findCandidate = require("./findCandidate.js");
const findCandidateById = require("./findCandidateById.js");

/* countVotes takes a list, a number, and a boolean 
 *
 * candidates is a list of candidates, some object which should contain the list of first-choice votes for that candidate (that list should
 * have a complete description of every vote), in the .votes field. 
 * numWinners should just be a number, less than or equal to the length of candidates, the number of candidates who win. 
 * if trace is true, rather than returning a list of winning candidates, it will return an object containing both that and
 * a trace of the state of the candidates list after each operation 
 */
exports.countVotes = function (originalCandidates, numWinners, trace) {
    // console.log('THIS IS THE TRACE', trace)
    // console.log('\x1b[32m', "\nenter function countVotes.", '\x1b[0m')
    // console.log("Candidates: " + JSON.stringify(originalCandidates, null, 2) + "\nnumWinners: " + numWinners)
    var candidates = originalCandidates
    var winFrac = getWinFrac(numWinners)
    // console.log("winFrac: " + winFrac)
    var csorted = candidates.sort(sorter) // sort candidates in descending order by the number of votes they have
    //var csorted = candidates.sort((c1, c2) => c2.votes.length - c1.votes.length)
    // console.log(candidates[0].votes.length)
    var totalVotes = candidates.reduce((sum, c) => sum + c.votes.length, 0)
    // console.log("totalVotes: " + totalVotes)
    var voteGoal = Math.floor(winFrac * totalVotes)
    // console.log("voteGoal: " + voteGoal)
    var winners = []

    if (trace) {
      console.log('add to the trace')
      thetrace = {'candidates':[], 'winners':[]}
      thetrace.candidates.push(_.cloneDeep(candidates))
      thetrace.winners.push(_.cloneDeep(winners))
    }
    
    console.log('after add to the trace')
    while (winners.length < numWinners) {
      console.log('inside of while')
      // console.log("turn the outer crank")
      while (csorted[0] && csorted[0].votes.length >= voteGoal) {
            console.log('inside of second while')
            // console.log("turn the inner crank")
            /* add winner, allocate their extra votes */
            var w = csorted[0]
            // console.log("winner: " + JSON.stringify(w))
            // console.log("csorted before splice: " + JSON.stringify(csorted))
            csorted = csorted.splice(1) //drop first element
            // console.log("csorted after splice: " + JSON.stringify(csorted))
            // console.log("csorted.length: " + csorted.length)
            candidates = allocateExtraVotes(w, csorted, voteGoal)
            console.log('after allocate extra')
            winners.push(w)
            //csorted = candidates.sort((c1, c2) => c2.votes.length - c1.votes.lengt)
            csorted = candidates.sort(sorter) // sort candidates in descending order by the number of votes they have
            if (trace) {
                thetrace.candidates.push(_.cloneDeep(candidates))
                thetrace.winners.push(_.cloneDeep(winners))
            }
        }

        // console.log("winners.length: " + winners.length)
        if (winners.length === numWinners){

            console.log('break')
            break
        }
        if (winners.length + candidates.length <= numWinners) { 
            // we have run out of candidates. give up. 
            if (trace) {

                console.log('return the trace')
                return { 'winners':winners.concat(candidates), trace: thetrace }
            }
            //else
            return winners.concat(candidates)
        }
        
        /* eliminate biggest loser */
        var l = csorted[csorted.length - 1]
        if (l) {
            // console.log('\x1b[32m', "csorted: ", '\x1b[0m')
            // console.log(JSON.stringify(csorted))
            // console.log("eliminate candidate " + (l ? l.id : null))
            csorted = csorted.slice(0, csorted.length - 1) // eliminate last element
            candidates = allocateCandidateVotes(l, csorted) // give all of the loser's votes to their next choices. 
            // console.log("post alloc candidates: " + JSON.stringify(candidates))
            // console.log("candidate vote lengths: " + JSON.stringify(candidates.map((c) => [c.id, c.votes.length])))
            //csorted = candidates.sort((c1, c2) => c2.votes.length - c1.votes.length)
            csorted = candidates.sort(sorter) // sort candidates in descending order by the number of votes they have
            if (trace) {
                thetrace.candidates.push(_.cloneDeep(candidates))
                thetrace.winners.push(_.cloneDeep(winners))
            }
        }
        else {
            // throw "Was not able to pick enough winners" //shouldn't happen
            console.log('was not able to get enough winners')
        }
    }
    if (trace) {

        console.log('return the trace')
        return { winners, trace: thetrace }
    }
    //else
    return winners
}

/* Function which takes two candidates and returns a comparison of them. 
 *
 * This is intended to be an argument to the array.sort() function, whose first argument is a comparator function.
 */
function sorter(c1, c2) {
    return c2.votes.length - c1.votes.length
}

/* getWinFrac takes an integer and returns a float in [0, 1]
 * 
 * returns the minimum fraction of all the votes a candidate needs to win. 
 */
function getWinFrac(numWinners) {
    return _hare(numWinners)
}
function _droop(numWinners) {
    return (1/(numWinners + 1)) + 1
}
function _hare(numWinners) {
    return 1/numWinners
}

/* allocateExtraVotes takes a (winning) candidate and gives its extra votes to their next choices. There 
 * are a few different strategies for doing this. 
 * 
 * winner is the winning candidate
 * candidates is the list of all the other candidates. It shouldn't include the winning candidate. 
 * winTotal is the total number of votes a candidate needs to win. the amount they have minus this is how many they'll give away. 
 *
 * this will return the candidates list but modified to have the winning candidate's votes redistributed. 
 */
function allocateExtraVotes(winner, candidates, winTotal) {
    return _allocProp2(winner, candidates, winTotal)
}
function _allocHare(winner, candidates, winTotal) {
    var votes = _.shuffle(winner.votes)
    var votesToAlloc = votes.slice(0, winTotal)
    return reallocateVotes(votesToAlloc, candidates)
}

/* AllocateVotes takes a candidate and the list of all the other remaining candidates, and allocates all of 
 * the candidate's votes to their next choices, e.g. if candidate has been eliminated. Exhausted ballots are thrown out. 
 *
 * Candidate should be a candidate. 
 * Candidates should be a list of candidates, not including candidate. 
 */
function allocateCandidateVotes(candidate, candidates) {
    return reallocateVotes(candidate.votes, candidates)
}
function reallocateVotes(votes, candidates) {
    // console.log('\x1b[32m', 'reallocate votes: ', '\x1b[0m') 
    // console.log(JSON.stringify(votes)) 
    // console.log("to candidates:\n" + JSON.stringify(candidates.map((c) => c.id)))
    votes = votes.map((vote) => vote.next)
    // console.log('mapped votes: ' + JSON.stringify(votes))
    return allocateVotes(votes, candidates)
}

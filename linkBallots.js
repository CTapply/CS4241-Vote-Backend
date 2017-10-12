var linkBallots = function(ballots, debug) {
  // {
  //   "userid1": {
  //     votes: [
  //       "optionD-ID",
  //       "optionA-ID",
  //       "optionC-ID"
  //     ]
  //   },
  //   "userid4": {
  //     votes: [
  //       "optionB-ID",
  //       "optionC-ID",
  //       "optionD-ID",
  //       "optionA-ID"
  //     ]
  //   }
  // }

  // [
  //   {
  //     id: "optionD-ID",
  //     votes: [
  //       { choice: "optionD-ID", next: { choice: "optionA-ID" }, ...},
  //       { choice: "optionD-ID", next: { choice: "optionC-ID" }, ...}
  //     ]
  //   },
  //   {
  //     id: "optionC-ID",
  //     votes: [
  //       { choice: "optionC-ID", next: { choice: "optionB-ID" }, ...},
  //       { choice: "optionC-ID", next: { choice: "optionD-ID" }, ...}
  //     ]
  //   }
  //   ...
  // ]

  const rec = (v, i) => {
    if (i < v.length) {
      return {
        choice: v[i],
        next: rec(v, i + 1)
      }
    } else {
      return null
    }
  }

  let allBallotsLinkedList = Object
    .keys(ballots)
    .map(k => {
      //an individual voter's vote order
      let votes = rec(ballots[k].votes, 0)
      return votes;
    })
  if (debug) {
    console.log('\x1b[32m', "allBallotsLinkedList: \n", '\x1b[0m')
    console.log(JSON.stringify(allBallotsLinkedList, null, 2))
  }
  let optionVoteDict = {}
  allBallotsLinkedList.forEach(b => {
    if (optionVoteDict[b.choice]) {
      optionVoteDict[b.choice].votes.push(b)
    } else {
      optionVoteDict[b.choice] = { votes: [b] }
    }
  })
  if (debug) {
    console.log('\x1b[32m', "optionVoteDict: \n", '\x1b[0m')
    console.log(JSON.stringify(optionVoteDict, null, 2))
  }
  let candidateIds = new Set (
    concat(Object.keys(ballots).map((k) => ballots[k].votes))
  );
  //console.log(JSON.stringify(Object.keys(ballots).map((k) => ballots[k].votes), null, 2))
  //console.log(JSON.stringify(concat(Object.keys(ballots).map((k) => ballots[k].votes), null, 2)))
  if (debug) {
    console.log('\x1b[32m', "candidateIds: ", '\x1b[0m')
    candidateIds.forEach((c)=> console.log(c))
  }


  let final = []
  candidateIds.forEach((c) => {
    final.push({
      id: c
    })
  })
  final.forEach((c) => 
    c.votes = (optionVoteDict[c.id] || {votes:[]}).votes //lol
  )

  if (debug) {
    console.log("final: " + JSON.stringify(final))
  }
  /*for (var key in optionVoteDict) {
    cand = final.find((c) => c.id === key) //uh how optimize?
    cand.votes.concat(optionVoteDict[key].votes)
  }*/

  // old way, a little wrong
  /*let final = Object.keys(optionVoteDict).map(k => {
    return {
      id: k,
      votes: optionVoteDict[k].votes
    }
  })*/

  return final
}

module.exports = linkBallots;

function concat(ls) {
  /*var out = []
  for (i in ls) {
    out = out.concat(ls[i])
  }
  return out*/
  return ls.reduce((acc, l) => acc.concat(l), [])
}
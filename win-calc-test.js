var calcr = require('./win-calculator')
const linkBallots = require("./linkBallots.js");

main()

function main() {
    test1()
    test2()
    test3()
    test4()
    test5()
    test6()
    testTrace1()
    testTrace2()
    testAllocProp2()
}

function printResult(result, testNumber) {
    if (result) {
        console.log('test'+testNumber+' passed')
    }
    else {
        console.log('test'+testNumber+' failed')
    }
}

function test1() {
    candidates = [ {'id': 1
                 , 'votes': [ { 'choice': 1
                              , 'next': null}
                            , { 'choice': 1
                              , 'next': null}
                            ]}
                 ]
    result = calcr.countVotes(candidates, 1, false)
    if (result.length === 1 &&
        result[0].id === 1) {
        console.log('test1 passed')
    }
    else {
        console.log('test1 failed')
    }
}

function test2() {
    v2 = { 'choice': 2, 'next': null }
    v1 = { 'choice': 1, 'next': v2 }
    candidates = [{
        'id': 1,
        'votes': [v1, v1
        ]
    },
    {
        'id': 2,
        'votes': [v2, v2, v2
        ]
    }
    ]
    result = calcr.countVotes(candidates, 1, false)
    if (result.length === 1 &&
        result[0].id === 2) {
        console.log('test2 passed')
    }
    else {
        console.log('test2 failed')
    }
}

function test3() {
    v3 = { 'choice': 3, 'next': null }
    v2 = { 'choice': 2, 'next': v3 }
    v1 = { 'choice': 1, 'next': v3 }
    candidates = [{
        'id': 1,
        'votes': [v1, v1
        ]
    },
    {
        'id': 2,
        'votes': [v2, v2, v2
        ]
    },
    {
        'id': 3,
        'votes': [v3, v3, v3
        ]
    }
    ]
    result = calcr.countVotes(candidates, 1, false)
    if (result.length === 1 &&
        result[0].id === 3) {
        console.log('test3 passed')
    }
    else {
        console.log('test3 failed')
    }
}

function test4() {
    v3 = { 'choice': 3, 'next': null }
    v2 = { 'choice': 2, 'next': { 'choice': 3, 'next': null } }
    v1 = { 'choice': 1, 'next': { 'choice': 3, 'next': { 'choice': 2, 'next': null } } }
    candidates = [{
        'id': 1,
        'votes': [v1, v1]
    },
    {
        'id': 2,
        'votes': [v2, v2, v2]
    },
    {
        'id': 3,
        'votes': [v3, v3, v3]
    }
    ]
    result = calcr.countVotes(candidates, 2, false)
    if (result.length === 2 && result.some((c) => c.id === 2) && result.some((c) => c.id === 3)) {
        console.log('test4 passed')
    }
    else {
        console.log('test4 failed')
    }
}

function test5() {
    //v1 = {'choice': 1, 'next': {'choice': 2, 'next': null}}
    v1exhaust = { 'choice': 1, 'next': null }

    v2 = { 'choice': 2, 'next': { 'choice': 1, 'next': null } }

    v3exhaust = { 'choice': 3, 'next': null }
    //v3 = {'choice', 'next': v2}

    candidates = [{ 'id': 1, 'votes': [v1exhaust, v1exhaust, v1exhaust, v1exhaust, v1exhaust, v1exhaust,] }
        , { 'id': 2, 'votes': [v2, v2, v2,] }
        , { 'id': 3, 'votes': [v3exhaust, v3exhaust,] }
    ]
    //console.log(JSON.stringify(candidates))
    result = calcr.countVotes(candidates, 2, false)
    if (result.length === 2 && result.some((c) => c.id === 1) && result.some((c) => c.id === 2)) {
        console.log('test5 passed')
    }
    else {
        console.log('test5 failed')
    }
} 

// regression test checking if algo correctly hanle's votes first next choice being a candidate that was already eliminated
function test6 () {
    v3 = { 'choice': 3, 'next': null }
    candidates = [ {'id': 1, 'votes':[]}
                 , {'id': 2, 'votes':[{'choice': 2, 'next': {'choice': 1, 
                                                             'next': {'choice': 3, 'next': null}}}]}
                 , {'id': 3, 'votes':[v3, v3, v3, v3, v3, v3]}
                 ]
    var result = calcr.countVotes(candidates, 1, false)
    console.log(JSON.stringify(result))
    printResult(result.length === 1 && result[0].id === 3, 6)
    /*if (result.length === 1 && result[0] === 3) {
        console.log('test6 passed')
    }
    else {
        console.log('test6 failed')
    }*/
}

function testTrace1() {
    v2 = { 'choice': 2, 'next': null }
    v1 = { 'choice': 1, 'next': v2 }
    candidates = [{
        'id': 1,
        'votes': [v1, v1]
    },
    {
        'id': 2,
        'votes': [v2, v2, v2]
    }
    ]
    result = calcr.countVotes(candidates, 1, true)
    console.log("trace: \n"+JSON.stringify(result.trace, null, 2))
    var cond =  result.winners.length === 1 
             && result.winners[0].id === 2
             && result.trace.winners.length === 3
             && result.trace.candidates[0].length === 2
             && result.trace.candidates[1].length === 1
    printResult(cond, 'Trace1')
}

function testTrace2() {
  poll = {
    "alreadyScored": false,
    "ballots": {
      "HJO02zORARcTS0QLfXcWvDLIgGc2": {
        "votes": [
          "option-1507735165474",
          "option-1507735171024",
          "option-1507735159665"
        ]
      },
      "La4ccoU4OGdIBhRbvow2vDBPa8t1": {
        "votes": [
          "option-1507735165474",
          "option-1507735159665"
        ]
      },
      "PXLKFGYUwnZdcLOfz8Kji8hpyNi2": {
        "votes": [
          "option-1507735159665",
          "option-1507735171024",
          "option-1507735165474"
        ]
      },
      "SNKokl9RxHPmqSQJID1YPxDxcsy2": {
        "votes": [
          "option-1507735165474",
          "option-1507735171024"
        ]
      },
      "q5cF3sT2lSNeTu2Qg1Pbzlu7Juc2": {
        "votes": [
          "option-1507735159665",
          "option-1507735165474"
        ]
      },
      "yTlcwGqLTOXYwOoVkb1qJcx3IWi1": {
        "votes": [
          "option-1507735155837",
          "option-1507735165474",
          "option-1507735171024"
        ]
      }
    },
    "dateCreated": 1507735089645,
    "desc": "An election for some colorful candidates",
    "numWinners": "3",
    "options": {
      "option-1507735155837": {
        "desc": "In solidarity we stand",
        "title": "Red Labor"
      },
      "option-1507735159665": {
        "desc": "efwe",
        "title": "greens"
      },
      "option-1507735165474": {
        "desc": "patriots",
        "title": "blues"
      },
      "option-1507735171024": {
        "desc": "freedom",
        "title": "yellow"
      }
    },
    "results": {
      "-KwB3FZbAIWIKpFfGb5_": "option-1507735159665",
      "-KwB3FZcIRH5-q2pXQQB": "option-1507735165474",
      "-KwB3FZdo_5KzP3NPR1X": "option-1507735155837"
    },
    "title": "Colorful Election"
  }

  let linkedVotes = linkBallots(poll.ballots, true);
  console.log("linked votes: \n" + JSON.stringify(linkedVotes))
  let numWinners = poll.numWinners;
  let results = calcr.countVotes(linkedVotes, numWinners, true)
  
  console.log("trace: \n"+JSON.stringify(results.trace, null, 2))
  var cond =  results.winners.length === 3 
           && results.trace.winners.length === 4
           && results.trace.candidates[0].length === 4
           && results.trace.candidates[0].some((c) => c.id === 'option-1507735155837' && c.votes.length === 1) // Red should have one vote
           && results.trace.candidates[1].length === 3
  /*assert(results.winners.length === 3, 'results.winners.length === 3')
  assert(results.trace.winners.length === 4, 'results.trace.winners.length === 4')
  assert(results.trace.candidates[0].length === 4, 'results.trace.candidates[0].length === 4')
  assert(results.trace.candidates[0].some((c) => c.id === 'option-1507735155837' && c.votes.length === 1) 
        ,'results.trace.candidates[0].some((c) => c.id === \'option-1507735155837\' && c.votes.length === 1)') // Red should have one vote
  assert(results.trace.candidates[1].length === 3, 'results.trace.candidates[1].length === 3')*/
  printResult(cond, 'Trace2')
  
}

function testAllocProp2() {
    w = { 'id': 1
        , 'votes': [ { 'choice': 1
                     , 'next': {'choice':2, 'next':null}}
                   , { 'choice': 1 
                     , 'next': {'choice':2, 'next':null}}
                   , { 'choice': 1 
                     , 'next': {'choice':2, 'next':null}}
                   , { 'choice': 1 
                     , 'next': {'choice':2, 'next':null}}
                   , { 'choice': 1 
                     , 'next': {'choice':3, 'next':null}}
                   , { 'choice': 1 
                     , 'next': {'choice':3, 'next':null}}
                   ]
        }
    cs = [ { 'id': 2
           , 'votes': []}
         , { 'id': 3
           , 'votes': []}
         ]
    var result = calcr._allocProp2(w, cs, 3)
    console.log(JSON.stringify(result))
    var cond =  result.length === 2
             && result.some((c) => c.id === 2 && c.votes.length === 2)
             && result.some((c) => c.id === 3 && c.votes.length === 1)
    printResult(cond, 'AllocProp2')
}

//cond should be a boolean
function assert(cond, str) {
    if (!cond) throw "AssertError: condition " + str + " was asserted true but is false"
}
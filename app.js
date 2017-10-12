const express = require('express');
const path = require('path');
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const bodyParser = require('body-parser');

const linkBallots = require("./linkBallots.js");
const winCalc = require("./win-calculator.js");

const app = express();

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://cs4241-vote.firebaseio.com"
});

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'client/rcv/build/')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.post('/results', (req, res) => {
  const pollId = req.body.pollId;
  console.log('got results request for ', pollId)
  firebase.database().ref("/polls/"+ pollId).once('value')
  .then((snapshot) => {
    let linkedVotes = linkBallots(snapshot.val().ballots)
    let numWinners = snapshot.val().numWinners
    let results = winCalc.countVotes(linkedVotes, numWinners, true)
    console.log(results)
    res.send(JSON.stringify(results, null, 2));
  })
})

app.post('/poll', (req, res) => {
  const pollId = req.body.pollId;
  firebase.database().ref("/polls/"+ pollId).once('value')
  .then((snapshot) => {
    let poll = snapshot.val();
    res.send(JSON.stringify(poll, null, 2));
  })
})

firebase.database().ref("/polls").on('child_changed', snap => {
  if (snap.val().ballots && snap.val().numWinners) {
    let ballots = snap.val().ballots
    let linkedVotes = linkBallots(ballots)
    console.log(linkedVotes)
    let numWinners = snap.val().numWinners
    let winners = winCalc.countVotes(linkedVotes, numWinners).map(w => w.id)
    console.log("winners:", winners)
  } else console.error("firebase missing data")
})

module.exports = app;

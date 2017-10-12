var findCandidateById = function(id, candidates) {
  var c = candidates.find((c) => c.id == id)
  if (c) {
      return c
  }
  else {
      return null
  }
}

module.exports = findCandidateById;

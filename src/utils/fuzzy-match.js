let matches = function(needle, haystack) {
  let hlen = haystack.length;
  let nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
};

export default {
  methods: {
    fuzzyMatch: function(query, stringToMatch) {
      if (!query || !stringToMatch) { return true; }
      let needles = query.toLowerCase().split(" ");
      let haystack = stringToMatch.toLowerCase();
      return needles.every(needle => matches(needle, haystack));
    }
  }
}

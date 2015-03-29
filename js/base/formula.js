function Formula() {
  var self = this;

  self.boosterCost = function(level) {
    return Math.floor(5 * Math.pow(2.5, level));
  };
}

var f = new Formula();

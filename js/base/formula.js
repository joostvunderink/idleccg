function Formula() {
  var self = this;

  self.boosterCost = function(boosterLevel) {
    return Math.floor(5 * Math.pow(2.5, boosterLevel));
  };

  self.winGoldAmount = function(locationLevel, opponentLevel) {
    return Math.round(locationLevel * (Math.pow(1.8, opponentLevel)));
  };
}

var f = new Formula();

var ITEM_BOOSTER     = 'booster';

// Probability of the number of cards per level.
var boosterNumCardsProbabilityMap = {
  1: {
    1: 0,
    2: 0.8
  },
  2: {
    1: 0,
    2: 0.7,
    3: 0.9,
  },
  3: {
    1: 0,
    2: 0.6,
    3: 0.85,
    4: 0.95,
  },
  4: {
    1: 0,
    2: 0.5,
    3: 0.8,
    4: 0.9,
  },
  5: {
    1: 0,
    2: 0.5,
    3: 0.8,
    4: 0.9,
    5: 0.96
  }
};

function Booster() {
  var self      = this;
  self.type     = ITEM_BOOSTER;
  self.level    = 0;
  self.text     = '';
  self.cssClass = '';
  self.contents = [];

  self.updateText = function() {
    self.text = "B" + self.level;
  };

  self.updateCssClass = function() {
    self.cssClass = 'card-booster';
  };

  self.setSelected = function(value) {
    self.selected = value;
    self.selectedClass = value ? 'card-selected' : '';
  };

  self.updateDisplayProperties = function() {
    self.updateText();
    self.updateCssClass();
  };

  self.determineContents = function() {
    var numberOfCards = self.determineNumberOfCards();
    self.contents = [];
    for (var i = 0; i < numberOfCards; i++) {
      var card = self.createCard();
      self.contents.push(card);
    }
  };

  self.determineNumberOfCards = function() {
    var probabilityMap = boosterNumCardsProbabilityMap[self.level];
    var max = _.max(_.keys(probabilityMap));
    var num;
    var found = false;

    while (!found) {
      var tmpNum = Math.floor(Math.random() * max + 1);
      var chance = Math.random();
      if (chance >= probabilityMap[tmpNum]) {
        num = tmpNum;
        found = true;
      }
    }

    return num;
  };

  self.createCard = function() {
    function randomPowerLevel(level) {
      var pl = Math.floor(Math.random() * (level * level / 2) + level * level / 2);
      if (pl < 1) { 
        pl = 1;
      }
      // console.log("level=%s, pl=%s", level, pl);
      return pl;
    }
    var r = Math.random();
    if (r < 0.2) {
      return ItemFactory({
        type: ITEM_PLAYER_UPGRADE,
        health: randomPowerLevel(self.level),
      });
    }
    if (r < 0.5) {
      return ItemFactory({
        type: ITEM_CARD_UPGRADE,
        power: randomPowerLevel(self.level),
      });
    }
    else if (r < 0.8) {
      return ItemFactory({
        type: ITEM_CARD_UPGRADE,
        damage: Math.round(Math.sqrt(randomPowerLevel(self.level))),
      });
    }
    else {
      return ItemFactory({
        type: ITEM_CARD,
        power: randomPowerLevel(self.level),
        damage: Math.round(Math.sqrt(randomPowerLevel(self.level))),
      });
    }
  };

  self.getContents = function() {
    return self.contents;
  };
}

var BoosterFactory;
(function() {
  BoosterFactory = function(data) {
    var booster = new Booster();

    if (data.id) {
      booster.id = data.id;
    }

    if (data.level) {
      booster.level = data.level;
    }

    booster.determineContents();
    booster.updateDisplayProperties();
    return booster;
};
})();

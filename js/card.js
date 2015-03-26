var ITEM_CARD        = 'card';
var ITEM_UPGRADE     = 'upgrade';
var ITEM_BOOSTER     = 'booster';

function Card() { 
  var self      = this;
  self.type     = ITEM_CARD;
  self.element  = null;
  self.power    = 0;
  self.damage   = 0;
  self.text     = '';
  self.cssClass = '';

  self.applyUpgrade = function(upgradeItem) {
    this.power += upgradeItem.power;
    this.damage += upgradeItem.damage;
    this.updateDisplayProperties();
  };

  self.updateText = function() {
    if (this.isDominated) {
      this.text = this.adjustedPower + "(" + this.power + ")";
    }
    else {
      this.text = this.power;
    }
  };

  self.updateCssClass = function() {
    if (this.element) {
      this.cssClass = this.element.cssClass;
    }
  };

  self.setSelected = function(value) {
    self.selected = value;
    self.selectedClass = value ? 'card-selected' : '';
  };

  self.updateDisplayProperties = function() {
    self.updateText();
    self.updateCssClass();
  };
}

function Upgrade() {
  var self      = this;
  self.type     = ITEM_UPGRADE;
  self.power    = 0;
  self.health   = 0;
  self.text     = '';
  self.cssClass = '';

  self.updateText = function() {
    if (self.power > 0) {
      self.text = "p+" + self.power;
    }
    if (self.damage > 0) {
      self.text = "d+" + self.damage;
    }
  };

  self.updateCssClass = function() {
    self.cssClass = 'card-upgrade';
  };

  self.setSelected = function(value) {
    self.selected = value;
    self.selectedClass = value ? 'card-selected' : '';
  };

  self.updateDisplayProperties = function() {
    self.updateText();
    self.updateCssClass();
  };
}

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
    if (r < 0.4) {
      return ItemFactory({
        type: ITEM_UPGRADE,
        power: randomPowerLevel(self.level),
      });
    }
    else if (r < 0.7) {
      return ItemFactory({
        type: ITEM_UPGRADE,
        damage: randomPowerLevel(self.level),
      });
    }
    else {
      return ItemFactory({
        type: ITEM_CARD,
        power: randomPowerLevel(self.level),
      });
    }
  };

  self.getContents = function() {
    return self.contents;
  };
}

// We use an IIFE here, to keep getNextCardId out of the global scope.
var CardFactory;
(function() {
  CardFactory = function(data) {
    var card = new Card();

    if (data.id) {
      card.id = data.id;
    }

    if (data.element) {
      card.element = data.element;
    }
    else {
      card.element = getRandomElement();
    }

    if (data.power) {
      card.power = data.power;
    }
    else {
      card.power = 1;
    }

    if (data.damage) {
      card.damage = data.damage;
    }
    else {
      card.damage = 1;
    }

    card.updateDisplayProperties();
    return card;
};
})();

var UpgradeFactory;
(function() {
  UpgradeFactory = function(data) {
    var upgrade = new Upgrade();

    if (data.id) {
      upgrade.id = data.id;
    }

    if (data.power) {
      upgrade.power = data.power;
    }
    else {
      upgrade.power = 0;
    }

    if (data.damage) {
      upgrade.damage = data.damage;
    }
    else {
      upgrade.damage = 0;
    }

    upgrade.updateDisplayProperties();
    return upgrade;
};
})();

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

var ItemFactory;
(function() {
  var itemId = 0;
  function getNextItemId() {
    itemId++;
    return itemId;
  }

  ItemFactory = function(data) {
    data.id = getNextItemId();
    if (data.type === ITEM_CARD) {
      return CardFactory(data);
    }
    else if (data.type === ITEM_UPGRADE) {
      return UpgradeFactory(data);
    }
    else if (data.type === ITEM_BOOSTER) {
      return BoosterFactory(data);
    }
    else {
      throw new Error("Cannot create item of type '" + data.type + "'");
    }
};
})();
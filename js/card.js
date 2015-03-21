var ITEM_UNKNOWN     = 'unknown';
var ITEM_CARD        = 'card';
var ITEM_UPGRADE     = 'upgrade';
var ITEM_BOOSTER     = 'booster';

// TODO: Get inheritance/prototyping to work.
function Item() {
  var self = this;

  self.selected = false;

  self.setSelected = function(value) {
    self.selected = value;
    self.selectedClass = value ? 'card-selected' : '';
  };

  self.updateDisplayProperties = function() {
    console.log(self.updateText);
    self.updateText();
    self.updateCssClass();
  };
}

function Card() { 
  var self      = this;
  self.type     = ITEM_CARD;
  self.element  = null;
  self.power    = 0;
  self.text     = '';
  self.cssClass = '';

  self.applyUpgrade = function(upgradeItem) {
    this.power += upgradeItem.power;
    this.updateDisplayProperties();
  };

  self.updateText = function() {
    this.text = this.power;
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

Upgrade.prototype = new Item();

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
    var card = ItemFactory({
      type: ITEM_UPGRADE,
      power: 1,
    });
    self.contents = [ card ];
  };

  self.getContents = function() {
    return self.contents;
  };
}

Booster.prototype = new Item();

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
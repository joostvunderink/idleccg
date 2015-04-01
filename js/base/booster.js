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
    var numberOfItems = determineNumberOfItemsInBooster(self.level);
    self.contents = [];
    for (var i = 0; i < numberOfItems; i++) {
      var item = createRandomItemForBoosterLevel(self.level);
      self.contents.push(item);
    }
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
        health: 3 * randomPowerLevel(self.level),
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

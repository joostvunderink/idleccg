function CardUpgrade() {
  var self      = this;
  self.type     = ITEM_CARD_UPGRADE;
  self.power    = 0;
  self.damage   = 0;
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

var CardUpgradeFactory;
(function() {
  CardUpgradeFactory = function(data) {
    var upgrade = new CardUpgrade();

    if (data.id) {
      upgrade.id = data.id;
    }

    if (data.power) {
      if (typeof(data.power) === 'number') {
        upgrade.power = data.power;
      }
      else {
        upgrade.power = f.RandomGaussianAmount(data.power[0], data.power[1]);
      }
    }

    if (data.damage) {
      if (typeof(data.damage) === 'number') {
        upgrade.damage = data.damage;
      }
      else {
        upgrade.damage = f.RandomGaussianAmount(data.damage[0], data.damage[1]);
      }
    }

    upgrade.updateDisplayProperties();
    return upgrade;
};
})();


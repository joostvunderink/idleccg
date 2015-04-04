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
      upgrade.power = data.power;
    }

    if (data.damage) {
      upgrade.damage = data.damage;
    }

    if (data.powerAverage) {
      upgrade.power = f.RandomGaussianAmount(data.powerAverage, data.powerStdDev);
    }

    if (data.damageAverage) {
      upgrade.damage = f.RandomGaussianAmount(data.damageAverage, data.damageStdDev);
    }

    upgrade.updateDisplayProperties();
    return upgrade;
};
})();


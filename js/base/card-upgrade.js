var ITEM_UPGRADE     = 'upgrade';

function Upgrade() {
  var self      = this;
  self.type     = ITEM_UPGRADE;
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

    if (data.damage) {
      upgrade.damage = data.damage;
    }

    upgrade.updateDisplayProperties();
    return upgrade;
};
})();


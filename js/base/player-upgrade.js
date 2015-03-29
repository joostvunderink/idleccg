var ITEM_PLAYER_UPGRADE = 'player-upgrade';

function PlayerUpgrade() {
  var self      = this;
  self.type     = ITEM_PLAYER_UPGRADE;
  self.health   = 0;
  self.text     = '';
  self.cssClass = '';

  self.updateText = function() {
    if (self.health > 0) {
      self.text = "h+" + self.health;
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

var PlayerUpgradeFactory;
(function() {
  PlayerUpgradeFactory = function(data) {
    var playerUpgrade = new PlayerUpgrade();

    if (data.id) {
      playerUpgrade.id = data.id;
    }

    if (data.health) {
      playerUpgrade.health = data.health;
    }

    playerUpgrade.updateDisplayProperties();
    return playerUpgrade;
};
})();

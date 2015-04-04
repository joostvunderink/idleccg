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
      this.text = "(" + this.adjustedPower + ")";
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
      if (typeof(data.power) === 'number') {
        card.power = data.power;
      }
      else {
        card.power = f.RandomGaussianAmount(data.power[0], data.power[1]);
      }
    }

    if (data.damage) {
      if (typeof(data.damage) === 'number') {
        card.damage = data.damage;
      }
      else {
        card.damage = f.RandomGaussianAmount(data.damage[0], data.damage[1]);
      }
    }

    card.updateDisplayProperties();
    return card;
};
})();

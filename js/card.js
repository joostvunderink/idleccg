var CARDTYPE_PLAY = 'play';
var CARDTYPE_UPGRADE = 'upgrade';

function Card() {
  var self = this;

  self.id      = null;
  self.type    = CARDTYPE_PLAY;
  self.element = null;
  self.power   = 0;

  self.setType = function(newType) {
    self.type = newType;
    self.updateDisplayProperties();
  };

  self.setSelected = function(value) {
    self.selected = value;
    self.selectedClass = value ? 'card-selected' : '';
  };

  self.applyUpgrade = function(upgradeCard) {
    self.power += upgradeCard.power;
    self.updateDisplayProperties();
  };

  self.updateDisplayProperties = function() {
    self.updateText();
    self.updateCssClass();
  };

  self.updateText = function() {
    if (self.type === CARDTYPE_UPGRADE) {
      self.text = "+" + self.power;
    }
    if (self.type === CARDTYPE_PLAY) {
      self.text = self.power;
    }
  };

  self.updateCssClass = function() {
    if (self.type === CARDTYPE_UPGRADE) {
      self.cssClass = 'card-upgrade';
    }

    if (self.type === CARDTYPE_PLAY) {
      self.cssClass = self.element.cssClass;
    }
  };
};

// We use an IIFE here, to keep getNextCardId out of the global scope.
var CardFactory;
(function() {

  var cardId = 0;
  function getNextCardId() {
    cardId++;
    return cardId;
  }

  CardFactory = function(data) {
    var card = new Card();

    card.id      = getNextCardId();

    if (data.element) {
      card.element = data.element;
    }
    else {
      card.element = getRandomElement();
    }

    if (data.power) {
      card.power = data.power;
    }

    if (data.type) {
      card.type = data.type;
    }

    card.updateDisplayProperties();
    return card;
};
})();


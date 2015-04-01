function Deck() {
  var self = this;

  self.id             = null;
  self.cards          = [];
  self.totalPower     = 0;
  self.primaryElement = ELEMENT_NONE;

  self.addCard = function(card) {
    this.cards.push(card);
    this.calculateTotalPower();
    this.calculateTotalDamage();
    this.getPrimaryElement();
  };

  self.removeCard = function(card) {
    _.remove(this.cards, { id: card.id });
    this.calculateTotalPower();
    this.calculateTotalDamage();
    this.getPrimaryElement();
  };

  self.calculateTotalPower = function() {
    var totalPower = 0;
    self.cards.forEach(function(card) {
      totalPower += card.power;
    });
    self.totalPower = totalPower;
  };

  self.calculateTotalDamage = function() {
    var totalDamage = 0;
    self.cards.forEach(function(card) {
      totalDamage += card.damage;
    });
    self.totalDamage = totalDamage;
  };

  self.calculateAdjustedPower = function(opposingPrimaryElement) {
    var adjustedPower = 0;
    self.cards.forEach(function(card) {
      if (opposingPrimaryElement.dominates(card.element)) {
        card.adjustedPower = parseInt(card.power / 2);
        card.isDominated = true;
        card.dominatedClass = 'card-dominated';
      }
      else {
        card.adjustedPower = card.power;
        card.isDominated = false;
        card.dominatedClass = '';
      }
      card.updateDisplayProperties();
      adjustedPower += card.adjustedPower;
    });
    self.adjustedPower = adjustedPower;
  }

  self.getPrimaryElement = function() {
    var elementMap = _.countBy(self.cards, function(card) {
      if (!card.element) {
        console.error(card);
      }
      return card.element.name;
    });

    var primaryElement;
    var primaryElementNumCards = 0;

    for (var key in elementMap) {
      if (elementMap[key] > primaryElementNumCards) {
        primaryElementNumCards = elementMap[key];
        primaryElement = key;
      }
    }

    // DIRTY HACK!
    if (primaryElementNumCards < 2) {
      self.primaryElement = ELEMENT_NONE;
    }
    else {
      self.primaryElement = ELEMENT_BY_NAME[primaryElement];
    }
  };

  self.unselectCards = function() {
    self.cards.forEach(function(c) {
      c.setSelected(false);
    });
  };
};

// We use an IIFE here, to keep getNextDeckId out of the global scope.
var DeckFactory;
(function() {

  var deckId = 0;
  function getNextDeckId() {
    deckId++;
    return deckId;
  }

  DeckFactory = function(data) {
    var deck = new Deck();

    deck.id = getNextDeckId();

    return deck;
};
})();

function createInitialPlayerDeck() {
  var deck = DeckFactory();

  [ELEMENT_AIR, ELEMENT_FIRE].forEach(function(element) {
    var card = ItemFactory({
      type   : ITEM_CARD,
      element: element,
      power  : 1,
    });
    deck.addCard(card);
  });

  [ELEMENT_WATER].forEach(function(element) {
    var card = ItemFactory({
      type   : ITEM_CARD,
      element: element,
      damage : 1,
    });
    deck.addCard(card);
  });

  return deck;
}

function createOpponentDeck(data) {
  var deck = DeckFactory();

  for (var i = 0; i < data.deckSize; i++) {
    var power = Math.round( data.powerAverage + data.powerStdDev * f.RandomNormalised());
    if (power < 0) {
      power = 0;
    }
    var damage = Math.round( data.damageAverage + data.damageStdDev * f.RandomNormalised());
    if (damage < 0) {
      damage = 0;
    }
    var element = getRandomElement();
    var card = ItemFactory({
      type   : ITEM_CARD,
      element: element,
      power  : power,
      damage : damage
    });
    deck.addCard(card);
  }

  return deck;
}

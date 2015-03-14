function Deck() {
  var self = this;

  self.id             = null;
  self.cards          = [];
  self.totalPower     = 0;
  self.primaryElement = ELEMENT_NONE;

  self.addCard = function(card) {
    this.cards.push(card);
    this.calculateTotalPower();
    this.getPrimaryElement();
  };

  self.removeCard = function(card) {
    _.remove(this.cards, { id: card.id });
    this.calculateTotalPower();
    this.getPrimaryElement();
  };

  self.calculateTotalPower = function() {
    var totalPower = 0;
    self.cards.forEach(function(card) {
      totalPower += card.power;
    });
    self.totalPower = totalPower;
  };

  self.calculateAdjustedPower = function(opposingPrimaryElement) {
    var adjustedPower = 0;
    self.cards.forEach(function(card) {
      if (opposingPrimaryElement.dominates(card.element)) {
        card.adjustedPower = parseInt(card.power / 2);
        if (card.adjustedPower < card.power) {
          card.isDominated = true;
          card.dominatedClass = 'card-dominated';
        }
      }
      else {
        card.adjustedPower = card.power;
        card.isDominated = false;
        card.dominatedClass = '';
      }
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

  [ELEMENT_WATER, ELEMENT_AIR, ELEMENT_FIRE].forEach(function(element) {
    var card = CardFactory({
      element: element,
      power  : 1,
    });
    deck.addCard(card);
  });

  return deck;
}

function createOpponentDeck(data) {
  var deck = DeckFactory();

  for (var i = 0; i < data.deckSize; i++) {
    var power = Math.floor( (Math.random() * (data.maxPower - data.minPower)) + data.minPower);
    var element = getRandomElement();
    var card = CardFactory({
      element: element,
      power  : power,
    });
    deck.addCard(card);
  }

  return deck;
}

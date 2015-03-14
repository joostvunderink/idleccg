function Deck() {
  var self = this;

  self.id         = null;
  self.cards      = [];
  self.totalPower = 0;

  self.addCard = function(card) {
    this.cards.push(card);
    this.calculateTotalPower();
  };

  self.calculateTotalPower = function() {
    var totalPower = 0;
    self.cards.forEach(function(card) {
      totalPower += card.power;
    });
    self.totalPower = totalPower;
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

function getInitialPlayerDeck() {
  var deck = DeckFactory();

  [WATER, AIR, FIRE].forEach(function(element) {
    var card = CardFactory({
      element: element,
      power  : 1,
    });
    deck.addCard(card);
  });

  return deck;
}

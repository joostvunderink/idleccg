var CARDTYPE_PLAY = 'play';

function Card() {
  var self = this;

  self.id      = null;
  self.type    = CARDTYPE_PLAY;
  self.element = null;
  self.power   = 0;
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

    return card;
};
})();


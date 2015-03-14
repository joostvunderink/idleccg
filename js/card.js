var CardFactory;
var Card;

var CARDTYPE_PLAY = 'play';

// We use an IIFE here, to keep getNextCardId out of the global scope.
(function() {

  var cardId = 0;
  function getNextCardId() {
    cardId++;
    return cardId;
  }

  Card = function() {
    var id = null;
    var type = CARDTYPE_PLAY;
    var element = null;
    
  };

  CardFactory = function(data) {
    var c = new Card();

    c.id      = getNextCardId();
    c.type    = CARDTYPE_PLAY;
    c.element = getRandomElement();

    return c;
};
})();


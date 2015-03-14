function Collection() {
  var self = this;

  self.id         = null;
  self.cards      = [];

  self.addCard = function(card) {
    this.cards.push(card);
  };

  self.removeCard = function(card) {
    _.remove(this.cards, { id: card.id });
  };
};

// We use an IIFE here, to keep getNextCollectionId out of the global scope.
var CollectionFactory;
(function() {

  var collectionId = 0;
  function getNextCollectionId() {
    collectionId++;
    return collectionId;
  }

  CollectionFactory = function(data) {
    var collection = new Collection();

    collection.id = getNextCollectionId();

    return collection;
};
})();

function createInitialPlayerCollection() {
  var collection = CollectionFactory();

  [ELEMENT_EARTH].forEach(function(element) {
    var card = CardFactory({
      element: element,
      power  : 1,
    });
    collection.addCard(card);
  });

  return collection;
}

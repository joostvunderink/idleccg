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

  self.removeRandomCard = function() {
    var index = parseInt(Math.random() * self.cards.length);
    var card = self.cards[index];
    _.remove(this.cards, { id: card.id });
    return card;
  };

  self.unselectCards = function() {
    self.cards.forEach(function(c) {
      c.setSelected(false);
    });
  };

  self.calculateAdjustedPower = function(opposingPrimaryElement) {
    var adjustedPower = 0;
    self.cards.forEach(function(card) {
      if (card.type !== ITEM_CARD) {
        return;
      }
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

  [ELEMENT_FIRE].forEach(function(element) {
    var card = ItemFactory({
      type   : ITEM_CARD,
      element: element,
      power  : 1
    });
    collection.addCard(card);
  });

  [ELEMENT_EARTH].forEach(function(element) {
    var card = ItemFactory({
      type   : ITEM_CARD,
      element: element,
      damage  : 1
    });
    collection.addCard(card);
  });

  var upgradeCard = ItemFactory({
    type: ITEM_CARD_UPGRADE,
    power: 1,
  });
  collection.addCard(upgradeCard);

  var playerUpgradeCard = ItemFactory({
    type: ITEM_PLAYER_UPGRADE,
    health: 1,
  });
  collection.addCard(playerUpgradeCard);

  //var booster = ItemFactory({
  //  type: ITEM_BOOSTER,
  //  level: 1,
  //});
  //collection.addCard(booster);

  return collection;
}

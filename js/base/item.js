var ItemFactory;
(function() {
  var itemId = 0;
  function getNextItemId() {
    itemId++;
    return itemId;
  }

  ItemFactory = function(data) {
    data.id = getNextItemId();
    if (data.type === ITEM_CARD) {
      return CardFactory(data);
    }
    else if (data.type === ITEM_CARD_UPGRADE) {
      return CardUpgradeFactory(data);
    }
    else if (data.type === ITEM_PLAYER_UPGRADE) {
      return PlayerUpgradeFactory(data);
    }
    else if (data.type === ITEM_BOOSTER) {
      return BoosterFactory(data);
    }
    else {
      throw new Error("Cannot create item of type '" + data.type + "'");
    }
};
})();
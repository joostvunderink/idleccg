function getRandomOptionFromWeightedList(list) {
  var total = 0;
  list.forEach(function(option) {
    total += option.chance;
  });

  var randomValue = parseInt(Math.random() * total + 1);

  for (var i = 0; i < list.length; i++) {
    var option = list[i];
    if (randomValue <= option.chance) {
      return option.data;
    }
    randomValue -= option.chance;
  }

  throw new Error("Couldn't get random option from weighted list.");
}

function determineNumberOfItemsInBooster(level) {
  return getRandomOptionFromWeightedList(numItemsPerBoosterLevelTable[level]).amount;
}

function createRandomItemForBoosterLevel(level) {
  var initData = getRandomOptionFromWeightedList(itemInBoosterOfLevelTable[level]);
  var item = ItemFactory(initData);
  return item;
}

var numItemsPerBoosterLevelTable = {
  1: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 5,
      data: { amount: 4 }
    }
  ],
  2: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 8,
      data: { amount: 4 }
    }
  ],
  3: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 12,
      data: { amount: 4 }
    }
  ],
  4: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 15,
      data: { amount: 4 }
    }
  ],
  5: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 20,
      data: { amount: 4 }
    }
  ],
  6: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 25,
      data: { amount: 4 }
    }
  ],
  7: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 30,
      data: { amount: 4 }
    }
  ],
  8: [
    {
      chance: 100,
      data: { amount: 3 }
    },
    {
      chance: 40,
      data: { amount: 4 }
    },
    {
      chance: 5,
      data: { amount: 5 }
    }
  ],
};

var itemsInBoosterLevel1 = [
  { chance: 100, data: { type: ITEM_CARD,           power : 1 } },
  { chance:  60, data: { type: ITEM_CARD,           power : 2 } },
  { chance:  30, data: { type: ITEM_CARD,           power : 3 } },
  { chance: 100, data: { type: ITEM_CARD,           damage: 1 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power : 1 } },
  { chance:  50, data: { type: ITEM_CARD_UPGRADE,   damage: 1 } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [2, 1] } },
];

var itemsInBoosterLevel2 = [
  { chance:  50, data: { type: ITEM_CARD,           power : 3 } },
  { chance:  90, data: { type: ITEM_CARD,           power : 4 } },
  { chance:  90, data: { type: ITEM_CARD,           power : 5 } },
  { chance:  60, data: { type: ITEM_CARD,           power : 6 } },
  { chance:  30, data: { type: ITEM_CARD,           power : 7 } },
  { chance: 100, data: { type: ITEM_CARD,           damage: 2 } },
  { chance:  60, data: { type: ITEM_CARD,           damage: 3 } },
  { chance:  30, data: { type: ITEM_CARD,           damage: 4 } },
  { chance:  50, data: { type: ITEM_CARD_UPGRADE,   damage: 1 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power : 1 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   power : 2 } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [3, 1] } },
];

var itemsInBoosterLevel3 = [
  { chance:  20, data: { type: ITEM_CARD,           power : 5 } },
  { chance:  60, data: { type: ITEM_CARD,           power : 6 } },
  { chance: 100, data: { type: ITEM_CARD,           power : 7 } },
  { chance:  50, data: { type: ITEM_CARD,           power : 8 } },
  { chance:  30, data: { type: ITEM_CARD,           power : 9 } },
  { chance: 100, data: { type: ITEM_CARD,           damage: 3 } },
  { chance:  30, data: { type: ITEM_CARD,           damage: 4 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   damage: 1 } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   power : 1 } },
  { chance:  50, data: { type: ITEM_CARD_UPGRADE,   power : 2 } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [5, 1] } },
];

var itemsInBoosterLevel4 = [
  { chance:  40, data: { type: ITEM_CARD,           power : [ 8, 1] } },
  { chance: 100, data: { type: ITEM_CARD,           power : [10, 2] } },
  { chance: 100, data: { type: ITEM_CARD,           damage: [ 4, 1] } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   damage: 1 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   damage: 2 } },
  { chance:  20, data: { type: ITEM_CARD_UPGRADE,   power : 2 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power : 3 } },
  { chance:  40, data: { type: ITEM_CARD_UPGRADE,   power : 4 } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [8, 1] } },
];

var itemsInBoosterLevel5 = [
  { chance:  40, data: { type: ITEM_CARD,           power : [11, 3] } },
  { chance: 100, data: { type: ITEM_CARD,           power : [15, 4] } },
  { chance: 100, data: { type: ITEM_CARD,           damage: [ 6, 2] } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   damage: 2 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   damage: 3 } },
  { chance:  20, data: { type: ITEM_CARD_UPGRADE,   power : 4 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power : 5 } },
  { chance:  40, data: { type: ITEM_CARD_UPGRADE,   power : 6 } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [12, 2] } },
];

var itemsInBoosterLevel6 = [
  { chance:  40, data: { type: ITEM_CARD,           power : [20, 4] } },
  { chance: 100, data: { type: ITEM_CARD,           power : [30, 6] } },
  { chance: 100, data: { type: ITEM_CARD,           damage: [10, 3] } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   damage: 3 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   damage: 4 } },
  { chance:  20, data: { type: ITEM_CARD_UPGRADE,   power : 5 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power : 6 } },
  { chance:  40, data: { type: ITEM_CARD_UPGRADE,   power : 7 } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [20, 2] } },
];

var itemsInBoosterLevel7 = [
  { chance:  40, data: { type: ITEM_CARD,           power : [40, 5] } },
  { chance: 100, data: { type: ITEM_CARD,           power : [75, 8] } },
  { chance: 100, data: { type: ITEM_CARD,           damage: [17, 4] } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   damage: [ 8, 2] } },
  { chance: 140, data: { type: ITEM_CARD_UPGRADE,   power : [13, 3] } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [45, 5] } },
];

var itemsInBoosterLevel8 = [
  { chance:  40, data: { type: ITEM_CARD,           power : [ 90,  9] } },
  { chance: 100, data: { type: ITEM_CARD,           power : [110, 12] } },
  { chance: 100, data: { type: ITEM_CARD,           damage: [ 33,  6] } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   damage: [ 15,  3] } },
  { chance: 140, data: { type: ITEM_CARD_UPGRADE,   power : [ 35,  5] } },
  { chance: 250, data: { type: ITEM_PLAYER_UPGRADE, health: [ 90,  8] } },
];

// The data is an object which can be given to ItemFactory
var itemInBoosterOfLevelTable = {
  1: itemsInBoosterLevel1,
  2: itemsInBoosterLevel2,
  3: itemsInBoosterLevel3,
  4: itemsInBoosterLevel4,
  5: itemsInBoosterLevel5,
  6: itemsInBoosterLevel6,
  7: itemsInBoosterLevel7,
  8: itemsInBoosterLevel8,
};

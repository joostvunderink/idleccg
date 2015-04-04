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
  { chance: 100, data: { type: ITEM_CARD,           power: 1, damage: 0 } },
  { chance:  60, data: { type: ITEM_CARD,           power: 2, damage: 0 } },
  { chance:  30, data: { type: ITEM_CARD,           power: 3, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           power: 0, damage: 1 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power: 1, damage: 0 } },
  { chance:  50, data: { type: ITEM_CARD_UPGRADE,   power: 0, damage: 1 } },
  { chance: 100, data: { type: ITEM_PLAYER_UPGRADE, health: 1 } },
  { chance:  50, data: { type: ITEM_PLAYER_UPGRADE, health: 2 } },
  { chance:  10, data: { type: ITEM_PLAYER_UPGRADE, health: 3 } }
];

var itemsInBoosterLevel2 = [
  { chance:  50, data: { type: ITEM_CARD,           power: 3, damage: 0 } },
  { chance:  90, data: { type: ITEM_CARD,           power: 4, damage: 0 } },
  { chance:  90, data: { type: ITEM_CARD,           power: 5, damage: 0 } },
  { chance:  60, data: { type: ITEM_CARD,           power: 6, damage: 0 } },
  { chance:  30, data: { type: ITEM_CARD,           power: 7, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           power: 0, damage: 2 } },
  { chance:  60, data: { type: ITEM_CARD,           power: 0, damage: 3 } },
  { chance:  30, data: { type: ITEM_CARD,           power: 0, damage: 4 } },
  { chance:  50, data: { type: ITEM_CARD_UPGRADE,   power: 0, damage: 1 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power: 1, damage: 0 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   power: 2, damage: 0 } },
  { chance:  40, data: { type: ITEM_PLAYER_UPGRADE, health: 1 } },
  { chance:  90, data: { type: ITEM_PLAYER_UPGRADE, health: 2 } },
  { chance:  50, data: { type: ITEM_PLAYER_UPGRADE, health: 3 } },
  { chance:  10, data: { type: ITEM_PLAYER_UPGRADE, health: 4 } }
];

var itemsInBoosterLevel3 = [
  { chance:  20, data: { type: ITEM_CARD,           power: 5, damage: 0 } },
  { chance:  60, data: { type: ITEM_CARD,           power: 6, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           power: 7, damage: 0 } },
  { chance:  50, data: { type: ITEM_CARD,           power: 8, damage: 0 } },
  { chance:  30, data: { type: ITEM_CARD,           power: 9, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           power: 0, damage: 3 } },
  { chance:  30, data: { type: ITEM_CARD,           power: 0, damage: 4 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   power: 0, damage: 1 } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   power: 1, damage: 0 } },
  { chance:  50, data: { type: ITEM_CARD_UPGRADE,   power: 2, damage: 0 } },
  { chance:  40, data: { type: ITEM_PLAYER_UPGRADE, health: 2 } },
  { chance:  80, data: { type: ITEM_PLAYER_UPGRADE, health: 3 } },
  { chance:  70, data: { type: ITEM_PLAYER_UPGRADE, health: 4 } },
  { chance:  30, data: { type: ITEM_PLAYER_UPGRADE, health: 5 } }
];

var itemsInBoosterLevel4 = [
  { chance:  40, data: { type: ITEM_CARD,           powerAverage: 8, powerStdDev: 2, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           powerAverage: 10, powerStdDev: 3, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           power: 0, damageAverage: 4, damageStdDev: 2 } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   power: 0, damage: 1 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   power: 0, damage: 2 } },
  { chance:  20, data: { type: ITEM_CARD_UPGRADE,   power: 2, damage: 0 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power: 3, damage: 0 } },
  { chance:  40, data: { type: ITEM_CARD_UPGRADE,   power: 4, damage: 0 } },
  { chance:  40, data: { type: ITEM_PLAYER_UPGRADE, healthAverage: 5, healthStdDev: 1 } },
];

var itemsInBoosterLevel5 = [
  { chance:  40, data: { type: ITEM_CARD,           powerAverage: 11, powerStdDev: 3, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           powerAverage: 15, powerStdDev: 4, damage: 0 } },
  { chance: 100, data: { type: ITEM_CARD,           power: 0, damageAverage: 6, damageStdDev: 2 } },
  { chance:  60, data: { type: ITEM_CARD_UPGRADE,   power: 0, damage: 2 } },
  { chance:  30, data: { type: ITEM_CARD_UPGRADE,   power: 0, damage: 3 } },
  { chance:  20, data: { type: ITEM_CARD_UPGRADE,   power: 4, damage: 0 } },
  { chance:  80, data: { type: ITEM_CARD_UPGRADE,   power: 5, damage: 0 } },
  { chance:  40, data: { type: ITEM_CARD_UPGRADE,   power: 6, damage: 0 } },
  { chance:  40, data: { type: ITEM_PLAYER_UPGRADE, healthAverage: 7, healthStdDev: 2 } },
];

// The data is an object which can be given to ItemFactory
var itemInBoosterOfLevelTable = {
  1: itemsInBoosterLevel1,
  2: itemsInBoosterLevel2,
  3: itemsInBoosterLevel3,
  4: itemsInBoosterLevel4,
  5: itemsInBoosterLevel5,
  6: itemsInBoosterLevel1,
  7: itemsInBoosterLevel1,
  8: itemsInBoosterLevel1,
  9: itemsInBoosterLevel1,
};

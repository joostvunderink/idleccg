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

var numCardsPerBoosterLevelTable = {
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

function determineNumberOfCardsInBooster(level) {
  return getRandomOptionFromWeightedList(numCardsPerBoosterLevelTable[level]).amount;
}

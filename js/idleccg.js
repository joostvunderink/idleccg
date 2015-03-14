var cardGameApp = angular.module('cardGameApp',['ui.bootstrap', 'ngLodash']);

var debug = false;

function logDebug(msg) {
  if (debug) {
    console.log(msg);
  }
}

var _;

cardGameApp.controller('gameCtrl', ['$scope', '$interval', 'lodash', function($scope, $interval, lodash) {
  _ = lodash;
  $scope.player = {
    health: {
      max: 20,
      current: 20,
    },
    deck: getInitialPlayerDeck(),
    collection: {
      cards: [
        {
          id: 4,
          power: 6,
          element: AIR,
        },
        {
          id: 5,
          power: 3,
          element: EARTH,
        },
        {
          id: 6,
          power: 4,
          element: EARTH,
          selected: true,
          selectedClass: 'card-selected'
        },
      ]
    }
  };

  $scope.opponent = {
    health: {
      max: 15,
      current: 15,
    },
    deck: {
    }
  };

  giveOpponentRandomDeck($scope, 3);

  $scope.gold = 0;

  calculateDeckPowers($scope)

  $scope.gameData = {
    startTime         : new Date().getTime(),
    previousUpdateTime: new Date().getTime(),
    score             : 0.0,
    totalScore        : 0.0,
    scorePerSecond    : 1.0,
    timeSinceStart    : 0.0,
    scorePerClick     : 1,
    boughtObjects     : {
      small : 0,
      medium: 0,
      large : 0,
    },
  };

  $interval(function() { updateStatus($scope) }, 378);

  $scope.selectCardInCollection = function(card) {
    $scope.player.collection.cards.forEach(function(c) {
      c.selected = false;
      c.selectedClass = '';
    })
    console.log(card);
    card.selected = true;
    card.selectedClass = 'card-selected';
  };
}]);

function updateStatus($scope) {
  var currentTime = new Date().getTime();
  var timeDiff = (currentTime - $scope.gameData.previousUpdateTime) / 1000;
  // console.log(timeDiff);
  $scope.gameData.score += $scope.gameData.scorePerSecond * timeDiff;
  $scope.gameData.totalScore += $scope.gameData.scorePerSecond * timeDiff;
  $scope.gameData.timeSinceStart = (currentTime - $scope.gameData.startTime) / 1000;
  $scope.gameData.previousUpdateTime = currentTime;
  
  processGameTurn($scope);
}


function processGameTurn($scope) {
  var playerFactor = $scope.player.deck.adjustedPower / ($scope.player.deck.adjustedPower + $scope.opponent.deck.adjustedPower);
  var randomNumber = Math.random();

  if (randomNumber <= playerFactor) {
    // Player hits opponent
    $scope.opponent.health.current--;
    if ($scope.opponent.health.current <= 0) {
      playerWins($scope);
    }
  }
  else {
    // Opponent hits player
    $scope.player.health.current--;
    if ($scope.player.health.current <= 0) {
      opponentWins($scope);
    }
  }
}

function playerWins($scope) {
  $scope.gold += 10;
  resetGame($scope);
}

function opponentWins($scope) {
  resetGame($scope);
}

function resetGame($scope) {
  console.log("resetting game");
  $scope.player.health.current = $scope.player.health.max;
  $scope.opponent.health.current = $scope.opponent.health.max;
  giveOpponentRandomDeck($scope, 3);
}

function getPrimaryElement(cards) {
  var elementMap = _.countBy(cards, function(card) {
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
  if (primaryElementNumCards === 1) {
    return NONE;
  }

  return ELEMENT_BY_NAME[primaryElement];
}

function calculateAdjustedPower(cards, opposingPrimaryElement) {
  cards.forEach(function(card) {
    if (opposingPrimaryElement.dominates(card.element)) {
      card.adjustedPower = parseInt(card.power / 2);
      if (card.adjustedPower < card.power) {
        card.dominatedClass = 'card-dominated';
      }
    }
    else {
      card.adjustedPower = card.power;
      card.dominatedClass = '';
    }
  });
}

function calculateDeckAdjustedPower(cards) {
  return cards.reduce(function(a, b) {
    return { adjustedPower: a.adjustedPower + b.adjustedPower }; 
  } , {adjustedPower: 0})
    .adjustedPower;
}

function calculateDeckPower(cards) {
  return cards.reduce(function(a, b) {
    return { power: a.power + b.power }; 
  } , {power: 0})
    .power;
}

function calculateDeckPowers($scope) {
  $scope.player.deck.primaryElement   = getPrimaryElement($scope.player.deck.cards);
  $scope.opponent.deck.primaryElement = getPrimaryElement($scope.opponent.deck.cards);

  calculateAdjustedPower($scope.player.deck.cards, $scope.opponent.deck.primaryElement);
  calculateAdjustedPower($scope.opponent.deck.cards, $scope.player.deck.primaryElement);

  $scope.player.deck.adjustedPower   = calculateDeckAdjustedPower($scope.player.deck.cards);
  $scope.opponent.deck.adjustedPower = calculateDeckAdjustedPower($scope.opponent.deck.cards);
  $scope.player.deck.power           = calculateDeckPower($scope.player.deck.cards);
  $scope.opponent.deck.power         = calculateDeckPower($scope.opponent.deck.cards);
}

function getRandomElement($scope) {
  var index = parseInt(Math.random() * 4);
  return ELEMENTS[index];
}

function giveOpponentRandomDeck($scope, numCards) {
  $scope.opponent.deck.cards = [];

  for (var i = 0; i < numCards; i++) {
    $scope.opponent.deck.cards.push({
      power: parseInt(Math.random() * 1) + 1,
      element: getRandomElement()
    });
  }

  calculateDeckPowers($scope);
}
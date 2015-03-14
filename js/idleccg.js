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
    deck: createInitialPlayerDeck(),
    collection: createInitialPlayerCollection(),
  };

  $scope.opponent = {
    health: {
      max: 15,
      current: 15,
    },
    deck: {
    },
    number: 1
  };

  giveOpponentRandomDeck($scope, 3);
  calculatePowers($scope);

  $scope.gold = 0;

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

  $scope.currentLocation = {
    level: 1
  };

  $interval(function() { updateStatus($scope) }, 378);

  $scope.selectCardInCollection = function(card) {
    $scope.player.collection.cards.forEach(function(c) {
      c.selected = false;
      c.selectedClass = '';
    });
    card.selected = true;
    card.selectedClass = 'card-selected';
    $scope.cardSelectedInCollection = card;
    if ($scope.cardSelectedInDeck && $scope.cardSelectedInCollection) {
      $scope.swapCardBetweenDeckAndCollection($scope.cardSelectedInDeck, $scope.cardSelectedInCollection);      
    }
  };

  $scope.selectCardInDeck = function(card) {
    $scope.player.deck.cards.forEach(function(c) {
      c.selected = false;
      c.selectedClass = '';
    });
    card.selected = true;
    card.selectedClass = 'card-selected';
    $scope.cardSelectedInDeck = card;
    if ($scope.cardSelectedInDeck && $scope.cardSelectedInCollection) {
      $scope.swapCardBetweenDeckAndCollection($scope.cardSelectedInDeck, $scope.cardSelectedInCollection);      
    }
  };

  $scope.swapCardBetweenDeckAndCollection = function(cardInDeck, cardInCollection) {
    $scope.player.deck.removeCard(cardInDeck);
    $scope.player.collection.removeCard(cardInCollection);

    $scope.player.deck.addCard(cardInCollection);
    $scope.player.collection.addCard(cardInDeck);

    $scope.player.deck.cards.forEach(function(c) {
      c.selected = false;
      c.selectedClass = '';
    });
    $scope.player.collection.cards.forEach(function(c) {
      c.selected = false;
      c.selectedClass = '';
    });
    $scope.cardSelectedInDeck = null;
    $scope.cardSelectedInCollection = null;
    calculatePowers($scope)
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
  $scope.player.health.current = $scope.player.health.max;
  $scope.opponent.health.current = $scope.opponent.health.max;
  giveOpponentRandomDeck($scope, 3);
  calculatePowers($scope);
}

function calculatePowers($scope) {
  $scope.player.deck.getPrimaryElement();
  $scope.opponent.deck.getPrimaryElement();
  $scope.player.deck.calculateAdjustedPower($scope.opponent.deck.primaryElement);
  $scope.opponent.deck.calculateAdjustedPower($scope.player.deck.primaryElement);
}

function giveOpponentRandomDeck($scope, numCards) {
  $scope.opponent.deck = createOpponentDeck({
    deckSize: numCards,
    minPower: 0,
    maxPower: 2
  });
}
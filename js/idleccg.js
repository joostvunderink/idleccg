var cardGameApp = angular.module('cardGameApp',['ui.bootstrap', 'ngLodash']);

var debug = false;
var PAGE_SECTION_PLAYER_DECK = 'player-deck';
var PAGE_SECTION_PLAYER_COLLECTION = 'player-collection';

function logDebug(msg) {
  if (debug) {
    console.log(msg);
  }
}

var _;

cardGameApp.controller('gameCtrl', ['$scope', '$interval', 'lodash', function($scope, $interval, lodash) {
  _ = lodash;
  $scope.PAGE_SECTION_PLAYER_DECK = PAGE_SECTION_PLAYER_DECK;
  $scope.PAGE_SECTION_PLAYER_COLLECTION = PAGE_SECTION_PLAYER_COLLECTION;
  $scope.player = {
    health: {
      max: 10,
      current: 10,
    },
    deck: createInitialPlayerDeck(),
    collection: createInitialPlayerCollection(),
  };

  $scope.opponent = {
    health: {
      max: 8,
      current: 8,
    },
    deck: {
    },
    number: 1
  };

  giveOpponentRandomDeck($scope, 3);
  calculatePowers($scope);

  $scope.gold = 0;
  $scope.log = [];
  $scope.maxLogLines = 10;

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

  $scope.addLogLine = function(text) {
    var now = new Date();
    var nowTime = now.toISOString().slice(11,19);
    var logLine = {
      text: text,
      date: now,
      time: nowTime
    };
    $scope.log.unshift(logLine);
    if ($scope.log.length > $scope.maxLogLines) {
      $scope.log.pop();
    }
  };

  $scope.cardClicked = function(where, card) {
    // If clicked on card in deck:
    //   If collection has selected card:
    //     If collection selected card is upgrade, apply upgrade.
    //     If collection selected card is playable, swap cards.
    //   Else:
    //     card.setSelected(true)
    // 
    // If clicked on card in collection:
    //   If deck has selected card:
    //     If collection clicked card is upgrade, apply upgrade.
    //     If collection clicked card is playable, swap cards.
    //   ElseIf collection has selected card:
    //     If collection selected card is upgrade, apply upgrade.
    //   Else:
    //     card.setSelected(true)
    //   
    if (where === PAGE_SECTION_PLAYER_DECK) {
      if ($scope.cardSelectedInCollection) {
        if ($scope.cardSelectedInCollection.type === CARDTYPE_PLAY) {
          // Swap cards.
          $scope.swapCardBetweenDeckAndCollection(card, $scope.cardSelectedInCollection);
          $scope.player.deck.unselectCards();
          $scope.player.collection.unselectCards();
        }
        else {
          // Apply upgrade, then destroy upgrade.
          card.applyUpgrade($scope.cardSelectedInCollection);
          $scope.player.deck.calculateTotalPower();
          $scope.player.collection.removeCard($scope.cardSelectedInCollection);
          $scope.player.deck.unselectCards();
          $scope.player.collection.unselectCards();
        }
      }
      else {
        $scope.player.deck.unselectCards();
        card.setSelected(true);
        $scope.cardSelectedInDeck = card;
      }
    }
    if (where === PAGE_SECTION_PLAYER_COLLECTION) {
      if ($scope.cardSelectedInDeck) {
        if (card.type === CARDTYPE_PLAY) {
          console.info('swapping cards');
          // Swap cards.
          $scope.swapCardBetweenDeckAndCollection($scope.cardSelectedInDeck, card);
          $scope.player.deck.unselectCards();
          $scope.player.collection.unselectCards();
        }
      }
      else {
        $scope.player.collection.unselectCards();
        card.setSelected(true);
        $scope.cardSelectedInCollection = card;
      }
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
  var amount = 1;
  $scope.gold += amount;
  $scope.addLogLine("Won " + amount + " gold.");
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
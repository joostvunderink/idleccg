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

  $scope.boosterPrices = {
    1: 15,
    2: 50,
    3: 120,
    4: 390,
    5: 850
  };

  $scope.player = {
    health: {
      max: 10,
      current: 10,
    },
    deck: createInitialPlayerDeck(),
    collection: createInitialPlayerCollection(),
  };

  initOpponents($scope);

  $scope.level = 0;
  $scope.opponentNum = 0;


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

  $scope.buyBooster = function(level) {
    $scope.gold -= $scope.boosterPrices[level];
    var booster = ItemFactory({
      type: ITEM_BOOSTER,
      level: level,
    });
    $scope.player.collection.addCard(booster);
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
        if ($scope.cardSelectedInCollection.type === ITEM_CARD) {
          // Swap cards.
          $scope.swapCardBetweenDeckAndCollection(card, $scope.cardSelectedInCollection);
          $scope.player.deck.unselectCards();
          $scope.player.collection.unselectCards();
        }
        else {
          // Apply upgrade, then destroy upgrade.
          $scope.addLogLine("Upgraded " + card.power + " to " + (card.power + $scope.cardSelectedInCollection.power));
          card.applyUpgrade($scope.cardSelectedInCollection);
          $scope.player.deck.calculateTotalPower();
          $scope.player.collection.removeCard($scope.cardSelectedInCollection);
          $scope.player.deck.unselectCards();
          $scope.player.collection.unselectCards();
        }
      }
      else {
        // Card in deck was selected. Mark as selected.
        $scope.player.deck.unselectCards();
        card.setSelected(true);
        $scope.cardSelectedInDeck = card;
      }
    }
    if (where === PAGE_SECTION_PLAYER_COLLECTION) {
      if ($scope.cardSelectedInDeck) {
        if (card.type === ITEM_CARD) {
          console.info('swapping cards');
          // Swap cards.
          $scope.swapCardBetweenDeckAndCollection($scope.cardSelectedInDeck, card);
          $scope.player.deck.unselectCards();
          $scope.player.collection.unselectCards();
        }
      }
      else {
        if (card.type === ITEM_BOOSTER &&
            $scope.cardSelectedInCollection &&
            $scope.cardSelectedInCollection.id == card.id     
        ) {
          // Booster was selected and clicked again. Open it.
          $scope.addLogLine('Opened booster');
          var cards = card.getContents();
          cards.forEach(function(card) {
            if (card.type === ITEM_UPGRADE) {
              $scope.addLogLine('New upgrade: ' + card.text);
            }
            $scope.player.collection.addCard(card);
          });
          $scope.player.collection.removeCard($scope.cardSelectedInCollection);
          $scope.player.collection.unselectCards();
        }
        else {
          // Card in collection was selected. Mark as selected.
          $scope.player.collection.unselectCards();
          card.setSelected(true);
          $scope.cardSelectedInCollection = card;
        }
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

  $scope.setOpponent = function() {
    $scope.opponent = $scope.opponents[$scope.level][$scope.opponentNum];
  };

  $scope.nextOpponent = function() {
    $scope.opponentNum++;
    if ($scope.opponentNum > 3) {
      $scope.opponentNum = 3;
    }
    $scope.setOpponent();
    calculatePowers($scope);
    resetGame($scope);
  };

  $scope.previousOpponent = function() {
    $scope.opponentNum--;
    if ($scope.opponentNum < 0) {
      $scope.opponentNum = 0;
    }
    $scope.setOpponent();
    calculatePowers($scope);
    resetGame($scope);
  };

  $scope.setOpponent();
  calculatePowers($scope);
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
  var amount = $scope.opponent.goldGainedWhenPlayerWins;
  if (amount < 0) {
    amount = 1;
  }
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
  // giveOpponentRandomDeck($scope, 3);
  initOpponents($scope);
  $scope.setOpponent();
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

function initOpponents($scope) {
  $scope.opponents = {
    0: {}
  };

  for (var i = 0; i < 4; i++) {
    var opponent = {
      health: {
        max: 8 + i * 3,
        current: 8 + i * 3,
      },
      deck: createOpponentDeck({
        deckSize: 3,
        minPower: i,
        maxPower: i+2
      }),
      number: i+1,
      goldGainedWhenPlayerWins: i * 3 + 1
    };
    $scope.opponents[0][i] = opponent;
  }
}


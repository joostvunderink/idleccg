var cardGameApp = angular.module('cardGameApp',['ui.bootstrap', 'ngLodash']);

var debug = false;
var PAGE_SECTION_PLAYER_DECK = 'player-deck';
var PAGE_SECTION_PLAYER_COLLECTION = 'player-collection';
var OPPONENTS_PER_LEVEL = 10;

var AFTER_GAME_PAUZE_TIME_RUNNING = 3;
var AFTER_GAME_PAUZE_TIME_PAUSED = 1;

function logDebug(msg) {
  if (debug) {
    console.log(msg);
  }
}

var _;

cardGameApp.controller('gameCtrl', ['$scope', '$interval', 'lodash', function($scope, $interval, lodash) {
  _ = lodash;

  $interval(function() {
    if ($scope.timeRunning) {
      updateStatus($scope)
    }
  }, 300);

  $scope.toggleTimeRunning = function() {
    $scope.timeRunning = !$scope.timeRunning;
  };


  /**
   * Run a single time step. Dont do this when time is already running to prevent clicking for extra time events.
   */
  $scope.runTimeStepManual = function() {
    if (!$scope.timeRunning) {
      updateStatus($scope)
    }
  };

  $scope.addLogLine = function(text) {
    var now = new Date();
    var logDifTime = parseInt(((now - $scope.previousLogTime) + 999) / 1000);
    var nowTime = now.toISOString().slice(11,19);
    var logLine = {
      text: text,
      date: now,
      time: nowTime,
      logDifTime: logDifTime
    };
    $scope.log.unshift(logLine);
    if ($scope.log.length > $scope.maxLogLines) {
      $scope.log.pop();
    }
    $scope.previousLogTime = now;
  };

  $scope.buyBooster = function(level) {
    $scope.gold -= $scope.boosterPrices[level];
    var booster = ItemFactory({
      type: ITEM_BOOSTER,
      level: level,
    });
    $scope.player.collection.addCard(booster);
    $scope.addLogLine("Bought booster " + level + ".");
    if (level >= $scope.unlockedBoosterLevel) {
      $scope.unlockedBoosterLevel = level + 1;
    }
  };

  $scope.sellSelectedCard = function() {
    var price = $scope.cardSelectedInCollection.power + $scope.cardSelectedInCollection.damage;
    $scope.addLogLine("Sold card for " + price + " gold.");
    $scope.gold += price;
    $scope.player.collection.removeCard($scope.cardSelectedInCollection);
    $scope.cardSelectedInCollection = null;
    $scope.player.collection.unselectCards();
  }

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
          if ($scope.cardSelectedInCollection.type === ITEM_CARD_UPGRADE) {
            // Apply upgrade, then destroy upgrade.
            // Upgrades only work if the current value of the upgraded property is already > 0.
            
            if ($scope.cardSelectedInCollection.power > 0 && card.power === 0) {
              return;
            }
            if ($scope.cardSelectedInCollection.damage > 0 && card.damage === 0) {
              return;
            }
            if ($scope.cardSelectedInCollection.power > 0) {
              $scope.addLogLine("Power " + card.power + " -> " + (card.power + $scope.cardSelectedInCollection.power));
            }
            else {
              $scope.addLogLine("Damage " + card.damage + " -> " + (card.damage + $scope.cardSelectedInCollection.damage));
            }
            card.applyUpgrade($scope.cardSelectedInCollection);
            $scope.player.deck.calculateTotalPower();
            $scope.player.deck.calculateTotalDamage();
            $scope.player.collection.removeCard($scope.cardSelectedInCollection);
            $scope.player.deck.unselectCards();
            $scope.player.collection.unselectCards();
          }
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
        if ($scope.cardSelectedInCollection &&
            $scope.cardSelectedInCollection.id == card.id     
        ) {
          console.log(card);
          if (card.type === ITEM_BOOSTER) {
            // Booster was selected and clicked again. Open it.
            $scope.addLogLine('Opened booster.');
            var cards = card.getContents();
            cards.forEach(function(card) {
              if (card.type === ITEM_CARD_UPGRADE) {
                $scope.addLogLine('New card upgrade: ' + card.text + ".");
              }
              if (card.type === ITEM_PLAYER_UPGRADE) {
                $scope.addLogLine('New player upgrade: ' + card.text + ".");
              }
              if (card.type === ITEM_CARD) {
                $scope.addLogLine('New card: ' + card.text + ".");
              }
              $scope.player.collection.addCard(card);
            });
            $scope.player.collection.removeCard($scope.cardSelectedInCollection);
            $scope.player.collection.unselectCards();
          }
          if (card.type === ITEM_PLAYER_UPGRADE) {
            $scope.addLogLine('Health ' + $scope.player.health.max + ' -> ' + ($scope.player.health.max + card.health));
            $scope.player.health.max += card.health;
            $scope.player.collection.removeCard($scope.cardSelectedInCollection);
            $scope.player.collection.unselectCards();
          }
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

  $scope.swapCardBetweenDeckAndCollection = function(cardInDeck, cardInCollection) {
    $scope.player.deck.removeCard(cardInDeck);
    $scope.player.collection.removeCard(cardInCollection);

    $scope.player.deck.addCard(cardInCollection);
    $scope.player.collection.addCard(cardInDeck);

    cardInCollection.updateDisplayProperties();
    cardInDeck.updateDisplayProperties();

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
    calculatePowers($scope);
  };

  $scope.setOpponent = function() {
    $scope.opponent = $scope.opponents[$scope.level][$scope.opponentNum];
  };

  $scope.nextOpponent = function() {
    $scope.opponentNum++;
    if ($scope.opponentNum > OPPONENTS_PER_LEVEL - 1) {
      $scope.opponentNum = OPPONENTS_PER_LEVEL - 1;
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

  $scope.initApp = function() {
    // debug/dev options
    $scope.fastForwardNum = 50;


    $scope.gold = 5;

    $scope.PAGE_SECTION_PLAYER_DECK = PAGE_SECTION_PLAYER_DECK;
    $scope.PAGE_SECTION_PLAYER_COLLECTION = PAGE_SECTION_PLAYER_COLLECTION;
    $scope.ITEM_BOOSTER        = ITEM_BOOSTER;
    $scope.ITEM_CARD           = ITEM_CARD;
    $scope.ITEM_CARD_UPGRADE   = ITEM_CARD_UPGRADE;
    $scope.ITEM_PLAYER_UPGRADE = ITEM_PLAYER_UPGRADE;


    $scope.boosterPrices = {};
    for (var i = 1; i < 10; i++) {
      $scope.boosterPrices[i] = f.boosterCost(i);
    }
    $scope.boosterIndexes = [1, 2, 3, 4, 5, 6, 7, 8];

    $scope.player = {
      health: {
        max: 9,
        current: 9,
      },
      deck: createInitialPlayerDeck(),
      collection: createInitialPlayerCollection(),
    };

    $scope.level = 0;
    $scope.opponentNum = 0;

    $scope.log = [];
    $scope.maxLogLines = 10;

    $scope.timeRunning = true;
    $scope.afterGamePauze = 0;
    $scope.playerMessage = "";
    $scope.opponentMessage = "";
    $scope.previousLogTime = new Date();

    $scope.unlockedBoosterLevel = 1;

    $scope.gameData = {
      startTime         : new Date().getTime(),
      previousUpdateTime: new Date().getTime(),
      totalGames        : 0,
      totalWins         : 0,
      totalTurns        : 0,
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

    $scope.boosterShown = function(index) {
      return index <= $scope.unlockedBoosterLevel;
    };

    $scope.boosterDisabled = function(index) {
      return $scope.gold < $scope.boosterPrices[index];
    };

    $scope.doFastForward = function() {
      var currentTimeRunning = $scope.timeRunning;

      $scope.timeRunning = false;
      var numGamesAtStart = $scope.gameData.totalGames;
      var numWonAtStart   = $scope.gameData.totalWins;

      while ($scope.gameData.totalGames - numGamesAtStart < $scope.fastForwardNum) {
        processGameTurn($scope);
      }

      // Restore the old value of timeRunning.
      $scope.timeRunning = currentTimeRunning;
      var gamesWon = $scope.gameData.totalWins - numWonAtStart;
      var percentWon = parseInt(100 * gamesWon / $scope.fastForwardNum);
      $scope.addLogLine("Ffw " + $scope.fastForwardNum + " games.");
      $scope.addLogLine("Won " + gamesWon + " games (" + percentWon + "%).");
    };

    initOpponents($scope);
    $scope.setOpponent();
    randomiseOpponentDeck($scope, 3);
    calculatePowers($scope);
  };


  $scope.initApp();

}]);

function updateStatus($scope) {
  var currentTime = new Date().getTime();
  var timeDiff = (currentTime - $scope.gameData.previousUpdateTime) / 1000;
  // console.log(timeDiff);
  $scope.gameData.score += $scope.gameData.scorePerSecond * timeDiff;
  $scope.gameData.totalScore += $scope.gameData.scorePerSecond * timeDiff;
  $scope.gameData.timeSinceStart = (currentTime - $scope.gameData.startTime) / 1000;
  $scope.gameData.previousUpdateTime = currentTime;

  $scope.playerMessage = "";
  $scope.opponentMessage = "";

  if ($scope.afterGamePauze > 0) {
    $scope.afterGamePauze -= 1;
    if ( $scope.afterGamePauze <= 0 ) {
      resetGame($scope);
    }
  }
  else {
    processGameTurn($scope);
  }

}


function processGameTurn($scope) {
  var playerFactor = $scope.player.deck.adjustedPower / ($scope.player.deck.adjustedPower + $scope.opponent.deck.adjustedPower);
  var randomNumber = Math.random();

  $scope.gameData.totalTurns += 1;

  function determineDamage(max) {
    var damage = Math.floor(Math.random() * (max+1)) + 1;
    return damage;
  }

  if (randomNumber <= playerFactor) {
    // Player hits opponent
    var damage = determineDamage($scope.player.deck.totalDamage);
    $scope.opponent.health.current -= damage;
    $scope.opponentMessage = "Hit for " + damage;
    if ($scope.opponent.health.current <= 0) {
      $scope.opponentMessage += ", loses."
      playerWins($scope);
    }
  }
  else {
    // Opponent hits player
    var damage = determineDamage($scope.opponent.deck.totalDamage);
    $scope.player.health.current -= damage;
    $scope.playerMessage = "Hit for " + damage;
    if ($scope.player.health.current <= 0) {
      $scope.playerMessage += ", loses."
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
  $scope.gameData.totalGames += 1;
  $scope.gameData.totalWins += 1;
  $scope.addLogLine("Won " + amount + " gold.");
  setAfterGamePause($scope);
}

function opponentWins($scope) {
  $scope.gameData.totalGames += 1;
  setAfterGamePause($scope);
}

function setAfterGamePause($scope) {
  if ($scope.timeRunning) {
    $scope.afterGamePauze = AFTER_GAME_PAUZE_TIME_RUNNING;
  }
  else {
    $scope.afterGamePauze = AFTER_GAME_PAUZE_TIME_PAUSED;
  }
}

function resetGame($scope) {
  $scope.player.health.current = $scope.player.health.max;
  $scope.opponent.health.current = $scope.opponent.health.max;
  randomiseOpponentDeck($scope, 3);
  calculatePowers($scope);
}

function randomiseOpponentDeck($scope, size) {
  var len = $scope.opponent.deck.cards.length;
  for (var i = len - 1; i >= 0; i--) {
    var card = $scope.opponent.deck.cards[i];
    $scope.opponent.collection.addCard(card);
    $scope.opponent.deck.removeCard(card);
  };

  for (var i = 0; i < size; i++) {
    var card = $scope.opponent.collection.removeRandomCard();
    $scope.opponent.deck.addCard(card);
  }
}

function calculatePowers($scope) {
  $scope.player.deck.getPrimaryElement();
  $scope.opponent.deck.getPrimaryElement();
  $scope.player.deck.calculateAdjustedPower($scope.opponent.deck.primaryElement);
  $scope.player.collection.calculateAdjustedPower($scope.opponent.deck.primaryElement);
  $scope.opponent.deck.calculateAdjustedPower($scope.player.deck.primaryElement);
}

function initOpponents($scope) {
  $scope.opponents = {
    0: {}
  };

  for (var i = 0; i < OPPONENTS_PER_LEVEL; i++) {
    var health = 6 + parseInt(Math.pow(1.8, i+2));
    var opponent = {
      health: {
        max: health,
        current: health,
      },
      // deck: createOpponentDeck({
      //   deckSize: 3,
      //   powerAverage: 2*i,
      //   powerStdDev: i+1,
      //   damageAverage: i,
      //   damageStdDev: i/3+1,
      // }),
      deck: new Deck(),
      collection: createOpponentCollection({
        collectionSize: 8,
        powerAverage: 2 * Math.pow(1.8, i),
        powerStdDev: i+1,
        damageAverage: Math.sqrt(2 * Math.pow(1.8, i)),
        damageStdDev: i/3+1,
      }),
      number: i+1,
      goldGainedWhenPlayerWins: f.winGoldAmount(1, i)
    };
    $scope.opponents[0][i] = opponent;
  }
}


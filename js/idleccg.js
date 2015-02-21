var cardGameApp = angular.module('cardGameApp',['ui.bootstrap', 'ngLodash']);

var debug = false;

function logDebug(msg) {
  if (debug) {
    console.log(msg);
  }
}

var objectsToBuy = [
{
  name: 'small',
  initialCost: 25,
  currentCost: 25,
  increaseSpS: 1,
},
{
  name: 'medium',
  initialCost: 200,
  currentCost: 200,
  increaseSpS: 5,
},
{
  name: 'large',
  initialCost: 800,
  currentCost: 800,
  increaseSpS: 12,
}
];


function calculateSpS($scope) {
  var speed = 0; // base speed
  for (var i = 0; i < objectsToBuy.length; i++) {
    var o = objectsToBuy[i];
    var name = o.name;
    var num = $scope.gameData.boughtObjects[name];
    speed = speed + num * o.increaseSpS;
  }
  $scope.gameData.scorePerSecond = speed;
}

function buy($scope, name) {
  for (var i = 0; i < objectsToBuy.length; i++) {
    var o = objectsToBuy[i];
    if (o.name === name) {
      $scope.gameData.boughtObjects[name]++;
      $scope.gameData.score -= o.currentCost;
      o.currentCost = parseInt(o.currentCost * 1.2);
      calculateSpS($scope);
    }
  }
}

cardGameApp.controller('gameCtrl', ['$scope', '$interval', 'lodash', function($scope, $interval, lodash) {
  console.log(lodash);
  $scope.player = {
    health: {
      max: 12,
      current: 12,
    },
    deck: {
      cards: [
        {
          power: 5
        },
        {
          power: 8
        },
        {
          power: 1
        },
      ]
    },
    collection: {
      cards: [
        {
          power: 87
        },
        {
          power: 89
        },
        {
          power: 143
        },
      ]
    }
  };

  $scope.opponent = {
    health: {
      max: 8,
      current: 8,
    },
    deck: {
      cards: [
        {
          power: 4
        },
        {
          power: 2
        },
        {
          power: 7
        },
      ]
    }
  };

  $scope.gold = 0;
  $scope.player.deck.power   = $scope.player.deck.cards.reduce(function(a, b) { return { power: a.power + b.power }; } , {power: 0}).power;
  $scope.opponent.deck.power = $scope.opponent.deck.cards.reduce(function(a, b) { return { power: a.power + b.power }; } , {power: 0}).power;

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

  $scope.click = function() {
    $scope.gameData.score += $scope.gameData.scorePerClick;
  };
  $scope.buy = function(item) { return buy($scope, item) };

  $scope.objectsToBuy = objectsToBuy;
  calculateSpS($scope);
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
  var playerFactor = $scope.player.deck.power / ($scope.player.deck.power + $scope.opponent.deck.power);
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
}


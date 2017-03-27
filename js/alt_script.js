(function (){

  "use strict";

//GameState constructor
  function GameState(xMoves, oMoves) {
    this.xMoves = xMoves;
    this.oMoves = oMoves;
    this.numMoves = 0;
  }

  GameState.prototype.pushMoveToArr = function(move) {
    let player = this.playerTurn();
    move = move;
    this[player].push(move);
  };

  GameState.prototype.reset = function() {
    this.xMoves = [];
    this.oMoves = [];
    this.numMoves = 0;
  };

  GameState.prototype.checkWin = function(player) {
    let playerMoves = this[player];
    let winningArrays = [ [1,2,3], [4,5,6],
                      [7,8,9], [1,4,7],
                      [2,5,8], [3,6,9],
                      [1,5,9], [3,5,7] ];
    return winningArrays.some(function(winArray){
      return winArray.every(function(winMove){
        return playerMoves.includes(winMove);
      });
    });
  };

  GameState.prototype.playerTurn = function() {;
    if (this.numMoves % 2 === 0) {
      return 'xMoves';
    } else {
      return 'oMoves';
    }
  };

  // VARIABLES
  let mainGame = new GameState([], []);

  //HELPER FUNCTIONS
  function drawSymbol(item, turn) {
    let symbol = mainGame.playerTurn() === 'oMoves' ? 'O' : 'X';
    item.innerHTML = symbol;
  }

  function drawErrorTaken(item) {
    let symbol = m
  }

  //checks to see if number chosen
  function hasNumBeenPicked(pick) {
    return mainGame.xMoves.includes(pick) || mainGame.oMoves.includes(pick);
  }

  


  //EVENT HANDLERS
  //draws symbol in box
  //push chosen num to array
  function clickHandler(item) {
    var boxNum = Number(item.dataset.box);
    if (!hasNumBeenPicked(boxNum)) {
      let symbol = mainGame.playerTurn() === 'oMoves' ? 'O' : 'X';
      drawSymbol(item);
      mainGame.pushMoveToArr(boxNum);
      if(mainGame.checkWin(mainGame.playerTurn())){
        console.log('WINNER');
      }
      mainGame.numMoves++;
    }
  }


  // ***************
  //  EVENT LISTENERS
  // ***************

  var gameBoard = document.querySelector('.board-container');
  var gameTiles = gameBoard.querySelectorAll('.board-box');

  gameTiles.forEach(function(tile){
    tile.addEventListener('click', function(){
      clickHandler(this);
    });
  });

})();
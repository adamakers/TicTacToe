(function (){

  "use strict";

//=====================
//VARIABLES
//=====================

let mainGame;



//=====================
//OBJECT CONSTRUCTION
//=====================
//GameState constructor
  function GameState(xMoves, oMoves) {
    this.xMoves = xMoves;
    this.oMoves = oMoves;
    this.numMoves = 0;
  }

  GameState.prototype.pushMoveToArr = function(move) {
    let player = this.playerTurnArr();
    this[player].push(move);
  };

//no need for this reset if you can just reassign mainGame to new GameState([], [])game?
  GameState.prototype.resetGame = function() {
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

  GameState.prototype.playerTurnArr = function() {
    return this.numMoves % 2 === 0 ? 'xMoves' : 'oMoves';
  };

  GameState.prototype.playerTurnSymbol = function() {
    return this.numMoves % 2 === 0 ? 'X' : 'O';
  }


  //=====================
  //HELPER FUNCTIONS
  //=====================
  function drawSymbol(item, turn) {
    let symbol = mainGame.playerTurnSymbol();
    item.textContent = symbol;
  }

  //checks to see if number chosen
  function hasNumBeenPicked(pick) {
    return mainGame.xMoves.includes(pick) || mainGame.oMoves.includes(pick);
  }

  function resetGameButton() {
    clearTiles();
    mainGame.resetGame();
    closeModal();
  }

  //=====================
  //MODAL FUNCTIONS
  //=====================

  

  function showPlayerWin(winner) {
    const winModal = document.querySelector('.player-win-modal');
    const gameWinner = document.querySelector('.game-winner');
    const resetBtn = document.querySelector('.reset-btn');
    gameWinner.textContent = 'df'
    winModal.classList.add('show-modal');
  }

  function closeModal() {
    let modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal){
      modal.classList.remove('show-modal');
    });
  }

  function clearTiles() {
    let tiles = document.querySelectorAll('.board-box');
    tiles.forEach(function(tile){
      tile.innerHTML = '';
    });
  }

  


  //=====================
  //EVENT HANDLERS
  //=====================
  
  //********* THIS ACCEPTABLE? *********
  function init() {
    const startModal = document.querySelector('.player-num-modal');
    startModal.classList.add('show-modal');
    mainGame = new GameState([], []);
  }

  
  //draws symbol in box
  function clickTileHandler(item) {
    let boxNum = Number(item.dataset.box);
    if (!hasNumBeenPicked(boxNum)) {
      let player = mainGame.playerTurnArr()
      let symbol = mainGame.playerTurnSymbol();
      drawSymbol(item);
      mainGame.pushMoveToArr(boxNum);
      //if game winner
      if(mainGame.checkWin(player)){
        showPlayerWin(symbol);
      }
      mainGame.numMoves++;
    }
  }


  // ***************
  //  EVENT LISTENERS
  // ***************

  window.onload = init;

  const resetButton = document.querySelector('.reset-btn');
  const gameBoard = document.querySelector('.board-container');
  const gameTiles = gameBoard.querySelectorAll('.board-box');

  resetButton.addEventListener('click', resetGameButton);

  gameTiles.forEach(function(tile){
    tile.addEventListener('click', function(){
      clickTileHandler(this);
    });
  });

})();
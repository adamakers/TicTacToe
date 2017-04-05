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
    let player = this.playerTurnStr();
    this[player].push(move);
  };

  //NEEDS CHECK
  GameState.prototype.findAvailableTiles() {
    let x = this.xMoves;
    let o = this.oMoves;
    let combined = x.concat(o);
    return combined.map(function(move){
      return !combined.includes(move);
    });
  }

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
                          [1,5,9], [3,5,7]];
    return winningArrays.some(function(winArray){
      return winArray.every(function(winMove){
        return playerMoves.includes(winMove);
      });
    });
  };

  GameState.prototype.isGameOver = function() {
    if (checkWin(this.xMove) ||
        checkWin(this.oMove) ||
        this.numMoves >= 9 ) {
      return true;
    }
    return false;
  }

  GameState.prototype.scoreOfGame

  GameState.prototype.playerTurnStr = function() {
    return this.numMoves % 2 === 0 ? 'xMoves' : 'oMoves';
  };

  GameState.prototype.playerTurnSymbol = function() {
    return this.numMoves % 2 === 0 ? 'X' : 'O';
  };

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


  function showStartModal() {
    const startModal = document.querySelector('.player-num-modal');
    const playerNumBtn = document.querySelectorAll('.player-num-btn');
    startModal.classList.add('show-modal');
    playerNumBtn.forEach(function(btn){
      btn.addEventListener('click', playerModeHandler);
    });
  }

  function showPlayerWin(winner) {
    const winModal = document.querySelector('.player-win-modal');
    const gameWinner = document.querySelector('.game-winner');
    const resetBtn = document.querySelector('.reset-btn');
    gameWinner.textContent = mainGame.playerTurnSymbol();
    winModal.classList.add('show-modal');
    resetBtn.addEventListener('click', resetGameButton);
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
  //GAME MODE LOGIC
  //=====================
  function onePlayerGame(game) {
    //DO SOME AI STUFF
    if (/* AI Move */) {
      if ()
    }
  }

  function twoPlayerGame() {
    const gameBoard = document.querySelector('.board-container');
    const gameTiles = gameBoard.querySelectorAll('.board-box');
    gameTiles.forEach(function(tile){
      tile.addEventListener('click', function(){
        clickTileHandler(this);
        console.log()
      });
    });
  }

  function marvinTheAI(game) {
    if (game.checkWin()) {
      return 1;
    } else if (game.checkWin()) {
      return -1;
    }


  }

  //=====================
  //EVENT HANDLERS
  //=====================

  //********* THIS ACCEPTABLE? *********
  function init() {
    mainGame = new GameState([], []);
    showStartModal();
  }
  
  //draws symbol in box
  function clickTileHandler(item) {
    let boxNum = Number(item.dataset.box);
    if (!hasNumBeenPicked(boxNum)) {
      let player = mainGame.playerTurnStr()
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

  //On start modal, check if game is 1 player or 2;
  function playerModeHandler(e) {
    let target = e.target;
    let btnClasses = target.classList;
    let playerOne = 'one-player-btn';
    let playerTwo = 'two-player-btn';
    if (btnClasses.contains(playerOne)) {
      onePlayerGame();
    } else {
      twoPlayerGame();
    }
    //btn.removeEventListener('click', playerMideHandler);
    closeModal();
  }


  // ***************
  //  EVENT LISTENERS
  // ***************

  window.onload = init;

  
  



})();
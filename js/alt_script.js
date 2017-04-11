(function (){

  "use strict";

//=====================
//VARIABLES
//=====================

let mainGame;
const gameBoard = document.querySelector('.board-container');
const gameTiles = gameBoard.querySelectorAll('.board-box');

//=====================
//OBJECT CONSTRUCTION
//=====================
//GameState constructor
  function GameState(xMoves, oMoves) {
    this.xMoves = xMoves;
    this.oMoves = oMoves;
    this.numMoves = 0;
    this.playerSymbol;
    this.twoPlayer = false;
  }

  GameState.prototype.isMarvinsTurn = function() {
    return !(this.playerSymbol === this.playerTurnSymbol().toLowerCase());
  }

  GameState.prototype.pushMoveToArr = function(move) {
    let player = this.playerTurnStr();
    this[player].push(move);
  }

  GameState.prototype.findAvailableTiles = function() {
    const boardMoves = [1,2,3,4,5,6,7,8,9];
    let x = this.xMoves;
    let o = this.oMoves;
    let combined = x.concat(o);
    return boardMoves.filter(function(move){
      return !combined.includes(move);
    });
  }

//no need for this reset if you can just reassign mainGame to new GameState([], [])game?
  GameState.prototype.resetGame = function() {
    this.xMoves = [];
    this.oMoves = [];
    this.numMoves = 0;
  }

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
  }

  GameState.prototype.playerTurnStr = function() {
    return this.numMoves % 2 === 0 ? 'xMoves' : 'oMoves';
  }

  GameState.prototype.playerTurnSymbol = function() {
    return this.numMoves % 2 === 0 ? 'X' : 'O';
  }

    //checks to see if number chosen
  GameState.prototype.hasNumBeenPicked = function(pick) {
    return mainGame.xMoves.includes(pick) || mainGame.oMoves.includes(pick);
  }

  //=====================
  //HELPER FUNCTIONS
  //=====================
  function drawSymbol(item) {
    let symbol = mainGame.playerTurnSymbol();
    item.textContent = symbol;
  }

  function resetGameButton() {
    clearTiles();
    mainGame.resetGame();
    closeModal();
    if (!mainGame.twoPlayer) {
      onePlayerGame();
    }
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

  function showPickSymbolModal() {
    const pickModal = document.querySelector('.player-symbol-modal');
    const chooseX = document.querySelector('.chose-x');
    const chooseO = document.querySelector('.chose-o');
    pickModal.classList.add('show-modal');
    chooseX.addEventListener('click', function(){
      mainGame.playerSymbol = 'x';
      closeModal();
      onePlayerGame();
    });
    chooseO.addEventListener('click', function(){
      mainGame.playerSymbol = 'o';
      closeModal();
      onePlayerGame();
    }); 
  }

  function playerDrawModal() {
    const drawModal = document.querySelector('.player-draw-modal');
    const againBtn = document.querySelector('.other-reset-btn');
    drawModal.classList.add('show-modal');
    againBtn.addEventListener('click', function() {
      closeModal();
      mainGame.resetGame();
      clearTiles();
      onePlayerGame();
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
    if (mainGame.playerSymbol === 'o') testMarv();
    gameTiles.forEach(function(tile) {
      tile.addEventListener('click', function(){
        tileClickHandler(this);
      });
    });
  }

  function twoPlayerGame() {
    gameTiles.forEach(function(tile) {
      tile.addEventListener('click', function(){
        tileClickHandler(this);
      });
    });
  }
 
  function testMarv() {
    let newTiles = mainGame.findAvailableTiles();
    let randomIdx = Math.floor(Math.random() * (newTiles.length - 0)) + 0;
    let newTile = newTiles[randomIdx];
    let player = mainGame.playerTurnStr();
    let tileEl = document.querySelector('[data-box="' + newTile + '"]');
    drawSymbol(tileEl);
    mainGame.pushMoveToArr(newTile);
    if (mainGame.checkWin(player)){
      showPlayerWin(mainGame.playerTurnSymbol());
      return;
    }
    mainGame.numMoves++;
    if (mainGame.xMoves.length + mainGame.oMoves.length === 9) {
      playerDrawModal();
    }
  }

  //=====================
  //EVENT HANDLERS
  //=====================

  function init() {
    mainGame = new GameState([], []);
    showStartModal();
  }
  
  //draws symbol in box
  function tileClickHandler(item) {
    let boxNum = Number(item.dataset.box);
    if (mainGame.hasNumBeenPicked(boxNum)) {
      return;
    };

    let player = mainGame.playerTurnStr()
    let symbol = mainGame.playerTurnSymbol();
    drawSymbol(item);
    mainGame.pushMoveToArr(boxNum);
    if (mainGame.checkWin(player)){
      showPlayerWin(symbol);
      return;
    }
    mainGame.numMoves++;

    if (mainGame.xMoves.length + mainGame.oMoves.length === 9) {
      playerDrawModal();
      return;
    }
    if (!mainGame.twoPlayer) {
      testMarv();
    }
  }

  //On start modal, check if game is 1 player or 2;
  function playerModeHandler(e) {
    let target = e.target;
    let btnClasses = target.classList;
    let playerOne = 'one-player-btn';
    let playerTwo = 'two-player-btn';
    closeModal();
    if (btnClasses.contains(playerOne)) {
      showPickSymbolModal();
    } else {
      mainGame.twoPlayer = true;
      twoPlayerGame();
    }
  }


  // ***************
  //  EVENT LISTENERS
  // ***************

  window.onload = init;


})();
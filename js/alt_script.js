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

  GameState.prototype.pushMoveToArr = function(move) {
    let player = this.playerTurnStr();
    this[player].push(move);
  };

  //NEEDS CHECK
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
    if (this.checkWin('xMoves') ||
        this.checkWin('oMoves') ||
        this.numMoves >= 9 ) {
      return true;
    }
    return false;
  }

  GameState.prototype.scoreOfGame = function() {
    //need to figure out how to reference when ai turn or human turn.
  }

  GameState.prototype.playerTurnStr = function() {
    return this.numMoves % 2 === 0 ? 'xMoves' : 'oMoves';
  };

  GameState.prototype.playerTurnSymbol = function() {
    return this.numMoves % 2 === 0 ? 'X' : 'O';
  };

  //=====================
  //HELPER FUNCTIONS
  //=====================
  function drawSymbol(item) {
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

  function testMarv() {
    let newTiles = mainGame.findAvailableTiles();
    let newTile = newTiles[0];
    let player = mainGame.playerTurnStr();
    let tileEl = document.querySelector('[data-box="' + newTile + '"]');
    drawSymbol(tileEl);
    mainGame.pushMoveToArr(newTile);
    if (mainGame.checkWin(player)){
      showPlayerWin(mainGame.playerTurnSymbol());
    }
    mainGame.numMoves++;
  }

  //=====================
  //GAME MODE LOGIC
  //=====================
  function onePlayerGame(game) {
    if (mainGame.playerSymbol === 'o') {
      //run marvin
      //gameTiles.forEach(function(tile) {
      //addeventlistener for each tile, tileClickHandler
      testMarv();
    }
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

  // function marvinTheAI(game) {
  //   //game.isGameOver() need a parameter
  //   if (game.isGameOver()) {
  //     //return score()
  //     console.log('game is over, need to create score() function to determine score of game');
  //   }
  //   let scores = []; //array of scores.  marvinTheAI() will be pushed here.
  //   let moves = []; //push the move corresponding with the scores array.

  //   //get available moves
  //   let availableMoves = game.findAvailableTiles();
  //   availableMoves.forEach(function(move){
  //     let tempGame = new GameState(game.xMoves, oMoves);
  //     tempGame.pushMoveToArr(move);
  //     tempGame.numMoves++;
  //     scores.push(marvinTheAI(tempGame));
  //     moves.push(move);
  //   });

  //   //if it is the players turn
  //     //index_of_max_score = index of max score in scores array
  //     //the choice of the player should be moves[index_of_max_score]
  //     //return scores[index_of_max_score]
  //   //else if it is the other player
  //     //index_of_max_score = index of max score in scores array
  //     //the choice of the player should be moves[index_of_max_score]
  //     //return scores[index_of_max_score]
  // }

  //=====================
  //EVENT HANDLERS
  //=====================

  //********* THIS ACCEPTABLE? *********
  function init() {
    mainGame = new GameState([], []);
    showStartModal();
  }
  
  //draws symbol in box
  function tileClickHandler(item) {
    let boxNum = Number(item.dataset.box);
    if (!hasNumBeenPicked(boxNum)) {
      let player = mainGame.playerTurnStr()
      let symbol = mainGame.playerTurnSymbol();
      drawSymbol(item);
      mainGame.pushMoveToArr(boxNum);
      //if game winner
      if(mainGame.checkWin(player)){
        showPlayerWin(symbol);
        return;
      }
      mainGame.numMoves++;
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
    //btn.removeEventListener('click', playerMideHandler);
  }


  // ***************
  //  EVENT LISTENERS
  // ***************

  window.onload = init;


})();
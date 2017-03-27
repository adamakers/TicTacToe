
// TIC TAC TOE
// ADAM AKERS

//The current state of the game

//var choice;
var gameState = {
	choice: undefined,
	xMove: [],
	oMove: [],
	numPlayers: 0,
	numMoves: 0,
	playerSymbol: '',
	wins: [ ["0", "3", "6"], ["1", "4", "7"], 
				["2", "5", "8"], ["0", "1", "2"], 
				["3", "4", "5"], ["6", "7", "8"],
				["0", "4", "8"], ["2", "4", "6"] ],

	playerTurn: function(){
		//Even because X always goes first.
		return this.numMoves % 2 === 0 ? 'xMove' : 'oMove';
	},
	availableMoves: function() {
		var tilesTaken = this.xMove.concat(this.oMove);
		var boardSpots = ["0", "1", "2", "3", "4", 
												"5", "6", "7", "8" ];
		return boardSpots.filter(function(item){
			return !(tilesTaken.includes(item));
		});
	},
	getNewState: function(move){
		return Object.create(gameState);
		//newState[this.playerTurn()].push(move);
	},
	gameOver: function(){
		var gameNode = this;
		if (this.xMove.length + this.oMove.length === 9 || hasWon(this.playerTurn(), gameNode)) {
			return true;
		}
		return false;
	}

} // end gameState

//###### HELPER FUNCTIONS ######

function hideModal(modal) {
	modal.classList.remove('show-modal');
}

function showModal(modal) {
	modal.classList.add('show-modal');
}

// ###### EVENT HANDLERS ######

function numPlayersButtonClicked(e) {
	var numPlayersModal = document.querySelector('.num-players-modal');
	var playerNumClicked = e.target.dataset.players;
	gameState.numPlayers = playerNumClicked;
	hideModal(numPlayersModal);
	if(gameState.numPlayers === '1') {
		chooseSymbolModal();
	}
}

function numOfPlayersModal() {
	var numPlayersModal = document.querySelector('.num-players-modal');
	var playerButtons = document.querySelectorAll('.num-buttons');
	showModal(numPlayersModal);
	playerButtons.forEach(function(button) {
		button.addEventListener('click', numPlayersButtonClicked);
	});
}

function symbolButtonClicked(e) {
	var symbolModal = document.querySelector('.symbol-modal');
	gameState.playerSymbol = e.target.dataset.symbol;
	hideModal(symbolModal);
}

function chooseSymbolModal(){
	var symbolModal = document.querySelector('.symbol-modal');
	var symbolButtons = document.querySelectorAll('.symbol-button');
	showModal(symbolModal);
	symbolButtons.forEach(function(button){
		button.addEventListener('click', symbolButtonClicked); 
	});
}

function showWinModal() {
	var winModal = document.querySelector('.win-modal');
	var declareWinner = document.querySelector('.declare-winner');
	var restartButton = document.querySelector('.restart-button');
	var newGameButton = document.querySelector('.new-game-button');
	var playerWin = (gameState.playerTurn() === "xMove" ? "X" : "O");
	showModal(winModal);
	declareWinner.innerHTML = playerWin;
	restartButton.addEventListener('click', function(){
		resetGame();
		hideModal(winModal);
	});
	newGameButton.addEventListener('click', function(){
		resetGame();
		hideModal(winModal);
		numOfPlayersModal();
	});
}

function resetGame() {
	var boardItems = Array.from(document.querySelectorAll('.board-box'));
	boardItems.forEach(function(item){
		item.innerHTML = '';
	});
	gameState.xMove = [];
	gameState.oMove = [];
	gameState.numMoves = 0;
}


// ######### Score checking

////////////CHECK FOR INSTANCES
function checkWin(node) {
	if (hasWon(node.playerTurn(), node)) {
		showWinModal();
	} else if (node.xMove.length + node.oMove.length === 9){//hasTied() was here
		console.log('its a tie!!!');
		resetGame();
		return;
	}
	gameState.numMoves++;
}

//used in checkWin and getScore
function hasWon(player, node) {
	// checks the gameState.wins array in gameState to see if
	// just one of its nested arrays has every move that
	// gameState.xMove or oMove has.
	return node.wins.some(function(winArr){
		return winArr.every(function(winItem){
			return node[player].includes(winItem);
		});
	});
}

function hasTied() {
	var tiles = Array.from(document.querySelectorAll('.board-box'));
	return tiles.every(tile => tile.firstChild !== null);
}

function addMark(e) {
	var chosenEl = document.getElementById(e.target.id);
	var boxNum = e.target.dataset.box;
	var player = gameState.playerTurn();
	chosenEl.textContent = (player === 'xMove') ? 'X' : 'O';
	gameState[player].push(boxNum);
}

function twoPlayer(e){
	if (gameState.playerTurn() === 'oMove') {
		//var newState = Object.create(gameState);
		miniMax(gameState);
	} else {
		addMark(e);
	}
}

//if 1 player use AI, else if 2 player play normal game
function gameModeCheck(e) {
	var numberOfPlayers = gameState.numPlayers;
	if (numberOfPlayers == 2) {
		addMark(e);
		console.log(gameState.gameOver());
		//checkWin(gameState);
		gameState.numMoves++; //TEMPORARY
	} else if (numberOfPlayers == 1) {
		twoPlayer(e);
		gameState.numMoves++;
	}
}

//MINIMAX AI

//game will become new object that houses
//player turn,
function score(node) {
	var player = node.playerTurn();
	var opponent = node.playerTurn() === 'xMove' ? 'oMove' : 'xMove';
	//console.log(player);
	if (hasWon(player, node)) {
		return 10;
	} else if (hasWon(opponent, node)) {
		return -10;
	} else if (hasTied()) {
		return 0;
	}
}

function miniMax(gmNode) {
	var player = gmNode.playerTurn();
	var opponent = player === 'xMove' ? 'oMove' : 'xMove';

	if (gmNode.gameOver()) {
		return score(gmNode);
	}

	var availMoves = gmNode.availableMoves();
	var nodeScores = [];
	var moves = [];

	availMoves.forEach(function(move){
		var possibleGame = gmNode.getNewState(move);
		var playerTurn = possibleGame.playerTurn();
		possibleGame.newMove = [move];
		possibleGame[playerTurn] = possibleGame[playerTurn].concat(possibleGame.newMove);
		delete possibleGame.newMove;
		nodeScores.push(possibleGame);  // ######## INSERT MINIMAX HERE, TAKE OUT POSSIBLEGAME
		//console.log(nodeScores);
	});
	console.log(nodeScores);

	//do the min or the max calculation
	if (player === gameState.playerTurn()) {
		var max_score_index = nodeScores.findIndex(Math.max);
	  gameState.choice = moves[max_score_index];
		//console.log(choice);
		return nodeScores[max_score_index];
	} else {
		var min_score_index = nodeScores.findIndex(Math.min);
		gameState.choice = moves[min_score_index];
		//console.log(choice);
		return nodeScores[min_score_index];
	}
}

// ################## FOR 1/17 ######################
// FIGURE OUT WTF TO DO WITH CHOICE
// TRY TO IMPLEMENT RECURSIVE MINIMAX

//###### EVENT LISTENERS ######

var restartButton = document.querySelector('.win-modal');
var tiles = document.querySelectorAll('.board-box');

window.onload = numOfPlayersModal();
//console.log(gameState.numPlayers);

tiles.forEach(function(tile) {
	tile.addEventListener('click', function(e){
		var clickedEl = document.getElementById(e.target.id);
		//if tile is empty
		if (clickedEl.firstChild === null) {
			gameModeCheck(e);
		}

	//console.log(e);
		
	});
});





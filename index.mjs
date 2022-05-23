const baseSettings = {
	startingCells: 6,
	ranks: [1, 2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K"],
};
export const stdSettings = {
	quick: Object.assign({
		decks: 1,
		startingZaps: 2,
	}, baseSettings),
	marathon: Object.assign({
		decks: 2,
		startingZaps: 3,
	}, baseSettings),
};

export var state, moveLog;
var ranks;
export function start(settings) {
	ranks = settings.ranks;
	var drawPile = [], cardsPerDeck = ranks.length * 4;
	for (var i = 0; i < cardsPerDeck * settings.decks; ++i) {
		drawPile[i] = i % cardsPerDeck;
	}
	state = {
		drawPile,
		noOfCells: settings.startingCells,
		cellCards: [],
		zaps: settings.startingZaps
	}
	moveLog = undefined;
}
export function draw() {
	moveLog = {};
	var drew = moveLog.drew = drawFromDrawPile();
	var match = moveLog.match = state.cellCards.some( function(checking) {
		return drew.rank == checking.rank;
	} );
	if (match) {
		activate(drew);
	} else {
		state.cellCards.push(drew);
	}
	checkGameStatus();
}
export function zap(target) {
	moveLog = { zapped: target };
	--state.zaps;
	state.cellCards.splice( state.cellCards.indexOf(target), 1 );
	activate(target);
	checkGameStatus();
}
const powers = {
	J: jackPower,
	Q: queenPower,
	K: kingPower,
};
export function hasPower(card) {
	return card.rank in powers;
}
function activate(target) {
	var i = 0;
	moveLog.discards = [];
	while (i < state.cellCards.length) {
		if (state.cellCards[i].rank == target.rank) {
			moveLog.discards.push( state.cellCards.splice(i, 1)[0] );
		} else {
			++i;
		}
	}
	if (target.rank in powers) {
		powers[target.rank]();
	}
}
function jackPower() {
	var lowCard = null;
	state.cellCards.forEach( function(card) {
		if ( typeof card.rank == "number" && (lowCard == null || card.rank < lowCard.rank) ) {
			lowCard = card;
		}
	} );
	if (lowCard) {
		var draws = [];
		while (draws.length < lowCard.rank && state.drawPile.length > 0) {
			var got = drawFromDrawPile();
			state.cellCards.push(got);
			draws.push(got);
		}
		moveLog.jackPower = {
			success: true,
			usedValueOf: lowCard,
			draws: draws
		};
	} else {
		moveLog.jackPower = { success: false };
	}
}
function queenPower() {
	var highCard = null;
	state.cellCards.forEach( function(card) {
		if ( typeof card.rank == "number" && (highCard == null || card.rank > highCard.rank) ) {
			highCard = card;
		}
	} );
	if (highCard) {
		moveLog.queenPower = {
			success: true,
			usedValueOf: highCard,
			changedFrom: state.noOfCells
		};
		state.noOfCells = highCard.rank;
	} else {
		moveLog.queenPower = { success: false };
	}
}
function kingPower() {
	moveLog.kingPower = true;
	++state.zaps;
}
function checkGameStatus() {
	if (state.cellCards.length > state.noOfCells) {
		moveLog.lost = state.cellCards.slice(state.noOfCells);
	} else if (state.drawPile.length == 0) {
		moveLog.won = true;
	}
}
function drawFromDrawPile() {
	var {drawPile} = state;
	var cardPos = Math.floor(Math.random() * drawPile.length);
	var card = makeCard(drawPile[cardPos]);
	drawPile[cardPos] = drawPile[drawPile.length - 1];
	drawPile.pop();
	return card;
}
function makeCard(i) {
	var rank = ranks[i % ranks.length];
	var suit = Math.floor(i / ranks.length);
	return { suit, rank };
}
export function analyze() {
	var drawPileCounts = {}, cellCounts = {};
	var numbers = [];
	ranks.forEach( (rank) => {
		drawPileCounts[rank] = 0;
		cellCounts[rank] = 0;
	} );
	state.drawPile.forEach( (cardId) => {
		++drawPileCounts[makeCard(cardId).rank];
	} );
	state.cellCards.forEach( ({rank}) => {
		++cellCounts[rank];
		if (typeof rank == "number") {
			numbers.push(rank);
		}
	} );
	var results = { drawPileCounts, cellCounts };
	if (cellCounts["J"] && numbers.length) {
		// Consider the draw pile after a Jack has been drawn from it
		let draws = Math.min.apply(null, numbers);
		let drawsOnDraw = Math.min(draws, state.drawPile.length - 1);
		let loseOnDraw = (state.cellCards.length - cellCounts["J"] + drawsOnDraw > state.noOfCells);
		results.jackPower = {draws, loseOnDraw};
	}
	if (cellCounts["Q"] && numbers.length) {
		let cells = Math.max.apply(null, numbers);
		let lose = (state.cellCards.length - cellCounts["Q"] > cells);
		results.queenPower = {cells, lose};
	}
	return results;
}
export function suspendGame() {
	var data = state;
	data.cellCards = state.cellCards.map( function(card) {
		return card.suit * ranks.length + ranks.indexOf(card.rank);
	} );
	state = undefined;
	moveLog = undefined;
	return data;
}
export function resumeGame(data, settings) {
	ranks = settings.ranks;
	data.cellCards = data.cellCards.map( makeCard );
	state = data;
	moveLog = undefined;
}
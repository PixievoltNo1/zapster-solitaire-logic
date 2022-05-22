export default function play(zapster) {
	let {state} = zapster;
	do {
		if (state.zaps && state.cellCards.length == state.noOfCells) {
			zapster.zap(state.cellCards[0]);
		} else {
			zapster.draw();
		}
	} while ( !zapster.moveLog.won && !zapster.moveLog.lost )
}
export default function play(zapster) {
	let {state} = zapster;
	do {
		if (state.zaps && state.cellCards.length == state.noOfCells) {
			let analysis = zapster.analyze();
			if (analysis.queenPower && analysis.queenPower.cells > state.noOfCells) {
				zapster.zap( state.cellCards.find( ({rank}) => (rank == "Q") ) );
				continue;
			}
			{
				let mostNumerousRank, highestCount = 0;
				for ( let [rank, count] of Object.entries(analysis.cellCounts) ) {
					if (count > highestCount) {
						mostNumerousRank = rank;
						highestCount = count;
					}
				}
				if (highestCount > 2) {
					zapster.zap( state.cellCards.find( ({rank}) => (rank == mostNumerousRank) ) );
					continue;
				}
			}
			if (analysis.cellCounts.K) {
				zapster.zap( state.cellCards.find( ({rank}) => (rank == "K") ) );
				continue;
			}
			{
				let anyNumberCard = state.cellCards.find( ({rank}) => (typeof rank == "number") );
				if (anyNumberCard) {
					zapster.zap(anyNumberCard);
					continue;
				}
			}
		}
		zapster.draw();
	} while ( !zapster.moveLog.won && !zapster.moveLog.lost )
}
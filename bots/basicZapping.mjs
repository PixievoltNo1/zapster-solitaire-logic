import * as zapster from "../index.mjs";
import { state, moveLog } from "../index.mjs";
export default function play() {
	do {
		if (state.zaps && state.cellCards.length == state.noOfCells) {
			zapster.zap(state.cellCards[0]);
		} else {
			zapster.draw();
		}
	} while ( !moveLog.won && !moveLog.lost )
}
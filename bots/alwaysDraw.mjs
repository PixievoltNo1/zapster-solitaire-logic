import * as zapster from "../index.mjs";
import { moveLog } from "../index.mjs";
export default function play() {
	do {
		zapster.draw();
	} while ( !moveLog.won && !moveLog.lost )
}
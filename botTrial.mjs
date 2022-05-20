import * as zapster from "./index.mjs";
function botGame(bot, settings) {
	zapster.start(settings);
	bot();
	if (zapster.moveLog.won) { return "Won"; }
	if (zapster.moveLog.lost) {
		if (zapster.moveLog.jackPower) { return "Lost by J"; }
		if (zapster.moveLog.queenPower) { return "Lost by Q"; }
		return "Lost by draw";
	}
	console.log("Bot didn't finish game:", zapster.state);
}

import { argv } from "process";
let bot = ( await import( new URL(argv[2], import.meta.url) ) ).default;
import columnify from "columnify";
const gamesPerMode = 1000;
let data = [];
for ( let [modeName, modeRules] of Object.entries(zapster.stdSettings) ) {
	let results = {
		Mode: modeName,
		"Won": 0,
		"Lost by draw": 0,
		"Lost by J": 0,
		"Lost by Q": 0,
	};
	for (let i = 0; i < gamesPerMode; ++i) {
		let result = botGame(bot, modeRules);
		++results[result];
	}
	data.push(results);
}
console.log( columnify(data, { columnSplitter: " | ", headingTransform: (x) => x }) );
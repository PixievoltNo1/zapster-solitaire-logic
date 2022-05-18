import * as zapster from "./index.mjs";
function botGame(bot, settings) {
	zapster.start(settings);
	bot();
	if (zapster.moveLog.won) { return "Won"; }
	if (zapster.moveLog.lost) {
		if (zapster.moveLog.jackPower) { return "Lost from J power"; }
		if (zapster.moveLog.queenPower) { return "Lost from Q power"; }
		return "Lost by draw";
	}
	console.log("Bot didn't finish game:", zapster.state);
}

import { argv } from "process";
let bot = ( await import( new URL(argv[2], import.meta.url) ) ).default;
const gamesPerMode = 1000;
for ( let [modeName, modeRules] of Object.entries(zapster.stdSettings) ) {
	let results = {
		"Won": 0,
		"Lost by draw": 0,
		"Lost from J power": 0,
		"Lost from Q power": 0,
	};
	for (let i = 0; i < gamesPerMode; ++i) {
		let result = botGame(bot, modeRules);
		++results[result];
	}
	console.log(`Results for ${modeName} mode:`, results);
}
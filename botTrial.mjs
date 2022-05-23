function botGame(bot, settings) {
	zapster.start(settings);
	bot(zapster);
	if (zapster.moveLog.won) { return "Won"; }
	if (zapster.moveLog.lost) {
		if (zapster.moveLog.jackPower) { return "Lost by J"; }
		if (zapster.moveLog.queenPower) { return "Lost by Q"; }
		return "Lost by draw";
	}
	throw new Error("Returned without finishing game");
}

import columnify from "columnify";
import arg from "arg";
let args = arg({
	"--rules": String,
	"-r": "--rules",
	"--strict": Boolean,
	"-s": "--strict",
	"--trials": Number,
	"-t": "--trials",
});
let bot = ( await import( new URL(args._[0], import.meta.url) ) ).default;
let zapster = ( await import( new URL(args["--rules"] ?? "index.mjs", import.meta.url) ) );
if (args["--strict"]) {
	zapster = ( await import("./strictEnforcement.mjs") ).default(zapster);
}
const gamesPerMode = args["--trials"] ?? 1000;
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
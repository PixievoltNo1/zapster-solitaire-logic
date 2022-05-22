export default function play(zapster) {
	do {
		zapster.draw();
	} while ( !zapster.moveLog.won && !zapster.moveLog.lost )
}
export default function strictEnforcement(zapster) {
	return Object.defineProperties(Object.create(zapster), {
		draw: {
			value: function draw() {
				if (zapster.moveLog?.won || zapster.moveLog?.lost) {
					throw new Error("Made a move after the game ended");
				}
				return zapster.draw();
			}
		},
		zap: {
			value: function zap(card) {
				if (zapster.moveLog?.won || zapster.moveLog?.lost) {
					throw new Error("Made a move after the game ended");
				}
				if (zapster.state.zaps < 1) {
					throw new Error("Zapped without any zaps remaining");
				}
				if (!zapster.state.cellCards.includes(card)) {
					throw new Error("Zapped a card not in the cells");
				}
				return zapster.zap(card);
			}
		},
	});
}
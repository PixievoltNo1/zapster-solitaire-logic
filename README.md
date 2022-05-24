This module provides the game logic of Zapster Solitaire, my original [solitaire/patience](https://en.wikipedia.org/wiki/Patience_(game)) game, and it's the exact same module used by the Web version. I made it available in the hopes of seeing fellow coders develop bot players or interesting variations with it.

[Learn how to play Zapster Solitaire](https://pixievoltno1.com/web/Zapster/help.html) or [play the Web version](https://pixievoltno1.com/web/Zapster/).

This module provides *only* the logic, not a UI, and is made *only* for interaction by other JavaScript code. If you only want to play Zapster Solitaire without doing any coding, use the Web version above (not open source).

This project has a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in the Git repo or issues tracker, you agree to be as courteous, welcoming, and generally a lovely person as its terms require. 😊

<!-- toc -->

- [Rules implementation: `zapster.mjs`](#rules-implementation-zapstermjs)
  * [Card objects](#card-objects)
  * [Exported variable: `state`](#exported-variable-state)
  * [Exported function: `start`](#exported-function-start)
  * [Exported constant: `stdSettings`](#exported-constant-stdsettings)
  * [Exported function: `draw`](#exported-function-draw)
  * [Exported function: `zap`](#exported-function-zap)
  * [Exported variable: `moveLog`](#exported-variable-movelog)
  * [Exported function: `analyze`](#exported-function-analyze)
  * [Exported function: `hasPower`](#exported-function-haspower)
  * [Exported function: `suspendGame`](#exported-function-suspendgame)
  * [Exported function: `resumeGame`](#exported-function-resumegame)

<!-- tocstop -->

# Rules implementation: `zapster.mjs`

## Card objects

Each object represents one card, and a given card's object will be reused as it reappears throughout the `state` and `moveLog` objects. It has these properties:

* `rank`: Can be any of the values passed to [`start`](#exported-function-start) as `settings.ranks`.
* `suit`: An integer in the range 0-3. It doesn't matter which suit you map to which integer, but the mapping the web game uses is 0 = hearts, 1 = spades, 2 = diamonds, and 3 = clubs.

## Exported variable: `state`

<i>Object</i>

The state of the game in progress. It starts as `null` and is replaced with a new object whenever `start` and `resumeGame` are called. It is mutated as the current game progresses. Its properties are:

* `drawPile`: An array representing the draw pile. The contents of this array should be considered private, but you can use `state.drawPile.length` to see how many cards remain.
* `noOfCells`: The number of cells the player currently has.
* `cellCards`: An array of [cards](#card-objects) currently placed in the cells. It only has elements for cells that have a card.
* `zaps`: The number of zaps the player has left to use.

## Exported function: `start`

<i>Parameter: `settings` (object)</i><br>
<i>No return value</i>

Starts a new game. `settings` requires the following properties:

* `decks`: The number of copies of a deck that will be shuffled into the draw pile.
* `startingZaps`: The number of available zaps at the start of the game.
* `startingCells`: The number of cells at the start of the game.
* `ranks`: An array of the card ranks that will be included in each deck copy. Any positive integer or string can be used as a rank, but only `"J"`, `"Q"`, and `"K"` will have the powers of Jacks, Queens, and Kings respectively, and only ranks that are numbers will be used by Jack and Queen powers. To use the "Aces have the number 1" rule, `1` must be used instead of `"A"`.

## Exported constant: `stdSettings`

<i>Object</i>

Has the properties `quick` and `marathon`. Each has an object usable as the `settings` parameter to the above `start` function, reflecting the settings used for the standard Quick and Marathon modes.

## Exported function: `draw`

<i>No parameters</i><br>
<i>No return value</i>

Performs a draw move in the current game, and updates [`moveLog`](#exported-variable-movelog) with the results.

## Exported function: `zap`

<i>Parameter: `target` ([card](#card-objects))</i><br>
<i>No return value</i>

Uses a zap on `target` (which must be an object held in `state.cellCards`), and updates [`moveLog`](#exported-variable-movelog) with the results. Avoid calling this if no zaps remain.

## Exported variable: `moveLog`

<i>Object</i>

The results of the most recent move. Replaced with a new object for each move. Has the following properties:

* (optional) `drew`: The [card](#card-objects) drawn at the start of a draw move.
* (optional) `zapped`: The chosen [card](#card-objects) for a zap move.
* (optional) `discards`: An array of [cards](#card-objects) sent from the cells to the trash. Doesn't contain `moveLog.drew` or `moveLog.zapped`. For draw moves, the absence of this property means the drawn card matched nothing and was placed in a cell. For zap moves, this property always exists but may be an empty array.
* (optional) `jackPower`: An object representing the results of a Jack's power. Contains these properties:
	* `success`: A boolean indicating whether there was a numbered card for this power to use.
	* (optional) `usedValueOf`: The [card](#card-objects) whose number was used for this power.
	* (optional) `draws`: An array of [cards](#card-objects) drawn via this power.
* (optional) `queenPower`: An object representing the results of a Queen's power. Contains these properties:
	* `success`: As for `jackPower`.
	* (optional) `usedValueOf`: As for `jackPower`.
	* (optional) `changedFrom`: The previous number of cells the player had.
* (optional) `kingPower`: `true` if a King's power granted a zap.
* (optional) `won`: `true` if the game ended with the player's victory!
* (optional) `lost`: An array of [cards](#card-objects) that couldn't be placed in cells, resulting in the player losing the game.

Avoid calling `draw` or `zap` after a `won` or `lost` property has appeared.

## Exported function: `analyze`

<i>No parameters</i><br>
<i>Returns an object</i>

Determines various pieces of data about the game in progress that players would find interesting. In the web game, this function provides the data for the "Cards to Draw" feature. The returned object has these properties:

* `drawPileCounts`: An object with a property for each rank in the game settings, where each value is the number of cards of that rank remaining in the draw pile. (Someone playing this game in real life could figure this out by adding together the cards in the trash pile and cells, and subtracting them all from the cards they know they started with.)
* `cellCounts`: Like `drawPileCounts`, but instead counting cards in the cells.
* (optional) `jackPower`: Present if there's a Jack and a numbered card in the cells. It's an object detailing what happens if the Jack's power were activated now, with the following properties:
	* `draws`: The number of cards to be drawn, before applying the rule "If there are not enough cards remaining in the draw pile, draw all of them".
	* `loseOnDraw`: A boolean indicating whether you would lose if your next move were a draw, and the drawn card were a Jack. Calculated *after* applying the rule mentioned above, with the draw pile not having the drawn Jack.
* (optional) `queenPower`: Like `jackPower`, but for Queens. The object has these properties:
	* `cells`: The number of cells you would have.
	* `lose`: A boolean indicating whether this power would make you lose the game.

## Exported function: `hasPower`

<i>Parameter: `card` ([card]#card-objects())</i><br>
<i>Returns a boolean</i>

Check whether `card` has a power.

## Exported function: `suspendGame`

<i>No parameters</i><br>
<i>Returns an object</i>

Mutates `state` into a form more suitable for serializing to JSON, returns it, and sets `state` to `null`. Pass the returned object to `resumeGame` below to continue the game.

## Exported function: `resumeGame`

<i>Parameters: `data` (object returned by `suspendGame` above), `settings`</i><br>
<i>No return value</i>

Mutates `data` to reverse the changes of `suspendGame` and sets it to `state`, allowing the game to proceed. `settings` must be the same object used in the `start` call that started the game.
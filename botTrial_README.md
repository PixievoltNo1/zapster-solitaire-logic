botTrial.mjs is a CLI app that will put a bot through thousands of games of Zapster Solitaire and tally the results. Measure your bot's skills and try to develop the winningest bot!

Losses are separated by cause (draw, Jack power, or Queen power). Each mode specified in zapster.mjs's `stdSettings` is used. By default, your bot will play 1,000 games per mode.

<!-- toc -->

- [Bot Format](#bot-format)
- [Setup](#setup)
- [Invocation](#invocation)
  * [Strict Option](#strict-option)
  * [Rules Option](#rules-option)
  * [Trials Option](#trials-option)

<!-- tocstop -->

# Bot Format

A bot player for this app consists of a JavaScript module with a function for its default export. It's called with one argument, an object with the interface of a zapster.mjs exports object (as you'd get from `import * as myObject from "./zapster.mjs";` or `await import("./zapster.mjs")`). It must not call `start`, `suspendGame`, or `resumeGame`; `start` will be called before the bot's function is called. It must play the game to completion before it returns (you can check by looking for `moveLog.won` and `moveLog.lost`).

Tip: Since `state` is mutated but never replaced over the course of the game, you can do `let {state} = myArgument;` for easier access to it.

# Setup

You will need [Node.js](https://nodejs.org/) version 16 or later installed. Run the command `npm install` in the package's folder. npm will download botTrial.mjs's dependencies and put them in a folder named node_modules.

# Invocation

Run botTrial.mjs with a command like this in the package's folder:

```
node botTrial.mjs <botPath> [options]
```

Replace `<botPath>` with the file path to your bot's module, and `[options]` with any options you need. Options and `<botPath>` may be specified in any order.

For example:

```
node botTrial.mjs bots/zapWhenNeeded.mjs --rules=zapster_proposal.mjs
```

If you wish to use any options of Node.js itself, they go in between `node` and `botTrial.mjs`. I find [`--inspect` and `--inspect-brk`](https://nodejs.org/dist/latest-v16.x/docs/api/debugger.html#v8-inspector-integration-for-nodejs) especially useful for debugging JavaScript running in Node.

## Strict Option

<i>`--strict` or `-s`</i>

Enable [stricter rules enforcement](README.md#stricter-rules-enforcement-strictenforcementmjs) for the bot's games. Recommended for a bot in development, to ensure no rule-breaking bugs sneak in. Note that regardless of this setting, an error will always be thrown if your bot doesn't finish its game before returning.

## Rules Option

<i>`--rules=<rulesPath>`, `--rules <rulesPath>` or `-r <rulesPath>`</i>

The file path to the module that will implement Zapster Solitaire. Defaults to zapster.mjs from the same folder as botTrial.mjs.

## Trials Option

<i>`--trials=<number>`, `--trials <number>` or `-t <number>`</i>

The number of games per mode to play. Defaults to 1000.
#! /usr/bin/env node

const test = require('../action/test');
const watch = require('../action/watch');

const command = process.argv[2];

const commands = {
    test: test,
    watch: watch
};

const fn = commands[command];

if (fn) {
    fn();
} else {
    console.error('Unknown command: ' + command);
}

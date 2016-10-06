const Promise = require('promise');
const builderMaker = require('core/npm-scripts/build.js');
const chalk = require('chalk');
const fileWriter = require('core/npm-scripts/util/fileWriter');
const promiseUtils = require('core/npm-scripts/util/promise-utils');
const linterMaker = require('core/npm-scripts/util/lint-runner');
const testerMaker = require('core/npm-scripts/util/test-runner');

module.exports = function build() {
    var builder = builderMaker({testFiles: ['node_modules/core/src/**/*spec.js', 'src/**/*spec.js']});
    var linter = linterMaker();
    var tester = testerMaker();

    Promise.all([
        promiseUtils.runSerially([
            () => fileWriter.streamToFileTimed('build/tests.js', builder.buildTestCode()),
            () => tester.test(['build/tests.js']),
            () => linter.lint(['*.js', 'src/**/*.js', 'node_modules/core/src/**/*.js']),
            () => console.log(chalk.green('\The code is amazing :)'))
        ])
    ]).catch((err) => err && console.error(err));
};

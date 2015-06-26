module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    var config = {
        browserify: {
            dev: {
                src: ["src/engine.js"],
                dest: "build/engine.js",
                options: {
                    browserifyOptions: {
                        standalone: "Engine",
                        debug: true
                    }
                }
            }
        }
    };

    grunt.initConfig(config);

    grunt.registerTask("build:dev", ["browserify:dev"]);

    grunt.registerTask("build", ["build:dev"]);

    grunt.registerTask("default", ["build"]);
};
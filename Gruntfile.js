module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    var config = {
        jshint: {
            files: ["Gruntfile.js", "src/**/*.js", "node_modules/core/**/*.js"],
            options: {
                globals: {
                    jQuery: false
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "src/css/main.css": "src/less/main.less"
                }
            }
        },
        watch: {
            styles: {
                files: ["src/less/**/*.less"],
                tasks: ["less"],
                options: {
                    nospawn: true
                }
            }
            // Will not work well when using IntelliJ because of autosave. 
            // ,
            // js: {
            //     files: ["<%= jshint.files %>"],
            //     tasks: ["jshint"]
            // }
        },
        browserify: {
            dev: {
                src: ["src/js/game/client-game-engine.js"],
                dest: "build/client-game-engine.js",
                options: {
                    browserifyOptions: {
                        standalone: "ClientGameEngine",
                        debug: true
                    }
                }
            }
        }
    };

    grunt.initConfig(config);

    grunt.registerTask("build:dev", ["browserify:dev", "less"]);

    grunt.registerTask("build", ["build:dev", "jshint"]);

    grunt.registerTask("default", ["build", "watch"]);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
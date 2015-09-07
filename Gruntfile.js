module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    var config = {
        jshint: {
            files: ["Gruntfile.js", "src/**/*.js"],
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
                src: ["src/game-engine.js"],
                dest: "build/game-engine.js",
                options: {
                    browserifyOptions: {
                        standalone: "GameEngine",
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
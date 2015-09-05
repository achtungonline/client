module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    var config = {
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
        },
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

    grunt.registerTask("build", ["build:dev", "less"]);

    grunt.registerTask("default", ["build", "watch"]);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble-less');
};
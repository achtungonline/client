module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    var config = {
        jshint: {
            files: ["Gruntfile.js", "src/**/*.js", "node_modules/core/src/core/**/*.js"],
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
            },
             js: {
                 files: ["<%= jshint.files %>"],
                 tasks: ["browserify:dev"]
             }
        },
        browserify: {
            dev: {
                src: ["src/js/index.js"],
                dest: "build/index.js",
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        open : {
            dev : {
                path: 'src/index.html'
            }
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-open');

    grunt.registerTask("build:dev", ["browserify:dev", "less"]);
    grunt.registerTask("build", ["build:dev", "jshint"]);
    grunt.registerTask("default", ["build", "open:dev", "watch"]);
};

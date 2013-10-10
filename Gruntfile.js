module.exports = require('gruntfile')(function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-testem');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-parallel');
// Project configuration.
    grunt.initConfig({

        clean: {
            build: ['dist/*.js', 'dist/*.css'],
            test: ['test/testbuild.js', 'test/main.*', 'test/x-tag-core.js', 'testem*json', 'test-result/*'],
            demo: ['build/*.js', 'build/*.css']
        },
        compass: {
            main: {
                options: {
                    config: 'assets/compass_config.rb'
                }
            }
        },
        concat: {
            demo: {
                src: [
                    './node_modules/inativ-x-*/dist/*.css',
                    './dist/inativ-x.css'
                ],
                dest: 'build/main.css'
            },
            test: {
                src: [
                    './node_modules/*/dist/*.css',
                    './dist/inativ-x.css'
                ],
                dest: 'test/main.css'
            }
        },
        connect: {
            demo: {
                options:{
                    port: 3001,
                    keepalive: true,
                    hostname: '*'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {src: ['src/main.js'], dest: 'dist/main.js'}
                ]
            }
        },
        jshint:{
            all: ['Gruntfile.js', 'src/main.js']
        },
        watch: {
            files: ['src/*.js', 'src/*.scss', 'test/test.js'],
            tasks: ['build'],
            options: {
                spawn: false
            }
        },
        browserify: {
            test: {
                files: {
                    'test/main.js': ['src/main.js', 'test/test.js']
                }
            },
            demo: {
                files: {
                    'build/main.js': ['src/main.js']
                }
            }
        },
        bumpup: {
            options: {
                version: function (old, type) {
                    return old.replace(/([\d])+$/, grunt.option('wc-version'));
                }
            },
            file: 'package.json'
        },
        testem: {
            options: {
                'launch_in_ci': [
                    'firefox'
                ]
            },
            main: {
                src: [ 'test/TestemSuite.html' ],
                dest: 'test-result/testem-ci.tap'
            }
        },
        mkdir: {
            'test-result': {
                options: {
                    create: ['test-result']
                }
            }
        },
        parallel: {
            demoTest: {
                tasks: [{
                   // grunt: true,
                    args: ['demo']
                }, {
                    //grunt: true,
                    args: ['test']
                }]
            }
        }
    });

    grunt.registerTask('launchDemo', function () {
        grunt.task.run('connect');
        grunt.log.writeln("----------");
        grunt.log.writeln(">>> demo ready, please visit http://localhost:3001/demo/");
        grunt.log.writeln("----------");
    });

    grunt.registerTask('build', ['clean', 'browserify', 'jshint', 'compass', 'copy']);

    grunt.registerTask('buildDemo', ['build', 'clean:demo', 'concat:demo', 'browserify:demo']);
    grunt.registerTask('watchDemo', ['buildDemo', 'watch:demo']);
    grunt.registerTask('demo', ['buildDemo', 'launchDemo']);

    grunt.registerTask('buildTest', ['build', 'clean:test', 'concat:test', 'browserify:test']);
    grunt.registerTask('test',  ['buildTest', 'mkdir:test-result', 'testem']);


    grunt.registerTask('dist', ['test', 'bumpup']);

    grunt.registerTask('default', ['build', 'watch']);

    grunt.registerTask('demoTestParallel', ['parallel:demoTest']);

    grunt.registerTask('help', function(){
       grunt.log.writeln("Quatre tasks principales :\n" +
           " grunt demo : pour lancer la demo \n" +
           " grunt test : pour lancer tous les tests (unit test et testem \n" +
           " grunt dist : pour tout builder et bumper \n" +
           " grunt demoTestParallel : lancement des taches tests et demo en paralleles \n" +
           "\n" +
           "Et comme d'habitude, la tache de base grunt qui build");
    });
});

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		less: {
			default: {
				files: [
					{
						expand: true,
						cwd: 'less',
						src: ['*.less', '**/*.less', '!_vars.less'],
						dest: 'out/css/',
						ext: '.css'
					}
				]
			}
		},

		cssmin: {
			default: {
				files: {
					'out/style.min.css': ['out/css/_style.css']
				}
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			app: {
				src: ['js/app/*.js', 'js/app/**/*.js'],
				dest: 'out/app.js'
			},
			libs: {
				src: ['js/libs/*.js'],
				dest: 'out/libs.js'
			}
		},

		uglify: {
			app: {
				options : {
					sourceMap: true,
					compress: true
				},
				files: {
					'out/app.min.js': ['out/app.js']
				}
			},
			libs: {
				files: {
					'out/libs.min.js': ['out/libs.js']
				}
			}
		},

		watch: {
			css: {
				files: ['less/*.less', 'less/**/*.less'],
				tasks: ['less', 'cssmin']
			},
			js_app: {
				files: ['js/app/*.js', 'js/app/**/*.js'],
				tasks: ['concat:app', 'uglify:app']
			},
			js_libs: {
				files: ['js/libs/*.js', 'js/libs/**/*.js'],
				tasks: ['concat:libs', 'uglify:libs']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'cssmin', 'concat', 'uglify', 'watch']);

};
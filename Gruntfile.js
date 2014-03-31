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

		watch: {
			css: {
				files: ['less/*.less', 'less/**/*.less'],
				tasks: ['less', 'cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'cssmin', 'watch']);

};
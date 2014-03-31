module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		less: {
			default: {
				files: [
					{
						expand: true,
						cwd: 'css/less',
						src: ['*.less', '**/*.less', '!_vars.less'],
						dest: 'css/',
						ext: '.css'
					}
				]
			}
		},

		cssmin: {
			default: {
				files: {
					'css/style.min.css': ['css/style.css']
				}
			}
		},

		watch: {
			css: {
				files: ['css/*.less', 'css/**/*.less'],
				tasks: ['less', 'cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['less', 'cssmin', 'watch']);

};
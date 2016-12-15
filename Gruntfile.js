module.exports = function(grunt) {
	require("load-grunt-tasks")(grunt);
	// Project configuration.
	grunt.initConfig({
		 pkg: grunt.file.readJSON('package.json'),
		 sass: {
			 dist: {
				 files: {
					 'dist/css/main.css': 'scss/main.scss'
				 }
			 }
		 },
		 autoprefixer: {
			options: {
				browsers: ['last 2 versions']
			},
			no_dest: {
				src: 'dist/css/main.css'
			}
		 },
		 copy: {
		 	main: {
		 		files: [
		 			{expand: true, src: ['scripts/vendor/**'], dest: 'dist/', filter: 'isFile'},
		 			{expand: true, src: ['assets/img/**'], dest: 'dist/', filter: 'isFile'}
		 		]
		 	}
		 },
		 connect: {
		 	server: {
		 		options: {
		 			port: 8000
		 		}
		 	}
		 },
		 babel: {
			 options: {
				 sourceMap: false,
				 presets: ['es2015']
			 },
			 dist: {
				//  files: {
				// 	 'dist/js/app.js': 'js/app.js',
				//  }
				files: [{
                    "expand": true,
                    "cwd": "scripts/",
                    "src": ["js/*.js"],
                    "dest": "dist/scripts/",
                    "ext": ".js"
                }]
			 }
		 },
		 watch: {
			 options: {
				 livereload: true,
			 },
			 css: {
				 files: ['scss/*.scss'],
				 tasks: ['sass'],
			 },
			 js: {
			 	files: ['scripts/js/*.js'],
			 	tasks: ['babel']
			 }
		 },
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task(s).
	grunt.registerTask('default', ['sass', 'autoprefixer', 'babel', 'copy', 'connect', 'watch']);

 };

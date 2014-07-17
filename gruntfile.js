/* jshint node: true */

module.exports = function( grunt ) {
	"use strict";

	// Project configuration.
	grunt.initConfig( {

		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),

		// Task configuration.
		clean: { dist: [ 'dist' ] },
		jshint: {
			options   : { jshintrc: 'js/.jshintrc' },
			gruntfile : { src: 'Gruntfile.js' },
			src       : { src: [ 'js/*.js' ] },
			test      : { src: [ 'js/tests/unit/*.js' ] }
		},
		concat: {
			bootstrap: {
				src: [
						'js/jquery.min.js',
						'bootstrap.min.js'
					],
				dest: 'js/<%= pkg.name %>.js'
			},
			css : {
				src: [ 'css/<%= pkg.name %>.bootstrap.css', 'css/font-awesome.css' ],
				dest: 'css/<%= pkg.name %>.css'
			},
			mincss : {
				src: [ 'css/<%= pkg.name %>.bootstrap.min.css', 'css/font-awesome.min.css' ],
				dest: 'css/<%= pkg.name %>.min.css'
			}
		},
		uglify: {
			options: { report: 'min', compress: true },
			bootstrap: { src: ['<%= concat.bootstrap.dest %>'], dest: 'js/<%= pkg.name %>.min.js' }
		},
		recess: {
			options:      { compile: true },
			bootstrap:    { src: [ 'bootstrap/less/custom.less' ], dest: 'css/<%= pkg.name %>.bootstrap.css' },
			fontawesome:  { src: [ 'font-awesome/less/font-awesome.less' ], dest: 'font-awesome/css/font-awesome.css' },
			min:          { options: { compress: true }, src: [ 'bootstrap/less/custom.less' ], dest: 'css/<%= pkg.name %>.bootstrap.min.css' },
		},
		less: {
			compileCore: {
				options: {
					strictMath: true,
					outputSourceFiles: true
				},
				files: { 'css/<%= pkg.name %>.bootstrap.css': 'bootstrap/less/custom.less' }
			}
		},
		copy: {
			fonts: { expand: true, src: [ "fonts/*" ], dest: 'dist/' },
			fontawesome: { expand: false, flatten: true, filter: 'isFile', src: [ "font-awesome/css/font-awesome.css" ], dest: 'css/' },
			lesstweaks: { src: [ "less/*" ], dest: 'bootstrap/' }
		},

		cssmin: {
			'hp': {
				'src': [ 'css/<%= pkg.name %>.css' ],
				'dest': 'css/<%= pkg.name %>.min.css'
			}
		},
		connect   : { server: { options: { port: 3000, base: '.' } } },
		validation: { options: { reset: true }, files: { src: [ "_site/**/*.html" ] } }
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks( 'grunt-html-validation' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-yui-compressor' );

	// not implemented in the hp context
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-recess' );
	grunt.loadNpmTasks( 'browserstack-runner' );

	// http://nodetoolbox.com/packages/grunt-yui-compressor
	grunt.loadNpmTasks( 'grunt-yui-compressor' );

	// See https://www.npmjs.org/package/grunt-git
	grunt.loadNpmTasks('grunt-git');


	// Docs HTML validation task
	grunt.registerTask( 'validate-html', [ 'validation' ] );

	// Combine files task
	grunt.registerTask( 'concat-mincss', [ 'concat:mincss' ] );

	// Compile, minimize CSS
	grunt.registerTask('less-compile', ['less:compileCore']);
	grunt.registerTask( 'hpcss', [ 'recess:fontawesome', 'copy:fontawesome', 'copy:lesstweaks', 'less-compile', 'concat:css', "cssmin:hp" ] );

	// Combine, minimize JS
	grunt.registerTask( 'sbcjs', [ 'concat:bootstrap', 'uglify' ] );

	// Fonts distribution task.
	grunt.registerTask( 'dist-fonts', [ 'copy' ] );

	// Full distribution task.
	grunt.registerTask( 'dist', [ 'clean', 'dist-css', 'dist-fonts', 'dist-js' ] );

};

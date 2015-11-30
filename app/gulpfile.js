'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var insert = require('gulp-insert');
var sym = require('gulp-sym');
var clean = require('gulp-clean');
var pkg = require('./package.json');

var VERSION = pkg.version;

var config = {
	banner:
		'/*!\n' +
		' * Ignition program\n' +
		' * https://berliioz.com\n' +
		' * @license Ignition program\n' +
		' * v' + VERSION + '\n' +
		' * AUTHOR: elbaid.wido@gmail.com\n' +
		' */\n',
	jsDependenciesFiles: [
		'src/bower_components/jquery/dist/jquery.min.js',
		'src/bower_components/angular/angular.min.js',
		'src/bower_components/angular-route/angular-route.js',
		'src/bower_components/lodash/lodash.min.js',
		'src/bower_components/restangular/dist/restangular.min.js',
		'src/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
		'src/bower_components/angular-translate/angular-translate.min.js',
		'src/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
		'src/bower_components/ng-file-upload/ng-file-upload-all.min.js',
		'src/bower_components/textAngular/dist/textAngular-rangy.min.js',
		'src/bower_components/textAngular/dist/textAngular-sanitize.min.js',
		'src/bower_components/textAngular/dist/textAngular.min.js',
		'src/bower_components/angular-filter/dist/angular-filter.min.js'
	],
	cssDependenciesFiles: [
		'src/bower_components/font-awesome/css/font-awesome.min.css',
		'src/bower_components/textAngular/dist/textAngular.css'
	],
	jsBaseFiles: [
		'src/controllers/app.js',
		'src/conf/config.js',
		'src/controllers/home.ctrl.js'
	],
	cssBaseFiles: [
		'src/index.css'
	],
	htmlFiles: [
		'src/index.html'
	],
	img: 'src/img/**',
	//favicon: 'src/img/favicon.ico',
	template: 'src/views/**',
	wwwDir: '../www/',
	lang: 'src/translate/**',
	symlink: 'src'
	//htaccess: 'src/.htaccess'
};

gulp.task('default', [
	'build.www.html.release',
	'build.www.img',
	'build.www.tmpl', 
	'build.www.lang'
]);

gulp.task('debug', [
	'build.www.html.debug', 
	'build.www.img',
	'build.www.symlink.src', 
	'build.www.symlink.tmpl', 
	'build.www.symlink.lang'
]);

gulp.task('clean', function() {
	return gulp.src(config.wwwDir, {read: false})
    .pipe(clean({force: true}))
});

gulp.task('build.www.img', ['clean'], function() { //['build.www.favicon'], function() {
	return gulp.src(config.img)
    .pipe(gulp.dest(config.wwwDir + 'img/'))
});

gulp.task('build.www.lang', ['clean'], function() {
	return gulp.src(config.lang)
    .pipe(gulp.dest(config.wwwDir + 'translate/'))
});

gulp.task('build.www.tmpl', ['clean'], function() {
	return gulp.src(config.template)
    .pipe(gulp.dest(config.wwwDir + 'views/'))
});

gulp.task('build.www.symlink.src', ['clean'], function() {
	return gulp.src(config.symlink)
	.pipe(sym(config.wwwDir + config.symlink));
});

gulp.task('build.www.symlink.tmpl', ['clean'], function() {
	return gulp.src(config.symlink + '/views')
	.pipe(sym(config.wwwDir + 'views'));
});

gulp.task('build.www.symlink.lang', ['clean'], function() {
	return gulp.src(config.symlink + '/translate')
	.pipe(sym(config.wwwDir + 'translate'));
});

/*gulp.task('build.www.htaccess', ['clean'], function() {
	return gulp.src(config.htaccess)
	.pipe(gulp.dest(config.wwwDir))
});*/

/*gulp.task('build.www.favicon', function() {
	return gulp.src(config.favicon)
    .pipe(gulp.dest(config.wwwDir))
});*/

/*gulp.task('build.www.map', ['build.www.css'], function() {
	return gulp.src(config.jsDependenciesMapFiles)
    .pipe(gulp.dest(config.wwwDir + 'js/'))
});*/

gulp.task('build.dep.js', ['clean'], function() {
	return gulp.src(config.jsDependenciesFiles)
	.pipe(concat('ignition-program-dependencies.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(rename({ extname: '.min.js' }))
	.pipe(gulp.dest(config.wwwDir + 'js/'))
});

gulp.task('build.js', ['clean'], function() {
	return gulp.src(config.jsBaseFiles)
	.pipe(addsrc(config.jsConfRelease))
	.pipe(concat('ignition-program.js'))
	.pipe(insert.prepend(config.banner))
	.pipe(ngAnnotate())
	.pipe(uglify({ preserveComments: 'some' }))
	.pipe(rename({ extname: '.min.js' }))
	.pipe(gulp.dest(config.wwwDir + 'js/'))
});

gulp.task('build.dep.css', ['clean'], function() {
	return gulp.src(config.cssDependenciesFiles)
	.pipe(concat('ignition-program-dependencies.css'))
	.pipe(minifyCss())
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(config.wwwDir + 'css/'))
});

gulp.task('build.css', ['clean'], function() {
	return gulp.src(config.cssBaseFiles)
	.pipe(concat('ignition-program.css'))
	.pipe(insert.prepend(config.banner))
	.pipe(minifyCss())
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(config.wwwDir + 'css/'))
});

gulp.task('build.www.html.release', ['build.dep.js', 'build.js', 'build.dep.css', 'build.css'], function() {
	var script = '\t\t<script type="text/javascript" src="/js/ignition-program-dependencies.min.js"></script>\n';
	script += '\t\t<script type="text/javascript" src="/js/ignition-program.min.js"></script>\n';

	var link = '\t\t<link rel="stylesheet" href="/css/ignition-program-dependencies.min.css"/>\n';
	link += '\t\t<link rel="stylesheet" href="/css/ignition-program.min.css"/>\n';

	return gulp.src(config.htmlFiles)
	.pipe(replace(/\t\t<script type="text\/javascript" src="GULP_REPLACE"><\/script>/i, script))
	.pipe(replace(/\t\t<link rel="stylesheet" href="GULP_REPLACE"\/>/i, link))
    .pipe(gulp.dest(config.wwwDir))
});

gulp.task('build.www.html.debug', ['clean'], function() {
	var script = "";
	var link = "";

	for (var i = 0; i < config.jsDependenciesFiles.length; ++i) {
		script += '\t\t<script type="text/javascript" src="/' + config.jsDependenciesFiles[i] + '"></script>\n';
	}
	for (var i = 0; i < config.jsBaseFiles.length; ++i) {
		script += '\t\t<script type="text/javascript" src="/' + config.jsBaseFiles[i] + '"></script>\n';
	}

	for (var i = 0; i < config.cssDependenciesFiles.length; ++i) {
		link += '\t\t<link rel="stylesheet" href="/' + config.cssDependenciesFiles[i] + '"/>\n';
	}
	for (var i = 0; i < config.cssBaseFiles.length; ++i) {
		link += '\t\t<link rel="stylesheet" href="/' + config.cssBaseFiles[i] + '"/>\n';
	}

	return gulp.src(config.htmlFiles)
	.pipe(replace(/\t\t<script type="text\/javascript" src="GULP_REPLACE"><\/script>/i, script))
	.pipe(replace(/\t\t<link rel="stylesheet" href="GULP_REPLACE"\/>/i, link))
    .pipe(gulp.dest(config.wwwDir))
});

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
		'src/bower_components/PACE/pace.min.js',
		'src/bower_components/jquery/dist/jquery.min.js',
		'src/bower_components/jquery-ui/jquery-ui.min.js',
		'src/bower_components/jquery.actual/jquery.actual.min.js',
		'src/bower_components/jquery.scrollbar/jquery.scrollbar.min.js',
		'src/bower_components/jquery-bez/jquery.bez.min.js',
		'src/bower_components/jquery-unveil/jquery.unveil.min.js',
		'src/bower_components/iOSList/dist/js/jquery.ioslist.min.js',
		'src/bower_components/classie/classie.js',
		'src/bower_components/datatables/media/js/jquery.dataTables.min.js',
		'src/bower_components/datatables-colreorder/js/dataTables.colReorder.js',

		'src/bower_components/angular/angular.min.js',
		'src/bower_components/angular-material/angular-material.min.js',
		'src/bower_components/angular-animate/angular-animate.min.js',
		'src/bower_components/angular-aria/angular-aria.min.js',
		'src/bower_components/angular-ui-router/release/angular-ui-router.js',
		'src/bower_components/angular-ui/build/angular-ui.min.js',
		'src/bower_components/angular-sanitize/angular-sanitize.min.js',
		'src/bower_components/oclazyload/dist/ocLazyLoad.min.js',
		'src/bower_components/lodash/lodash.min.js',
		'src/bower_components/restangular/dist/restangular.min.js',
		'src/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
		'src/bower_components/angular-translate/angular-translate.min.js',
		'src/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
		'src/bower_components/ng-file-upload/ng-file-upload-all.min.js',
		'src/bower_components/textAngular/dist/textAngular-rangy.min.js',
		'src/bower_components/textAngular/dist/textAngular-sanitize.min.js',
		'src/bower_components/textAngular/dist/textAngular.min.js',
		'src/bower_components/angular-filter/dist/angular-filter.min.js',
		'src/bower_components/angular-datatables/dist/angular-datatables.min.js'
	],
	cssDependenciesFiles: [
		'src/bower_components/angular-material/angular-material.min.css',
		'src/bower_components/jquery.scrollbar/jquery.scrollbar.css',
		'src/bower_components/bootstrap/dist/css/bootstrap.min.css',
		'src/bower_components/font-awesome/css/font-awesome.min.css',
		'src/bower_components/textAngular/dist/textAngular.css',
		'src/bower_components/angular-ui/build/angular-ui.min.css'
	],
	jsBaseFiles: [
		'src/pages/js/pages.js',
		'src/assets/plugins/modernizr.custom.js',
		'src/assets/js/app.js',
		'src/assets/js/config.js',
		'src/assets/js/config.lazyload.js',
		'src/assets/js/main.js',
		'src/assets/js/directives/pg-sidebar.js',
		'src/assets/js/directives/cs-select.js',
		'src/assets/js/directives/pg-dropdown.js',
		'src/assets/js/directives/pg-form-group.js',
		'src/assets/js/directives/pg-navigate.js',
		'src/assets/js/directives/pg-portlet.js',
		'src/assets/js/directives/pg-tab.js',
		'src/assets/js/directives/pg-search.js',
		'src/assets/js/directives/skycons.js',
		'src/assets/js/controllers/home.js',
		'src/assets/js/controllers/search.js',
		'src/assets/js/controllers/login.js'
	],
	cssBaseFiles: [
		'src/assets/plugins/pace/pace-theme-flash.css',
		'src/pages/css/pages.css',
		'src/pages/css/pages-icons.css',
		'src/assets/css/style.css'
	],
	htmlFiles: [
		'src/index.html'
	],
	img: 'src/assets/img/**',
	//favicon: 'src/img/favicon.ico',
	template: 'src/tpl/**',
	wwwDir: '../www/',
	lang: 'src/translate/**',
	pages: 'pages/**',
	symlink: 'src',
	htaccess: 'src/.htaccess'
};

gulp.task('default', [
	'build.www.html.release',
	'build.www.htaccess',
	'build.www.pages',
	'build.www.img',
	'build.www.tmpl', 
	'build.www.lang'
]);

gulp.task('debug', [
	'build.www.html.debug',
	'build.www.htaccess',
	'build.www.pages',
	'build.www.symlink.src', 
	'build.www.symlink.tmpl', 
	'build.www.symlink.lang',
	'build.www.symlink.assets'
]);

gulp.task('clean', function() {
	return gulp.src(config.wwwDir, {read: false})
    .pipe(clean({force: true}))
});

gulp.task('build.www.img', ['clean'], function() { //['build.www.favicon'], function() {
	return gulp.src(config.img)
    .pipe(gulp.dest(config.wwwDir + 'assets/img/'))
});

gulp.task('build.www.pages', ['clean'], function() {
	return gulp.src(config.pages)
    .pipe(gulp.dest(config.wwwDir + 'pages/'))
});

gulp.task('build.www.lang', ['clean'], function() {
	return gulp.src(config.lang)
    .pipe(gulp.dest(config.wwwDir + 'translate/'))
});

gulp.task('build.www.tmpl', ['clean'], function() {
	return gulp.src(config.template)
    .pipe(gulp.dest(config.wwwDir + 'tpl/'))
});

gulp.task('build.www.symlink.src', ['clean'], function() {
	return gulp.src(config.symlink)
	.pipe(sym(config.wwwDir + config.symlink));
});

gulp.task('build.www.symlink.assets', ['clean'], function() {
	return gulp.src(config.symlink + '/assets')
	.pipe(sym(config.wwwDir + 'assets'));
});

gulp.task('build.www.symlink.tmpl', ['clean'], function() {
	return gulp.src(config.symlink + '/tpl')
	.pipe(sym(config.wwwDir + 'tpl'));
});

gulp.task('build.www.symlink.lang', ['clean'], function() {
	return gulp.src(config.symlink + '/translate')
	.pipe(sym(config.wwwDir + 'translate'));
});

gulp.task('build.www.htaccess', ['clean'], function() {
	return gulp.src(config.htaccess)
	.pipe(gulp.dest(config.wwwDir))
});

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
	.pipe(gulp.dest(config.wwwDir + 'assets/js/'))
});

gulp.task('build.js', ['clean'], function() {
	return gulp.src(config.jsBaseFiles)
	.pipe(concat('ignition-program.js'))
	.pipe(insert.prepend(config.banner))
	.pipe(ngAnnotate())
	.pipe(uglify({ preserveComments: 'some' }))
	.pipe(rename({ extname: '.min.js' }))
	.pipe(gulp.dest(config.wwwDir + 'assets/js/'))
});

gulp.task('build.dep.css', ['clean'], function() {
	return gulp.src(config.cssDependenciesFiles)
	.pipe(concat('ignition-program-dependencies.css'))
	.pipe(minifyCss())
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(config.wwwDir + 'assets/css/'))
});

gulp.task('build.css', ['clean'], function() {
	return gulp.src(config.cssBaseFiles)
	.pipe(concat('ignition-program.css'))
	.pipe(insert.prepend(config.banner))
	.pipe(minifyCss())
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(config.wwwDir + 'assets/css/'))
});

gulp.task('build.www.html.release', ['build.dep.js', 'build.js', 'build.dep.css', 'build.css'], function() {
	var script = '\t\t<script type="text/javascript" src="/assets/js/ignition-program-dependencies.min.js"></script>\n';
	script += '\t\t<script type="text/javascript" src="/assets/js/ignition-program.min.js"></script>\n';

	var link = '\t\t<link rel="stylesheet" href="/assets/css/ignition-program-dependencies.min.css"/>\n';
	link += '\t\t<link rel="stylesheet" href="/assets/css/ignition-program.min.css"/>\n';

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

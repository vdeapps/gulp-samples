"use strict";

// Include plugins
const { src, dest, lastRun, watch, series, parallel } = require('gulp');
var path = require('path');
var sftp = require('gulp-sftp-up4'); // yarn add gulp-sftp-up4 --dev

var baseDir="/var/www/ddse-deconstruction";

var syncDir=[
	"!CVS",
	"!*.tmp",
	"!*.lock",
	"lib/js/**/*.js",
	"lib/php/*.php",
	"css/**/*.css",
	"actions/**/*.php",
	"canvas/**/*",
	"classes/**/*.php",
	"dialog/**/*.php",
	"dossiers/**/*",
	"excel/**/*",
	,"inc/*.php", "!inc/env.php",
	"layout/**/*",
	"mails/**/*",
	"media/**/*",
	"moulinettes/**/*",
	"pages/**/*.php",
	"src/**/*.php"
]

function copytoDest(srcPath){
	
//	console.log("Copy to: " + baseDir + "/" + path.dirname(srcPath))
	
	return src(srcPath, {since: lastRun(copytoDest)})
	.pipe(sftp({
		host: 'lehtecws03',
		user: 'www-data',
		password: 'www-data',
		remotePath: baseDir + "/" + path.dirname(srcPath)
	}));	
}

function syncToDev() {
	
	var watcher = watch(syncDir);
	watcher.on('add', function(pathInfo, stat) {
		copytoDest(pathInfo);
		  // `path` is the path of the changed file
		  // `stat` is an `fs.Stat` object (not always available)
		});
	watcher.on('change', function(pathInfo, stat) {
		copytoDest(pathInfo);
		  // `path` is the path of the changed file
		  // `stat` is an `fs.Stat` object (not always available)
		});
	
}

exports.syncToDev = syncToDev;


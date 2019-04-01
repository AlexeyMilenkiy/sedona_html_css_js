var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

gulp.task('less', function(){

	return gulp.src(['./style/less/*.less'])
	       .pipe(less())
         .pipe(concat('main.css'))
	       .pipe(gulp.dest('./style/dest'))
	       .pipe(browserSync.stream());
});

gulp.task('css', function () {
 var processors = [autoprefixer];
  return gulp.src('./style/dest/main.css')
         .pipe(postcss(processors))
         .pipe(gulp.dest('./style/'))
         .pipe(browserSync.stream());
});

gulp.task('default', gulp.parallel('less', 'css', function(){
       
       browserSync.init({

       	server: {baseDir: './'}
       })

	gulp.watch('./index.html').on('change', browserSync.reload);

    gulp.watch('./style/main.css').on('change', browserSync.reload);
    gulp.watch('./js/*.js').on('change', browserSync.reload);
 
    gulp.watch('./style/less/*.less', gulp.series('less'));
    gulp.watch('./style/dest/*.css', gulp.series('css'));

}));

var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: './img/logotype-tablet.png',
    dest: './img/icons',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '21%'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'whiteSilhouette',
        backgroundColor: '#da532c',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'shadow',
        themeColor: '#ffffff',
        manifest: {
          name: 'PUGOFKA',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      compression: 5,
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

gulp.task('inject-favicon-markups', function() {
  gulp.src([ './*.html' ])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('./'));
});


gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});
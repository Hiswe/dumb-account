'use strict'

// this use gulp 4
// https://github.com/gulpjs/gulp/blob/4.0/docs/API.md

var gulp          = require('gulp')
var $             = require('gulp-load-plugins')()
var browserSync   = require('browser-sync').create()

var args          = require('yargs').argv
var reload        = browserSync.reload
var isDev         = args.prod !== true
var jsBasedir     = __dirname + '/js'

function onError(err) {
  $.util.beep();
  if (err.annotated)      { $.util.log(err.annotated) }
  else if (err.message)   { $.util.log(err.message) }
  else                    { $.util.log(err) }
  return this.emit('end')
}

////////
// JS
////////

var browserify    = require('browserify')
var babelify      = require('babelify')
var watchify      = require('watchify')
var envify        = require('envify')
var source        = require('vinyl-source-stream')
var vinylBuffer   = require('vinyl-buffer')

//----- LIBRARIES

var npmLibs       = [
  // 'autosize',
  // 'epiceditor/src/editor',
  // 'marked',
  // 'lodash.omit',
  // 'moment',
  // 'marked',
  'react',
  'react-dom',
  'react-router',
  'redux',
  'react-redux',
  'axios',
  'redux-axios-middleware',
];

function jsLib() {
  var b = browserify({
    debug: true,
    // need to parse for envify
    // noParse: npmLibs,
  })

  npmLibs.forEach(function(lib) {
    b.require(lib);
  })

  b.transform(envify({
    _:        'purge',
    NODE_ENV: isDev ? 'development' : 'production',
  }))

  return b
  .bundle()
  .pipe(source('dumb-account-lib.js'))
  .pipe(gulp.dest('public'))
}

function jsApp() {

  var b = browserify({
    cache:        {},
    packageCache: {},
    debug:        isDev,
    extensions:   ['.js', '.jsx'],
    entries:      ['./client/front-app.jsx']
  })
  .external(npmLibs)
  .transform(babelify, {
    presets: ['es2015', 'react'],
    // plugins: ['transform-object-assign'],
  })

  // .transform(envify({
  //   _: 'purge',
  //   NODE_ENV: isDev ? 'development' : 'production',
  //   LOG: isDev,
  // }))


  if (isDev) {
    $.util.log('init watchify')
    b = watchify(b);
    b.on('update', () => {
      $.util.log('update bundle')
      bundleShare(b)
    })
  }
  return bundleShare(b)
}

function bundleShare(b) {
  return b
  .bundle()
  .on('error', function (err) {
    console.log(err.message);
    $.util.beep();
    this.emit('end');
  })
  .pipe(source('dumb-account.js'))
  .pipe(vinylBuffer())
  // .pipe($.sourcemaps.init({loadMaps: true}))
  // .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('./public'))
  // .on('end', reload)
}

const js = gulp.parallel(jsLib, jsApp)

////////
// DEV
////////

const build = js


function devServer(cb) {
  $.util.log('nodemon')

  // double restart issue on node6
  // https://github.com/remy/nodemon/issues/763
  // https://github.com/remy/nodemon/issues/844
  $.nodemon({
    script: './index.js',
    ext:    'js json jsx',
    // runOnChangeOnly: true,
    watch:  [
      'shared',
      'server',
    ],
    env:    { 'NODE_ENV': 'development' },
    delay:  1,
  })
  .once('start', onStart)
  .on('restart', () => {
    $.util.log('nodemon restart')
    // reload()
  })

  function onStart() {
    $.util.log('nodemon start')
    $.util.log('browser-sync start')
    browserSync.init({
      proxy:      'http://localhost:3000',
      open:       false,
      port:       7000,
      ghostMode:  false,
    }, cb)
  }
}

const dev = gulp.series(build, devServer)

////////
// EXPORTS
////////

module.exports = {
  build,
  dev,
}

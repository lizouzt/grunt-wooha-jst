# grunt-wooha-jst

> Compile underscore templates to JST file that can be either exposed as a module or cmd module.And sync file compile supported. Word with browserify and cmd.js both.

> Same as [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst) but add module.exports and sync support.

> ( require.js | browserify) + browserSync + watch

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-wooha-jst --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-wooha-jst');
```

## The "wooha_jst" task

### Overview
In your project's Gruntfile, add a section named `wooha_jst` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  wooha_jst: {
    complie:{
      options:{
        exportMode: true,
        prettify:true,
        templateSettings : {},
        processContent: function(src) {
          return src.replace(/\r\n/g, '\n');
        }
      },
      files:[{
        expand: true,
        cwd: '<%= srcBase %>',
        src: ['p/**/*.jst.html', 'c/widget/**/*.jst.html'],
        dest: '<%= srcBase %>',
        ext: '.jst.js'
      }]
    }
  }
});
```
### Options

#### separator
Type: `String`
Default: linefeed + linefeed


Concatenated files will be joined on this string.

#### namespace
Type: `String`
Default: 'JST'

The namespace in which the precompiled templates will be assigned. Use dot notation (e.g. App.Templates) for nested namespaces or false for no namespace wrapping. When false with amd option set true, templates will be returned directly from the AMD wrapper.

#### processName
Type: `function`
Default: null

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object.  The example below stores all templates on the default JST namespace in capital letters.

```js
options: {
  processName: function(filename) {
    return filename.toUpperCase();
  }
}
```

#### templateSettings
Type: `Object`
Default: null

The settings passed to underscore when compiling templates.

```js
jst: {
  compile: {
    options: {
      templateSettings: {
        interpolate : /\{\{(.+?)\}\}/g
      }
    },
    files: {
      "path/to/compiled/templates.js": ["path/to/source/**/*.html"]
    }
  }
}
```

#### prettify
Type: `boolean`
Default: false

When doing a quick once-over of your compiled template file, it's nice to see
an easy-to-read format that has one line per template. This will accomplish
that.

```js
options: {
  prettify: true
}
```

#### exportMode
Type: `boolean`
Default: false

Wrap the output file with module.exports mode.It's has higher priority than amd attribute.

#### amd
Type: `boolean`
Default: false

Wraps the output file with an AMD define function and returns the compiled template namespace unless namespace has been explicitly set to false in which case the template function will be returned directly.

```js
define(function() {
    //...//
    return this['[template namespace]'];
});
```

Example:
```js
options: {
  amd: true
}
```

#### processContent
Type: `function`

This option accepts a function which takes one argument (the file content) and
returns a string which will be used as template string.
The example below strips whitespace characters from the beginning and the end of
each line.

```js
options: {
  processContent: function(src) {
    return src.replace(/(^\s+|\s+$)/gm, '');
  }
}
```

### Usage Examples

```js
({
  jst:{
    complie:{
      options:{
        exportMode: true,
        prettify:true,
        templateSettings : {},
        processContent: function(src) {
          return src.replace(/\r\n/g, '\n');
        }
      },
      files:[{
        expand: true,
        cwd: '<%= srcBase %>',
        src: ['p/<%= curp %>/*.jst.html', 'c/widget/<%= curw %>/*.jst.html', 'lib/**/*.jst','!deps'],
        dest: '<%= srcBase %>',
        ext: '.jst.js'
      }]
    }
  },

  browserify: {
    dist: {
      files: {
        'build/index.org.js': ['src/p/index/index.js'],
        'build/index.org.js': ['src/p/cat/index.js']
      },
      options: {
        // "transform": ["hbsfy"]
      }
    }
  },

  browserSync: {
    files: ['./build/**/*.css','./src/**/*.js'],
    options: {
      watchTask: true,
      server: {
        baseDir: "./",
        index: "./html/index.html"
      },
    }
  },

  watch: {
    options: {
      ignoreInitial: true,
      ignored: ['*.txt','*.json']
    },
    assets:{
      files: ['src/**/*.less', 'src/**/*.js', '!src/**/*.jst.js', 'src/**/*.jst.html'],
      tasks: ['less', 'browserify']
    }
  }
})

grunt.loadNpmTasks('grunt-wooha-jst');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-browser-sync');
grunt.loadNpmTasks('grunt-browserify');
grunt.registerTask('sync', ['wooha_jst', 'browserSync', 'watch']);
```
Note that the `interpolate: /\{\{(.+?)\}\}/g` setting above is simply an example of overwriting lodash's default interpolation. If you want to parse templates with the default `_.template` behavior (i.e. using `<div><%= this.id %></div>`), there's no need to overwrite `templateSettings.interpolate`.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

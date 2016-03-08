/*
 * grunt-wooha-jst
 * https://github.com/Taoz/grunt-wooha-jst
 *
 * Copyright (c) 2016 Tao.z
 * Licensed under the MIT license.
 */

'use strict';
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function(grunt) {
  var options       = null,
      nsInfo        = null,
      processName   = null,
      filesCache    = '';

  // filename conversion for templates
  var defaultProcessName = function(name) { return name; };

  function translate(filepath) {
    var src = options.processContent(grunt.file.read(filepath));
    var compiled, filename;

    try {
      compiled = _.template(src, false, options.templateSettings).source;
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('JST ' + chalk.cyan(filepath) + ' failed to compile.');
    }

    if (options.prettify) {
      compiled = compiled.replace(/\n/g, '');
    }
    filename = processName(filepath);

    if (options.exportMode) {
      return compiled;
    } else {
      if (options.amd && options.namespace === false) {
        return 'return ' + compiled;
      } else {
        return nsInfo.namespace+'['+JSON.stringify(filename)+'] = '+compiled+';';
      }
    }
  }

  function initParams () {
    var lf = grunt.util.linefeed;
    var helpers = require('grunt-lib-contrib').init(grunt);

    options = this.options({
      namespace: 'JST',
      templateSettings: {},
      processContent: function (src) { return src; },
      separator: lf + lf,
      exportMode: false
    });
    // assign filename transformation functions
    processName = options.processName || defaultProcessName;

    var nsInfo = {};
    if (options.namespace !== false) {
      nsInfo = helpers.getNamespaceDeclaration(options.namespace);
    }
  }

  function compileFile(params) {
    var files = [];
    if (params.constructor == String) {
      filesCache.forEach(function (cf) {
        cf.src[0] == params && files.push(cf);
      });
    } else files = params;

    files.forEach(function(f) {
        var output = f.src.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Source file ' + chalk.cyan(filepath) + ' not found.');
                return false;
            } else {
                return true;
            }
        })
        .map(translate);

        if (output.length < 1) {
            grunt.log.warn('Destination not written because compiled files were empty.');
        } else {
            if (options.prettify) {
                output.forEach(function(line, index) {
                    output[index] = "  " + line;
                });
            }

        if (options.amd) {
          if (options.namespace !== false) {
            output.unshift(nsInfo.declaration);
          }

          output.unshift("define(function(){");
          if (options.namespace !== false) {
            output.push("  return " + nsInfo.namespace + ";");
          }

          output.push("});");
        } else if (options.exportMode) {
          output.unshift("module.exports = ");
          output.push("");
        }

        grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
        grunt.log.writeln('File ' + chalk.cyan(f.dest) + ' created.');
      }
    });
  }

  grunt.event.on('watch', function (event, filePath) {
    if (grunt.file.exists(filePath)) {
        compileFile(filePath);
    }
  });

  grunt.registerMultiTask('wooha_jst', 'Compile underscore templates to JST file that can be either exposed as a module or cmd module.And sync file compile supported.', function() {
    initParams.apply(this, arguments);
    filesCache = this.files;
    compileFile(this.files);
  });
};

/*
 * grunt-micro-based-template
 * https://github.com/jinjianfeng/grunt-micro-based-template
 *
 * Copyright (c) 2014 jinjianfeng
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    'use strict';
    var compiler = require('./lib/compiler')
    var wrap = require('./lib/wrap')

    grunt.registerMultiTask('micro_template', 'micro template compiler', function () {
        var options = this.options({
            wrap: 'default',
            lineNumber: false
        });
        this.files.forEach(function (file) {
            console.log('file object',file);
            file.src.map(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    return grunt.log.warn('Source file ' + filepath + ' not found.');
                }

                var name = filepath.replace('\\', '\/')
                        .split('\/')
                        .pop()
                        .replace(/\..*$/, '');
                options.filenameForVal = name;
                
                var beforeCompileTimeStamp = new Date(),
                    src = grunt.file.read(filepath),
                    dest;
                options.filepath = filepath;

                try {
                    dest = compiler.process(src, options);
                    dest = wrap(dest, options);
                }
                catch (e) {
                    grunt.log.error('Compiled Error');
                    grunt.log.warn('Source mtpl filepath: "' + filepath + '"');
                    grunt.log.warn('Line Number: ' + e.line);
                    grunt.log.warn(e.message);
                    return;
                }

                if (dest.length === 0) {
                    return grunt.log.warn('Destination not written because compiled tpl was empty.');
                }

                if (options.banner) {
                    dest = options.banner + grunt.util.linefeed + dest;
                }
                grunt.file.write(file.dest, dest);
                grunt.log.writeln('File ' + file.dest + 'created  (' + ( new Date() - beforeCompileTimeStamp ) / 1000 + 's)');
            });
        });
    });
};
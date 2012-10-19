module.exports = function( grunt ) {

    // Install node modules.
    var fs   = require('fs'),
        zlib = require('zlib'),
        csso = require('csso');

    
    // TASKS
    // ==========================================================================

    grunt.registerMultiTask( 'csso', 'Minification task with CSSO.', function() {

        grunt.log.subhead('Optimizing with CSSO...');
        
        var inputPath  = this.file.src,
            uncompSize = String(fs.statSync(inputPath).size).green,
            outputPath = this.file.dest,
            restructure = (this.data.restructure === false) ? false : true,
            stuff = grunt.file.read(inputPath);

        // Override if `src` only
        if ( outputPath === undefined ) {
            outputPath  = inputPath;
        }

        // Check restructure option
        if (restructure) {
            minified = csso.justDoIt(stuff);
        } else {
            minified = csso.justDoIt(stuff, true);
        }

        // Generate minified file
        grunt.file.write(outputPath, minified);
        grunt.helper('min_max_info', outputPath, uncompSize);
        
    });


    // HELPERS
    // ==========================================================================

    // Return gzipped source.
    grunt.registerHelper('gzip', function(path) {
        var gzip = zlib.createGzip(),
            input  = fs.createReadStream(path),
            gzipped = input.pipe(gzip);
        return path ? gzipped._chunkSize : '';
    });

    // Output some size info about a file.
    grunt.registerHelper('min_max_info', function(min, max) {
        var gzipSize = String(grunt.helper('gzip', min)).green,
            compSize = String(fs.statSync(min).size).green;
        grunt.log.writeln(' File "' + String(min).green　+ '" created.');
        grunt.log.writeln(' Uncompressed size: ' + max + ' bytes.');
        grunt.log.writeln(' Compressed size: ' + gzipSize + ' bytes gzipped (' + compSize + ' bytes minified).');
    });
};
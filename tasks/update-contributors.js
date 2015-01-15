module.exports = function(grunt) {

  var exec = require('child_process').exec;
  var _ = grunt.util._;

  /**
   * Generate contributors, all developers who contributed, sorted by number of commits.
   */
  grunt.registerMultiTask('update-contributors', 'Update contributors in json files', function() {
    var done = this.async();
    var opts = this.options({
      file: 'package.json',
      commit: true,
      commitMessage: 'Update contributors',
      as: 'contributors',
      filter: function(contributors) {
        return contributors.slice(1);
      }
    });

    if (!_.isFunction(opts.filter)) {
      opts.filter = function(contributors) { return contributors; };
    }

    exec('git log --pretty=short | git shortlog -nse', function(err, stdout) {
      var pkg = grunt.file.readJSON(opts.file);

      var contributors = stdout.toString().split('\n').filter(function(line) {
        return line.length;
      }).map(function(line) {
        var lineNumberMatcher = /^[\W\d]+/;
        return {
          name: line.replace(lineNumberMatcher, ''),
          commitCount: parseInt(line.match(lineNumberMatcher)[0], 10)
        };
      });

      pkg[opts.as] = opts.filter(contributors);
      if (_.isArray(pkg[opts.as])) {
        pkg[opts.as] = pkg[opts.as].map(function(contributor) {
          return contributor.name;
        });
      }

      grunt.file.write(opts.file, JSON.stringify(pkg, null, '  ') + '\n');

      if (!opts.commit) {
        grunt.log.ok('The contributors list has been updated.');
        return done();
      }

      exec('git status -s ' + opts.file, function(err, stdout) {
        if (!stdout) {
          grunt.log.ok('The contributors list is already up to date.');
          return done();
        }

        exec('git commit ' + opts.file + ' -m "' + opts.commitMessage + '"', function(err, stdout, stderr) {
          if (err) {
            grunt.log.error('Cannot commit contributors changes:\n  ' + stderr);
          } else {
            grunt.log.ok('The contributors list has been updated and commited.');
          }
          done();
        });
      });
    });
  });
};

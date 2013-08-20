'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var grunt = require('grunt');

var GruntfileGenerator = module.exports = function GruntfileGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(GruntfileGenerator, yeoman.generators.NamedBase);


GruntfileGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  console.log(this.yeoman);

  var prompts = [{
    type: 'confirm',
    name: 'api',
    message: 'Do you want the template for API?'
  }, {
    type: 'confirm',
    name: 'web',
    message: 'Do you want the template for web/frontend?'
  }];

  // Find the first `preferred` item existing in `arr`.
  function prefer(arr, preferred) {
    for (var i = 0; i < preferred.length; i++) {
      if (arr.indexOf(preferred[i]) !== -1) {
        return preferred[i];
      }
    }
    return preferred[0];
  }

  // Guess at some directories, if they exist.
  var dirs = grunt.file.expand({ filter: 'isDirectory' }, '*').map(function (d) { return d.slice(0, -1); });

  this.libDir = prefer(dirs, ['lib', 'src']);
  this.testDir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);

  this.prompt(prompts, function (props) {
    this.api = props.api;
    this.web = props.web;

    this.testTask = 'nodeunit';
    this.fileName = '<%= pkg.name %>';

    cb();
  }.bind(this));
};


GruntfileGenerator.prototype.projectfiles = function projectfiles() {
  this.template('Gruntfile.js');
};

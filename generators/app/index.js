var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path') ;
var debug = require('debug')('generator-drachtio') ;
const msgTypes = [
  'invite', 
  'register',
  'subscribe',
  'info',
  'options',
  'publish',
  'message'
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the application name',
        default: this.appname.replace(/\s+/g, '-')
      },
      {
        type: 'checkbox',
        name: 'handles',
        message: 'Which sip request types will you handle',
        choices: msgTypes,
        default: ['invite']
      },
      {
        type: 'confirm',
        name: 'useFsmrf',
        message: 'Does your app need to use drachtio-fsmrf for ivr/media control?',
        default: false
      },
      {
        type: 'confirm',
        name: 'test',
        message: 'Do you want a (docker-based) test suite created?',
        default: false
      }
    ]);
  }

  writing() {
    [
      'package.json', 
      'app.js', 
      'README.md'
    ].forEach((p) => {
      this.fs.copyTpl(
        this.templatePath(p),
        this.destinationPath(p),
        {
          name: this.answers.name,
          useFsmrf: this.answers.useFsmrf,
          test: this.answers.test,
          handles: this.answers.handles
        }
      );  
    });

    [
      'eslintrc.json', 
      'eslintignore', 
      'gitignore'
    ].forEach((p) => {
      this.fs.copyTpl(
        this.templatePath(p),
        this.destinationPath(`.${p}`),
        {
          name: this.answers.name,
          useFsmrf: this.answers.useFsmrf,
          test: this.answers.test,
          handles: this.answers.handles
        }
      );  
    });

    msgTypes.forEach((t) => {
      if (this.answers.handles.includes(t)) {
        this.fs.copyTpl(
          this.templatePath('handler-boilerplate.js'),
          this.destinationPath(`lib/${t}.js`),
          {
            useFsmrf: this.answers.useFsmrf,
            method: t
          }
        );
      }
    });

    if (this.answers.test) {
      this.fs.copyTpl(
        this.templatePath('test/**'),
        this.destinationPath('test'),
        {
          appname: this.answers.name,
          useFsmrf: this.answers.useFsmrf,
          handles: this.answers.handles
        }
      );
      this.fs.copyTpl(
        this.templatePath('local-test.json'),
        this.destinationPath('config/local-test.json'),
        {
          useFsmrf: this.answers.useFsmrf
        }
      );
    }

    // install base dependencies
    const dependencies = ['drachtio-srf', 'pino', 'config'];
    const devDepdencies = ['eslint', 'eslint-plugin-promise'];

    // options
    if (this.answers.useFsmrf) {
      dependencies.push('drachtio-fsmrf', 'drachtio-fn-fsmrf-sugar');
    }
    if (this.answers.handles.includes('register')) {
      dependencies.push('drachtio-mw-registration-parser');
    }
    if (this.answers.test) {
      devDepdencies.push(
        'blue-tape',
        'clear-module',
        'tap',
        'tap-dot',
        'tap-spec',
        'istanbul@^1.0.0-alpha.2'
      );
    }
    this.npmInstall(dependencies);
    this.npmInstall(devDepdencies, {'save-dev': true});

  }
};

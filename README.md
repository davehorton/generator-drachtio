# generator-drachtio 

A yeoman generator for [drachtio](https://drachtio.org) apps

install yeoman if you have not already
```
$ npm install -g yo
```
install the drachtio generator
```
npm install -g generator-drachtio
```
create a fresh directory for your project and run it
```
$ mdkdir my-project && cd $_
$ yo drachtio
```
## Details
With this generator, you get a basic drachtio app template, and (optionally) a working test suite.  Of course, you get my opinionated choice of some packages as well:
- [pino](https://www.npmjs.com/package/pino) (for logging)
- [config](https://www.npmjs.com/package/config) (for config file management)

and the generated app will be using ES6 syntax and requiring a fairly recent-ish version of [Node.js](https://nodejs.org/)

When you run the generator it will ask you three things:
- which SIP request types you want to handle in your application?
- do you intend to use the drachtio-fsmrf module for freeswitch integration?
- would like a docker-based test suite created for you?

### A word on testing
Everyone agrees we should write test cases, but sometimes they are quite the pain to build, especially when we are talking about SIP server types of applications.  

After quite a bit of experimenting, I've settled on creating my test cases using docker and docker-compose.  (Of course, this requires you have docker installed on your laptop, but if you don't should anyways for all its other goodness).

The test suite that gets scaffolded out for you (if you request it) creates a docker-compose file (found in `./test/docker-compose-testbed.yaml`) that creates a docker network and then starts up a drachtio container as well as a [sipp](http://sipp.sourceforge.net/) container.  

I find sipp is a good way to have a simple test UAC or UAS client that can send SIP transactions to the drachtio server and application that are under test.  Additionally, if you are using the `drachtio-fsmrf` package in your app, it will throw a freeswitch container into the docker network for you as well.

As per usual, you run the tests by:
```bash
$ npm test
```

Try it out!  

You will see that test stubs have been provided for each of the SIP request methods that you indicated you want to handle in your app.  

Of course, to start with they are pretty simple (incoming INVITEs are connected either to freeswitch or the sipp UAS; other incoming request types are responded to with a 480 response), but the beauty of it is that the test scaffolding is all in place and should be pretty easy to build on from there.

You can also run code coverage reports:
```bash
$ npm run coverage
```

and lint your code:
```bash
$ npm run jslint
```

<br>

## Little help?
I'm by no means a yeoman expert, and this generator is lacking a few niceties (e.g. doesn't prompt for things like author, description, license, etc).  If anyone would like to help improve it I would love PRs.


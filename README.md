# Camomile / AngularJS frontend template

![Screensho](/screenshot.png)

This repository provides a simple [AngularJS](http://angularjs.org) template that can be used as a starting point to build web frontend based on any Camomile REST API [backend](http://github.com/camomile-project/camomile-server).

In particular,

  * the `Camomile` service makes it easy to interact with the [backend](http://github.com/camomile-project/camomile-server) by encapsulating the Camomile Javascript [client](http://github.com/camomile-project/camomile-client-javascript).
  * the `CamomileCtrl` controller takes care of user authentication.

This simple application adds another controller called `BrowseCtrl` showing how this template can be used to browse existing corpora, media and layers...

Fork, update `js/config.js` and enjoy!


## Usage


* Get the front-end and Javascript client source code:

  ```
  $ git clone git@github.com:camomile-project/camomile-angularjs-template.git
  $ cd camomile-angularjs-template
  $ git submodule init
  $ git submodule update
  ```

* Update the configuration file `js/config.js`.

  Make sure it links to your Camomile REST API [backend](http://github.com/camomile-project/camomile-server).

* Launch a web server (e.g. [http-server](https://www.npmjs.com/package/http-server))

  ```
  $ http-server
  ```

* Visit [http://localhost:8080](http://localhost:8080)

  You will need to allow cookies in your browser for this to work...

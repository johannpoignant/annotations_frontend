# Documentation

# Get started
## Dependencies
### Preface
To use this application, you'll need to install several items on your system. Everything
will be documented here, so please make sure to follow those steps carefully before
beginning to install this web application.

### List of items
- Docker
- Docker-compose
- Node.js
- Npm
- Http-server
- Camomile-server


### Explanation
[Docker](https://www.docker.com/) is a lightweight, open and secure software that wrap up a piece of software in a complete
filesystem that contains everything it needs to run: code, runtime, system tools, system libraries
– anything you can install on a server. It is needed to simplify the process of running Camomile-server.

[Docker-compose](https://www.docker.com/products/docker-compose) allows to define a multi-container application with all of its dependencies in a
 single file. Again, it will be used when installing Camomile-server, so it's a requirement to follow this tutorial.

You will need a server to host this application. I recommend a light web server,
[http-server](https://www.npmjs.com/package/http-server), which is in fact a package for npm, but
you can use any other web server, such as Apache based packages ([XAMPP](https://www.apachefriends.org/en/index.html)) or Apache server itself.

If you choose http-server, you must have [npm](https://www.npmjs.com/) installed,
and also [Node.js](https://nodejs.org/en/).

### Installing them
All the installation procedure is based on Linux environments, more precisely Ubuntu.
You may need to adapt the procedure for others distributions, or others OS.

First, let's install docker. The procedure is written [on this page](https://docs.docker.com/engine/installation/linux/ubuntulinux/).
Some values differ depending on your OS and distribution. Please check the page linked before
executing commands below.
```
# Let's update the package list.
sudo apt-get update

# Install the CA certificates
sudo apt-get install apt-transport-https ca-certifica

# Add the new GPG key
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyse

# We need to edit the /etc/apt/sources.list.d/docker.list file
sudo echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" > /etc/apt/sources.list.d/docker.list

# Update again
sudo apt-get update

# Install docker
sudo apt-get install docker-engine

# Start the daemon...
sudo service docker start

# Test the install.
sudo docker run hello-world

# If it doesn't work, restart and retry the last command.
# If it doesn't work even after that, please follow the linked tutorial from the beginning.
# https://docs.docker.com/engine/installation/linux/ubuntulinux/
```

Now, let's install docker-compose. The procedure is taken from [here](https://docs.docker.com/compose/install/).
Make sure to adapt the commands below with links [here](https://github.com/docker/compose/releases)
```
# Get the binary from the net
curl -L https://github.com/docker/compose/releases/download/1.7.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

# Add the execution rights
chmod +x /usr/local/bin/docker-compose

# Show the version installed
docker-compose --version
```

Ok, so next, Node.js. It's the easy part.
```
# Install Node.js
sudo apt-get install nodejs

# If the command node doesn't exists, maybe the alias wasn't made?
# So we create a symlink to correct that
if ! hash node 2>/dev/null; then
    sudo ln -s /usr/bin/nodejs /usr/bin/node
fi
```

Now: npm. Even easier.
```
sudo curl http://npmjs.org/install.sh | sh
```

You can install and run http-server with
```
sudo npm install -g http-server # Install
cd /home/user/folder/subfolder
http-server # Run
```

## Installation
Everything is available in this repository. To install this application and begin using it,
you have to clone or download the repository. To clone it:
```
git clone https://github.com/johannpoignant/annotations_frontend.git
```

## Structure
Structure explained here. **Bold** items are folders.

* **annotations_frontend**
  * **app**
    * **components**
      * **api**
      * **...**
    * **doc**
    * **shared**
      * **box**
      * **...**
    * app.module.js
    * app.routes.js
  * **assets**
    * **css**
    * **fonts**
    * **icons**
    * **img**
    * **js**
  * **bower_components**
    * **angular-aaaa**
    * **angular-bbbb**
    * **...**
  * index.html

**app**: Contains all the angularjs code. Inside that folder, there is **components** and **shared**.
The first one contains the components of your application, while the second one contains the reusable
components that are used across the site.

# Developpement

## Project start
If you don't take this projet to start developping and want to start from scratch, follow this
tutorial.

To get your project started using the modules here, you'll need to include some files to your main
html file, and configure your angular installation correctly.

First, you'll need several JavaScript imports (at the end of the body tag, main html file).
Check the paths and correct them if needed:
```
<!-- JQuery, mandatory -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<!-- Bootstrap, if you use it -->
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

<!-- AngularJS and plugins -->
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="bower_components/angular-route/angular-route.js"></script>
<script src="bower_components/angular-animate/angular-animate.js"></script>

<!-- Plugins needed for the modules -->
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js" charset="utf-8"></script>
<script src="bower_components/videogular/videogular.js"></script>
<script src="bower_components/videogular-controls/vg-controls.js"></script>
<script src="bower_components/d3/d3.js"></script>
<script src="bower_components/angularjs-slider/dist/rzslider.min.js"></script>
<script src="bower_components/nvd3/build/nv.d3.min.js"></script>
<script src="bower_components/angular-nvd3/dist/angular-nvd3.js"></script>
<script src="bower_components/autofill-event/src/autofill-event.js"></script>
<script src="bower_components/json-tree/json-tree.js"></script>
<script src="bower_components/json-formatter/dist/json-formatter.js"></script>

<!-- Camomile client -->
<script src="app/components/api/fermata.js"></script>
<script src="app/components/api/camomile.js"></script>

<!-- Components of your interface; include the ones you need only
<script src="app/components/general/authController.js"></script>
<script src="app/components/home/homeController.js"></script>
<script src="app/components/objects/objectsController.js"></script>
<script src="app/components/backoffice/backofficeController.js"></script>
<script src="app/components/segmentation/segmentationController.js"></script>
<script src="app/components/debug/debugController.js"></script>

<!-- Data service, mandatory -->
<script src="app/components/general/dataService.js"></script>

<!-- Directives -->
<script src="app/shared/box/boxDirective.js"></script>
<script src="app/shared/canvas/canvasDirective.js"></script>
<script src="app/shared/details/detailsDirective.js"></script>
<script src="app/shared/edit/editDirective.js"></script>
<script src="app/shared/image/imageDirective.js"></script>
<script src="app/shared/media/mediaDirective.js"></script>
<script src="app/shared/video/videoDirective.js"></script>
<script src="app/shared/loader/loaderDirective.js"></script>
<script src="app/shared/popup/popupDirective.js"></script>

<!-- Routes, config, imports -->
<script src="app/app.module.js"></script>
<script src="app/app.routes.js"></script>
```

You'll have to include some css files too:
```
<!-- Bootstrap 3 and its theme -->
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="bower_components/angular-bootstrap/ui-bootstrap-csp.css" media="screen" title="no title" charset="utf-8">

<!-- Plugins's css -->
<link rel="stylesheet" href="bower_components/angularjs-slider/dist/rzslider.css"/>
<link rel="stylesheet" href="bower_components/videogular-themes-default/videogular.css">
<link rel="stylesheet" href="bower_components/nvd3/build/nv.d3.min.css">
<link rel="stylesheet" href="bower_components/json-tree/json-tree.css">
<link rel="stylesheet" href="bower_components/json-formatter/dist/json-formatter.css" charset="utf-8">
```

The app/app.module.js is needed because it's here that we configure AngularJS behaviour.
You need to take it, and if needed, edit it.
```
angular.module('camomileApp', [
    // Routes
    'app.routes',

    // Services
    'camomileApp.services.data',

    // Controllers for components
    'camomileApp.controllers.auth',
    'camomileApp.controllers.browse',
    'camomileApp.controllers.backoffice',
    'camomileApp.controllers.objects',
    'camomileApp.controllers.segmentation',
    'camomileApp.controllers.debug',

    // Directives
    'camomileApp.directives.box',
    'camomileApp.directives.canvas',
    'camomileApp.directives.details',
    'camomileApp.directives.edit',
    'camomileApp.directives.image',
    'camomileApp.directives.video',
    'camomileApp.directives.media',
    'camomileApp.directives.loader',
    'camomileApp.directives.popup',

    // Vendor
    'jsonFormatter',
    'ui.bootstrap',
    'ngAnimate',
    'json-tree'
])
    .constant('camomileConfig', {
        backend: 'http://localhost:3000' // Maybe you launched Camomile server on another port? Then edit this line
    })
    .constant('camomileToolsConfig', {
        moduleFolder: 'app/shared/',
        refreshTime: { // Time (in ms) between each refresh of modules.
            canvas: 250,
            video: 100,
            dimensions: 1000
        } // Decreasing any number will make the modules react faster in some case, but affect performance
    })
    .factory('Camomile', ['camomileConfig', function (camomileConfig) {
        Camomile.setURL(camomileConfig.backend);
        return Camomile;
    }]);
```

The routes need to be adapted for your application.
You need to specify the controller and the view you want to use.
The routes:
```
angular.module('app.routes', [
    'ngRoute'
])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/backoffice', {
                templateUrl: 'app/components/backoffice/backofficeView.html',
                controller: 'BackofficeCtrl'
            })
            .when('/home', {
                templateUrl: 'app/components/home/homeView.html',
                controller: 'BrowseCtrl'
            })
            .when('/objects', {
                templateUrl: 'app/components/objects/objectsView.html',
                controller: 'ObjectsCtrl'
            })
            .when('/segmentation', {
                templateUrl: 'app/components/segmentation/segmentationView.html',
                controller: 'SegmentationCtrl'
            })
            .when('/debug', {
                templateUrl: 'app/components/debug/debugView.html',
                controller: 'DebugCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }]);
```

## Quick start
To develop a new interface, you'll need to know and do several things:

Know:
* An interface has a controller, and a view. (a js file, and a html one)
* Its place is in the components folder.

Do:
* Take example code
* Change it
* Enjoy

Example (Controller/JavaScript file):
```
angular.module('camomileApp.controllers.example', [
    "ngDependency" // Here any dependency this interface has
])
    .controller('BrowseCtrl', ['$scope', '$sce', 'Camomile', '$timeout', 'cappdata', // The controller
        function ($scope, $sce, Camomile, $timeout, cappdata) { // Inject objects you need
            $scope.api = {}; // The api for the modules you will use, if you need it
            $scope.infos = { // Store data about the choice of the user
                corpus: undefined,
                medium: undefined,
                layer: undefined
            };

            var refresh = function () { // Each time you will initialize the application, it must be executed
                cappdata.clean(); // Clean the factory, to avoid using old data
                cappdata.get('corpora'); // Update corpora list
                cappdata.registerObserver(updateData); // Register the controller to the changes of the data
            };

            $scope.$parent.onLogin(refresh); // On login, we need to update the data (user change)

            var updateData = function () { // Callback
                $timeout(function () {
                    $scope.cappdata = cappdata;
                    $scope.api.loader.finished();
                    //$scope.api.popup.showMessage("Chargement terminé.", 3000, "#07f");
                }, 0);
            };

            refresh();

            $scope.updateMedia = function () { // When the user selects a corpus, we update layers & annotations
                if ($scope.corpus) { // We assert that its selected
                    $scope.api.loader.loading(); // Show the loading widget
                    $scope.infos.corpus = $scope.corpus;
                    cappdata.get('layers', $scope.corpus); // Get layers
                    cappdata.get('media', $scope.corpus); // Get media
                }
            };

            $scope.updateMedium = function () { // When the user selects a medium, we load it
                cappdata.resetMedium(); // Reset the ones that exists

                if ($scope.medium) { // If its selected
                    $scope.infos.medium = $scope.medium;
                    cappdata.get('medium', $scope.medium); // Load it
                }

                if ($scope.layer) {
                    $scope.infos.layer = $scope.layer;
                }
            };
        }]);
```
Example 2 (View/HTML file):
```
<!--
Depending on what css you use (maybe Bootstrap?) you'll need to adapt the code shown below.
This code is here to show how you do it, and the layout is not explained here.
If you need layout examples, you can look in the interfaces already done in this project.
-->
<!-- Use selects with angular system to get the choice of users -->
<select ng-options="corpus._id as corpus.name for corpus in cappdata.corpora"
        ng-model="corpus"
        ng-change="updateMedia()"
        id="selectCorpus"></select>

<!-- Now use the modules to do things -->
<camomile-box infos="{{infos}}">
    <camomile-canvas></camomile-canvas>
    <camomile-media type="cappdata.mediaSelected[0].description.type" src="cappdata.mediaSelected[0].urlSecure"></camomile-media>
    <camomile-details data="true"></camomile-details>
    <camomile-annotations></camomile-annotations>
</camomile-box>

<!-- Don't forget to include secondary modules, if you need them -->
<camomile-loader api="api"></camomile-loader>
<camomile-popup api="api"></camomile-popup>
```

## Modules

### Media
This module is a combination of video and image described below.

It's a shortcut and choose the right module for the media type.
It'll work either with a video or an image, because everything is handled internally.

You can use it like this:

```
<camomile-media type="cappdata.mediaSelected[0].description.type" src="cappdata.mediaSelected[0].urlSecure"></camomile-media>
```

The type attribute is mandatory. It's 'image' or 'video'. If you use cappdata, it'll be available in
cappdata.mediaSelected[x].description.type
The src attribute is mandatory and must be a valid ressource link to a video or an image.
It also must be validated by $sce. (if you use the cappdata, everything is handled automatically)

### Video
Note: this module is used by the media module (described above).

You probably shouldn't use this one, unless you're sure that the media is a video.

The video module is useful to display a video and provide advanced controls to the user.
To use it, you need to use the camomile-video html tag.

```
<camomile-video src="browse.src"></camomile-video>
```

The src attribute is mandatory and must be a valid ressource link to a video.
It also must be validated by $sce. (if you use the cappdata, everything is handled automatically)

### Image
Note: this module is used by the media module (described above).

You probably shouldn't use this one, unless you're sure that the media is an image.

The image module is useful to display an image and provide support for the canvas.
To use it, you need to use the camomile-image html tag.

```
<camomile-image src={{browse.mediumSrc}}></camomile-image>
```

Here, the src attribute is mandatory and must be a link to an image.
You don't always need to validate by $sce, but in some case it can be rejected.
Notice the brackets if you use a link.

### Canvas
The canvas allows the user to draw on the video or image display below it. You have to
make sure that the only element below this module (in the html) is a video, image, or media
directive. It will not work, or work unexpectedly if this requirement is not fulfilled.

```
<camomile-canvas></camomile-canvas>
```

### Details
The details directive is used to display segments representig events and to display a
graph. The graph is optional.

```
<camomile-details graph="false"></camomile-details>
```

The graph attribute specifies the data to display for the graph. If set to false,
it will not be displayed.

### Edit
The edit transforms, displays and allows users to delete annotations. It uses the canvas
directive.

```
<camomile-annotations></camomile-annotations>
```

### Loader
The loader secondary module it totally optional. If you include it at the bottom of
the view of your interface, you will be able to show a spinner that indicates to the user
that some data is loading, or is being processed.

```
<camomile-loader api="api"></camomile-loader>
```

To use it in the controller, you'll have to get the api first. So add the attribute api
like in the example above. Then in your controller, declare api as an object.

```
$scope.api = {};
```

Now that you have the api set up, you can use the loader in your code.

```
$scope.api.loader.loading(); // Turns on the loader
$scope.api.loader.finished(); // Turns off the loader
```

Note that the internal behaviour is different: if you call loading twice, and then
finished only once, the loader will continue to work because maybe one component has finished
loading but the other one doesn't. Make sure that for each loading you call, a finished
call is set up in your code.

### Popup
The popup allows you to display a message to the user. Again, it is optional, but
if you want to use it, include it at the bottom of the view of your interface.

```
<camomile-popup api="api"></camomile-popup>
```

To use it in the controller, you'll have to get the api first. So add the attribute api
like in the example above. Then in your controller, declare api as an object.

```
$scope.api = {};
```

Now that you have the api set up, you can use the popup in your code.

```
$scope.api.popup.showMessage("Chargement terminé.", 3000, "#07f");
```

The first argument is the message to display.
The second one is the time that the message will stay (in milliseconds). By default, 3000.
The last is the color of the background fade. If you don't specify it, a transparent background
will be used.

# Others
Off-topic subjects here.

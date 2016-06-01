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
– anything you can install on a server. It is needed to run Camomile-server.

[Docker-compose](https://www.docker.com/products/docker-compose) allows to define a multi-container application with all of its dependencies in a
 single file. Again, it will be used when installing Camomile-server, so it's a requirement.

You will need a server to host this application. I recommend a light web server,
[http-server](https://www.npmjs.com/package/http-server), which is in fact a package for npm, but
you can use any other web server, such as Apache based packages ([XAMPP](https://www.apachefriends.org/en/index.html)) or Apache server itself.

If you choose http-server, you must have [npm](https://www.npmjs.com/) installed,
and also [Node.js](https://nodejs.org/en/).

### Installing them
All the installation procedure is based on Linux environments, more precisely Ubuntu.
You may need to adapt the procedure for others distributions, or others OS.

First, let's install docker. The procedure is written [on this page](https://docs.docker.com/engine/installation/linux/ubuntulinux/).
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

## Installation
1. Use bower to install dependencies.
2. Include all the js files in your main page.
3. Include all the css files in your main page.
4. Include the module config (camomileApp) as a dependency for your angular module.
5. Start using those directives

* Clone or download this repository first.
* Clone or download Camomile-server from [here](http://github.com/repo/ssss).
*

## JS files to include
```
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="bower_components/angular-route/angular-route.js"></script>
<script src="bower_components/angular-animate/angular-animate.js"></script>

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

<script src="app/components/api/fermata.js"></script>
<script src="app/components/api/camomile.js"></script>

<script src="app/components/general/authController.js"></script>
<script src="app/components/home/homeController.js"></script>
<script src="app/components/objects/objectsController.js"></script>
<script src="app/components/backoffice/backofficeController.js"></script>
<script src="app/components/segmentation/segmentationController.js"></script>
<script src="app/components/general/dataService.js"></script>

<!-- DIRECTIVES -->
<script src="app/shared/box/boxDirective.js"></script>
<script src="app/shared/canvas/canvasDirective.js"></script>
<script src="app/shared/details/detailsDirective.js"></script>
<script src="app/shared/edit/editDirective.js"></script>
<script src="app/shared/image/imageDirective.js"></script>
<script src="app/shared/media/mediaDirective.js"></script>
<script src="app/shared/video/videoDirective.js"></script>

<script src="app/app.module.js"></script>
<script src="app/app.routes.js"></script>
```

## CSS files to include
```
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="bower_components/angular-bootstrap/ui-bootstrap-csp.css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="bower_components/angularjs-slider/dist/rzslider.css"/>
<link rel="stylesheet" href="bower_components/videogular-themes-default/videogular.css">
<link rel="stylesheet" href="bower_components/nvd3/build/nv.d3.min.css">
<link rel="stylesheet" href="bower_components/json-tree/json-tree.css">
<link rel="stylesheet" href="bower_components/json-formatter/dist/json-formatter.css" charset="utf-8">

<link rel="stylesheet" href="assets/css/app/camomile-app-theme.css" charset="utf-8">
```

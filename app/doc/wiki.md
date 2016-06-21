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

### Details

### Edit

### ???

# Others
Off-topic subjects here.

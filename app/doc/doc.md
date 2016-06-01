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
Developpement documentation on its way.

# Others
Off-topic subjects here.
/**
 * Module angular for camomileApp; declaring the video directive
 */
angular.module('camomileApp.config.directives', [
  "camomileApp.directives.box",
  "camomileApp.directives.canvas",
  "camomileApp.directives.details",
  "camomileApp.directives.edit",
  "camomileApp.directives.image",
  "camomileApp.directives.video",
  "camomileApp.directives.media",
  "jsonFormatter"
])
.constant('camomileToolsConfig', {
  viewsFolder: 'js/modules/views/',
  refreshTime: {
    canvas: 250,
    video: 100,
    dimensions: 1000
  }
})
/*
██████   ██████  ██   ██
██   ██ ██    ██  ██ ██
██████  ██    ██   ███
██   ██ ██    ██  ██ ██
██████   ██████  ██   ██
*/

/*
 ██████  █████  ███    ██ ██    ██  █████  ███████
██      ██   ██ ████   ██ ██    ██ ██   ██ ██
██      ███████ ██ ██  ██ ██    ██ ███████ ███████
██      ██   ██ ██  ██ ██  ██  ██  ██   ██      ██
 ██████ ██   ██ ██   ████   ████   ██   ██ ███████
*/

/*
██ ███    ███  █████   ██████  ███████
██ ████  ████ ██   ██ ██       ██
██ ██ ████ ██ ███████ ██   ███ █████
██ ██  ██  ██ ██   ██ ██    ██ ██
██ ██      ██ ██   ██  ██████  ███████
*/

/*
██    ██ ██ ██████  ███████  ██████
██    ██ ██ ██   ██ ██      ██    ██
██    ██ ██ ██   ██ █████   ██    ██
 ██  ██  ██ ██   ██ ██      ██    ██
  ████   ██ ██████  ███████  ██████
*/

/*
██████  ███████ ████████  █████  ██ ██      ███████
██   ██ ██         ██    ██   ██ ██ ██      ██
██   ██ █████      ██    ███████ ██ ██      ███████
██   ██ ██         ██    ██   ██ ██ ██           ██
██████  ███████    ██    ██   ██ ██ ███████ ███████
*/

/*
███████ ██████  ██ ████████
██      ██   ██ ██    ██
█████   ██   ██ ██    ██
██      ██   ██ ██    ██
███████ ██████  ██    ██
*/

.factory('camomileData', function () {
  var facto = {};
  return facto;
});

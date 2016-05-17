# How to install
## Instructions
1. Use bower to install dependencies.
2. Include all the js files in your main page.
3. Include all the css files in your main page.
4. Include the module config (camomileApp) as a dependency for your angular module.
5. Start using those directives

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

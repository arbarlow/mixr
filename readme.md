# Mixr

Mixr, is a Node.JS compiler and pre-processor for your Javascript and CSS.

In your layout you might have something like the following..

``` html
<link rel="stylesheet" href="/css/app.css" type="text/css" charset="utf-8">
<script src="/js/app.js" type="text/javascript" charset="utf-8"></script>
```

If you are using express, you would configure your app and add Mixr's routes

``` javascript
var Mixr = require('mixr');

app.configure('development', function(){
  Mixr.addExpressRoutes(app);
});
```

Then, by default, Mixr will look for ./assets/css/app.css, ./assets/js/app.js and render that file using a syntax similar to sprockets

in app.css ..

``` css
/*
*= require bootstrap.min.css
*/

body {
  background-color: #000;
}
```

in app.js ..

``` javascript
//= require jquery.min.js

$(function(){
  // do something..
});

```

When you require something, it is looked for in the same directory, but you can also specify a path..

# Future

Mixr is designed to be quite modular, in the future, planned I have the following.

* Expanded files in development mode for easier debugging
* Integrating images and generating cacheable images, including inputting base64 input css.
* Allow any kind of processor to be done to a file, by using file extensions
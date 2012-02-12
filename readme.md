# Mixr

Mixr, is a Node.JS compiler and pre-processor for your Javascript and CSS (compatible with Express.js).

[![Build Status](https://secure.travis-ci.org/arbarlow/mixr.png)](http://travis-ci.org/arbarlow/mixr)

Mixr will take the file you ask it to and output them in to a single file, compiling any Less or CoffeeScript files given..


## Installation and setup

Lets say that you've just created a new Express app using command like the following..

``` bash
express music_library -t ejs 
cd music_library && npm install
```

Add Mixr to your package.json file..

``` javascript
  "mixr": ">= 0.0.1"
```

To create the default files and folders for Mixr, run the following..

``` bash
./node_modules/mixr/bin/mixr init
```

If you dont want Express.js' old javascripts and stylesheet, remove them..

``` bash
rm -R public/javascripts/ && rm -R public/stylesheets/
```

You would then open app.js and require Mixr..

``` javascript
  var Mixr = require('mixr');
```

Add Mixr's helpers to the configuration

``` javascript
// Configuration
app.configure(function(){
  Mixr.addHelpers(app);
});
```

To serve and compile assets on the fly in development mode, you need add the following line..

``` javascript
app.configure('development', function(){
  // Add Mixr routes for development mode only
  Mixr.addExpressRoutes(app);
});
```

In your layout add Mixr's routes..

``` html
<link rel="stylesheet" href="<%= css_path %>" type="text/css" charset="utf-8">
<script src="<%= js_path %>" type="text/javascript" charset="utf-8"></script>
```

## Usage

Now, you should have four files.

./assets/css/app.css
./assets/css/main.css
./assets/css/app.js
./assets/css/main.js

If you look inside app.css you should see the following..

``` css
/*
*= require main.css
*/
```

This is because Mixr looks at app.css and app.js and uses them as a manifest of which files to get, note that any code in these files, will not be in the end result!

You can now require single files of different types and formats, as long as they exist, Mixr should know how to handle them!

``` css
/*
*= require main.css
*= require forms.css.less
*/
```

``` javascript
//= require lib/jquery.min.js
//= require main.js
//= require something.js.coffee
```

## Production/Deployment

Although Mixr is very fast at generating the output files, it is just a waste of CPU etc to generate the assets on every request.

Therefor in production mode, it is recommended to generate the assets to a public folder and have either Nginx, Node, etc to server them normally..

To do this, run the following command on a deploy..

``` bash
./node_modules/mixr/bin/mixr compile
```

This should output your app.css and app.js to ./public

## Compilers

Mixr provides a compiler for Less and CoffeeScript by default, though they do have to be included in the projects package.json

You can create your own compilers by specifying the extension and the function which to call to compile. For example..

``` javascript
Mixr.processors['sass'] = function(string, callback){
  // Turn your string into sass here
  var output = string.turnIntoSass;
  
  // The first argument can be an error if there is one..
  callback(null, output);
};
```

## Future

Mixr is designed to be quite modular, in the future, planned I might have the following.

* Integrating images and generating cacheable images, including inputting base64 input css.
* Generating cacheable file names
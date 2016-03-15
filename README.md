<img src="https://raw.githubusercontent.com/andyburke/boxcutter/1c6b8e2fe01aa39ceb292f5b8f625f6fc17cdf77/boxcutter.png" width="192">

# Boxcutter

A utility knife for interacting with package.json

# Installation

## Local (recommended)

```sh
npm install boxcutter --save
```

## Global

```sh
sudo npm install boxcutter -g
```

# Usage

## CLI

Walks up your directory tree looking for a `package.json` file. If it finds one, it will load it
and allow you to interact with it:

```sh
Usage: boxcutter <command>
  available commands:
    get               : get a value from the package.json
    set               : set a value in the package.json
    help <command>    : get help for the specified command
  options:
    --indent <num>    : will indent json output the specified number of spaces
    --file <filename> : will use specified json as input / output file
```

Example:

```sh
> boxcutter get version
1.0.0
> boxcutter set version 1.0.1
> boxcutter get version
1.0.1
>
```

You may optionally use the `--file` flag to specify a json file other than `package.json`:
```sh
> boxcutter --file apidoc.json get name
Boxcutter
> boxcutter --file apidoc.json set name "Boxcutter API Documentation"
> boxcutter --file apidoc.json get name
Boxcutter API Documentation
```

## API

```javascript
const Boxcutter = require( 'boxcutter' );
const boxcutter = Object.assign( {}, Boxcutter.Boxcutter );

boxcutter.load( './package.json' );
console.log( boxcutter.get( 'version' ) );
```

### load( filename )

```javascript
boxcutter.load( './package.json' );
```

Loads the given package.json. Can take a relative or absolute path.

### get( key )

```javascript
const value = boxcutter.get( 'version' );
```

Gets the given key. Uses Delver to retrieve the value, so you can use dot and bracket syntax:

```javascript
const testScript = boxcutter.get( 'scripts.test' );
const firstKeyword = boxcutter.get( 'keywords[0]' );
```

### set( key, value )

```javascript
boxcutter.set( 'version', '1.0.1' );
```

Sets the given key to the value specified. Uses Delver to set the value, so you can use dot and bracket notation:

```javascript
boxcutter.set( 'scripts.test', 'tape test/*.js' );
boxcutter.set( 'keywords[0]', 'boxcutter' );
```

### save( filename[, options[, callback]] )

```javascript
boxcutter.save( './package.json', function( error ) {
    if ( error ) {
        console.error( error );
    }
} );
```

Saves the current settings to an output file. You can pass options to control the output, eg:

```javascript
boxcutter.save( './package.json', {
    json: {
        indent: 4
    }
}, function( error ) {
    if ( error ) {
        console.error( error );
    }
} );
```

If you call this method without a callback, it will execute synchronously and potentially throws, eg:

```javascript
try {
    boxcutter.save( './package.json' );
}
catch( ex ) {
    console.error( ex );
}
```

or, with options but no callback:

```javascript
try {
    boxcutter.save( './package.json', {
        json: {
            indent: 4
        }
    } );
}
catch( ex ) {
    console.error( ex );
}
```

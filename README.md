<img src="https://raw.githubusercontent.com/andyburke/boxcutter/1c6b8e2fe01aa39ceb292f5b8f625f6fc17cdf77/boxcutter.png" width="192">

# Boxcutter

A utility knife for interacting with package.json (or other json files)

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
boxcutter <command>

Commands:
  boxcutter get <key>          get the value of <key>
  boxcutter set <key> <value>  set <key> to <value>

Options:
  --version  Show version number                                       [boolean]
  --stdin    read json from stdin vs. from a file or package.json
                                                                [default: false]
  --file     the file to search up the directory path for
                                                       [default: "package.json"]
  --indent   indentation level for json output                      [default: 2]
  --save     write changes back to input file                   [default: false]
  --help     Show help                                                 [boolean]
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

You may can also specify `--stdin` to read json from stdin instead of from a file:
```sh
> echo "{ \"foo\": \"bar\" }" | boxcutter --stdin get foo
bar
> echo "{ \"foo\": \"bar\" }" | boxcutter --stdin set foo yak
{
    "foo": "yak"
}
```

## API

```javascript
const Boxcutter = require( 'boxcutter' );
const boxcutter = Boxcutter.create();

boxcutter.load( './package.json' );
console.log( boxcutter.get( 'version' ) );
```

### read( json )

```javascript
boxcutter.read( '{ "foo": "bar" }' );
```

Reads the given JSON into the instance.

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

### async save( filename[, options] )

```javascript
await boxcutter.save( './package.json' );
```

Saves the current settings to an output file. You can pass options to control the output, eg:

```javascript
await boxcutter.save( './package.json', {
    indent: 4
} );
```

### serialize( [options] )

```javascript
console.log( boxcutter.serialize( {
    indent: 4
} ) );
```

Serializes the current state to JSON with the given options.
'use strict';

const Boxcutter = require( '../index.js' );
const test = require( 'tape-async' );

test( 'API: Boxcutter', t => {
    t.ok( Boxcutter, 'Boxcutter can be required' );
    t.end();
} );

test( 'API: Object.assign( {}, Boxcutter.Boxcutter );', t => {
    const boxcutter = Boxcutter.create();
    t.ok( boxcutter, 'Boxcutter.create() produces an object' );
    t.ok( typeof boxcutter.read === 'function', '.read() exists' );
    t.ok( typeof boxcutter.load === 'function', '.load() exists' );
    t.ok( typeof boxcutter.save === 'function', '.save() exists' );
    t.ok( typeof boxcutter.serialize === 'function', '.serialize() exists' );
    t.ok( typeof boxcutter.get === 'function', '.get() exists' );
    t.ok( typeof boxcutter.set === 'function', '.set() exists' );
    t.end();
} );

test( 'API: load full path', t => {
    const path = require( 'path' );
    const boxcutter = Boxcutter.create();
    try {
        boxcutter.load( path.join( __dirname, 'package.json' ) );
    }
    catch( ex ) {
        t.fail( 'Failed to load test package.json: ' + ex );
    }

    t.ok( boxcutter.__obj && Object.keys( boxcutter.__obj ).length > 0, 'Loaded test package.json' );
    t.equal( boxcutter.__obj.name, 'boxcutter-test', 'Loaded correct package.json' );
    t.end();
} );

test( 'API: load relative', t => {
    const boxcutter = Boxcutter.create();
    try {
        boxcutter.load( './package.json' );
    }
    catch( ex ) {
        t.fail( 'Failed to load root package.json: ' + ex );
    }

    t.ok( boxcutter.__obj && Object.keys( boxcutter.__obj ).length > 0, 'Loaded root package.json' );
    t.equal( boxcutter.__obj.name, 'boxcutter', 'Loaded correct package.json' );
    t.end();
} );

test( 'API: get', t => {
    const path = require( 'path' );
    const localPackage = require( path.join( __dirname, 'package.json' ) );

    const boxcutter = Boxcutter.create();
    boxcutter.load( path.join( __dirname, 'package.json' ) );

    const version = boxcutter.get( 'version' );
    t.ok( version, 'Can get a top-level value' );
    t.equal( version, localPackage.version, 'Value is correct' );

    const config = boxcutter.get( 'config' );
    t.ok( typeof config === 'object', 'Can read a top-level object' );
    t.deepEqual( config, localPackage.config, 'Object is equal' );

    const array = boxcutter.get( 'array' );
    t.ok( Array.isArray( array ), 'Can read a top-level array' );
    t.deepEqual( array, localPackage.array, 'Array is equal' );

    const firstArrayValue = boxcutter.get( 'array[0]' );
    t.ok( firstArrayValue, 'Can read an array element' );
    t.equal( firstArrayValue, localPackage.array[ 0 ], 'Array element value is correct' );

    const secondArrayValue = boxcutter.get( 'array[ 1 ]' );
    t.ok( secondArrayValue, 'Can read an array element with spaces in the key' );
    t.equal( secondArrayValue, localPackage.array[ 1 ], 'Array element value is correct' );

    const value = boxcutter.get( 'config.test' );
    t.ok( value, 'Can read a deep value' );
    t.equal( value, localPackage.config.test, 'Deep value is equal' );

    t.end();
} );

test( 'API: set', t => {
    const path = require( 'path' );
    const boxcutter = Boxcutter.create();
    boxcutter.load( path.join( __dirname, 'package.json' ) );

    const version = boxcutter.get( 'version' );
    t.equal( version, '1.0.0', 'Version is set' );

    boxcutter.set( 'version', '1.0.1' );
    t.equal( boxcutter.__obj.version, '1.0.1', 'Can set a top-level value' );

    const updatedVersion = boxcutter.get( 'version' );
    t.equal( updatedVersion, '1.0.1', 'Can read an updated top-level value' );

    const FOO = boxcutter.get( 'config.test' );
    t.equal( FOO, 'FOO', 'Deep value is set' );

    boxcutter.set( 'config.test', 'BAR' );
    t.equal( boxcutter.__obj.config.test, 'BAR', 'Can set a deep value' );

    const BAR = boxcutter.get( 'config.test' );
    t.equal( BAR, 'BAR', 'Can read an updated deep value' );

    t.end();
} );

test( 'API: save', async t => {
    const path = require( 'path' );
    const boxcutter = Boxcutter.create();
    boxcutter.load( path.join( __dirname, 'package.json' ) );

    boxcutter.set( 'version', '1.0.1' );

    const newFilename = path.join( __dirname, 'package.updated.json' );
    await boxcutter.save( newFilename );

    const fs = require( 'fs' );
    let exists = fs.existsSync( newFilename );
    t.ok( exists, 'File saved' );

    const savedData = require( newFilename );
    t.equal( savedData.version, '1.0.1', 'Updated value was saved to new file' );

    fs.unlinkSync( newFilename );
    exists = fs.existsSync( newFilename );
    t.notOk( exists, 'Cleaned up save test file' );

    t.end();
} );

test( 'API: save (with options)', async t => {
    const path = require( 'path' );
    const boxcutter = Boxcutter.create();
    boxcutter.load( path.join( __dirname, 'package.json' ) );

    boxcutter.set( 'version', '1.0.1' );

    const newFilename = path.join( __dirname, 'package.options.json' );
    await boxcutter.save( newFilename, {
        indent: 4
    } );

    const fs = require( 'fs' );
    let exists = fs.existsSync( newFilename );
    t.ok( exists, 'File saved' );

    const savedData = require( newFilename );
    t.equal( savedData.version, '1.0.1', 'Updated value was saved to new file' );

    const contents = fs.readFileSync( newFilename );
    t.equal( contents.toString(), JSON.stringify( boxcutter.__obj, null, 4 ), 'Indent is correct' );

    fs.unlinkSync( newFilename );
    exists = fs.existsSync( newFilename );
    t.notOk( exists, 'Cleaned up save test file' );

    t.end();
} );

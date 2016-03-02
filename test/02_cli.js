'use strict';

const child_process = require( 'child_process' );
const test = require( 'tape' );

const pkg = require( '../package.json' );
const help = require( '../help.json' );

let cli = null;

test( 'CLI: boxcutter package.json', function( t ) {
    t.ok( pkg, 'Read boxcutter pacakge.json' );
    t.ok( pkg.bin, 'Has bin' );
    t.ok( pkg.bin.boxcutter, 'Has boxcutter cli' );

    const path = require( 'path' );
    cli = path.join( __dirname, '..', pkg.bin.boxcutter );
    t.ok( cli, 'Got cli path' );

    t.end();
} );

test( 'CLI: execute without arguments', function( t ) {

    const result = child_process.spawnSync( process.execPath, [ cli ] );
    t.error( result.error, 'Executed' );
    t.ok( result.stderr && result.stderr.toString().length, 'Outputs usage' );
    t.equal( result.stderr.toString().trim(), help.usage.concat( [
        '',
        'Not enough non-option arguments: got 0, need at least 1'
    ] ).join( '\n' ), 'Usage is correct' );

    t.end();
} );

test( 'CLI: execute help with no arguments', function( t ) {

    const result = child_process.spawnSync( process.execPath, [ cli, 'help' ] );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Outputs help' );
    t.equal( result.stdout.toString().trim(), help.commands[ 'unknown command' ].join( '\n' ), 'Help output is correct' );

    t.end();
} );

test( 'CLI: execute help on unknown command', function( t ) {

    const result = child_process.spawnSync( process.execPath, [ cli, 'help', 'foo' ] );
    t.error( result.error, 'Executed' );
    t.ok( result.stderr && result.stderr.toString().length, 'Outputs help error' );
    t.equal( result.stderr.toString().slice( 0, -1 ), [ 'Unknown command: foo' ].concat( help.commands[ 'unknown command' ] ).join( '\n' ), 'Help error output is correct' );

    t.end();
} );

test( 'CLI: execute help on get', function( t ) {

    const result = child_process.spawnSync( process.execPath, [ cli, 'help', 'get' ] );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Outputs help' );
    t.equal( result.stdout.toString().slice( 0, -1 ), help.commands.get.join( '\n' ), 'Help output is correct' );

    t.end();
} );

test( 'CLI: execute help on set', function( t ) {

    const result = child_process.spawnSync( process.execPath, [ cli, 'help', 'set' ] );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Outputs help' );
    t.equal( result.stdout.toString().slice( 0, -1 ), help.commands.set.join( '\n' ), 'Help output is correct' );

    t.end();
} );

test( 'CLI: execute "get version"', function( t ) {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'version' ], {
        cwd: __dirname
    } );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), localPackage.version, 'Outputs correct version' );

    t.end();
} );

test( 'CLI: execute "get config"', function( t ) {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'config' ], {
        cwd: __dirname
    } );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), JSON.stringify( localPackage.config, null, 2 ), 'Outputs correct config' );

    t.end();
} );

test( 'CLI: execute "get config.test"', function( t ) {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'config.test' ], {
        cwd: __dirname
    } );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), localPackage.config.test, 'Outputs correct config.test value' );

    t.end();
} );

test( 'CLI: execute "get array"', function( t ) {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'array' ], {
        cwd: __dirname
    } );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), JSON.stringify( localPackage.array, null, 2 ), 'Outputs correct array value' );

    t.end();
} );

test( 'CLI: execute "get array[0]"', function( t ) {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'array[0]' ], {
        cwd: __dirname
    } );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), '' + localPackage.array[ 0 ], 'Outputs correct value' );

    t.end();
} );

test( 'CLI: execute "get \"array[ 1 ]\""', function( t ) {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'array[ 1 ]' ], {
        cwd: __dirname
    } );
    t.error( result.error, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), '' + localPackage.array[ 1 ], 'Outputs correct value' );

    t.end();
} );

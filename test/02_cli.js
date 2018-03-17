'use strict';

const child_process = require( 'child_process' );
const test = require( 'tape-async' );

const pkg = require( '../package.json' );

let cli = null;

test( 'CLI: boxcutter package.json', t => {
    t.ok( pkg, 'Read boxcutter package.json' );
    t.ok( pkg.bin, 'Has bin' );
    t.ok( pkg.bin.boxcutter, 'Has boxcutter cli' );

    const path = require( 'path' );
    cli = path.join( __dirname, '..', pkg.bin.boxcutter );
    t.ok( cli, 'Got cli path' );

    t.end();
} );

test( 'CLI: execute without arguments', t => {

    const result = child_process.spawnSync( process.execPath, [ cli ] );
    t.ok( result.status, 'Executed' );
    t.ok( result.stderr && result.stderr.toString().length, 'Outputs error' );

    t.end();
} );

test( 'CLI: execute help with no arguments', t => {

    const result = child_process.spawnSync( process.execPath, [ cli, 'help' ] );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Outputs help' );

    t.end();
} );

test( 'CLI: execute "get version"', t => {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'version' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), localPackage.version, 'Outputs correct version' );

    t.end();
} );

test( 'CLI: execute "get config"', t => {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'config' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), JSON.stringify( localPackage.config, null, 2 ), 'Outputs correct config' );

    t.end();
} );

test( 'CLI: execute "get config.test"', t => {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'config.test' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), localPackage.config.test, 'Outputs correct config.test value' );

    t.end();
} );

test( 'CLI: execute "get array"', t => {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'array' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), JSON.stringify( localPackage.array, null, 2 ), 'Outputs correct array value' );

    t.end();
} );

test( 'CLI: execute "get array[ 0 ]"', t => {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'array[ 0 ]' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), '' + localPackage.array[ 0 ], 'Outputs correct value' );

    t.end();
} );

test( 'CLI: execute "get array[ 1 ]"', t => {

    const localPackage = require( './package.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, 'get', 'array[ 1 ]' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), '' + localPackage.array[ 1 ], 'Outputs correct value' );

    t.end();
} );

test( 'CLI: execute "--file another_file.json get version"', t => {

    const jsonFile = require( './another_file.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, '--file', 'another_file.json', 'get', 'version' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), jsonFile.version, 'Outputs correct version' );

    t.end();
} );

test( 'CLI: execute "--file another_file.json get test.config"', t => {

    const jsonFile = require( './another_file.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, '--file', 'another_file.json', 'get', 'test.config' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), JSON.stringify( jsonFile.test.config, null, 2 ), 'Outputs correct config' );

    t.end();
} );

test( 'CLI: execute "--file another_file.json get test.config.test"', t => {

    const jsonFile = require( './another_file.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, '--file', 'another_file.json', 'get', 'test.config.test' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), jsonFile.test.config.test, 'Outputs correct test.config.test value' );

    t.end();
} );

test( 'CLI: execute "--file another_file.json get test.array"', t => {

    const jsonFile = require( './another_file.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, '--file', 'another_file.json', 'get', 'test.array' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), JSON.stringify( jsonFile.test.array, null, 2 ), 'Outputs correct array value' );

    t.end();
} );

test( 'CLI: execute "--file another_file.json get test.array[ 0 ]"', t => {

    const jsonFile = require( './another_file.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, '--file', 'another_file.json', 'get', 'test.array[ 0 ]' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), '' + jsonFile.test.array[ 0 ], 'Outputs correct value' );

    t.end();
} );

test( 'CLI: execute "--file another_file.json get test.array[ 1 ]"', t => {

    const jsonFile = require( './another_file.json' );
    const result = child_process.spawnSync( process.execPath, [ cli, '--file', 'another_file.json', 'get', 'test.array[ 1 ]' ], {
        cwd: __dirname
    } );
    t.error( result.status, 'Executed' );
    t.ok( result.stdout && result.stdout.toString().length, 'Gets value' );
    t.equal( result.stdout.toString().slice( 0, -1 ), '' + jsonFile.test.array[ 1 ], 'Outputs correct value' );

    t.end();
} );

test( 'CLI: calling nonexistent file fails' , t => {

    const result = child_process.spawnSync( process.execPath, [ cli, '--file', 'nonexistent.json', 'get', 'test.array[ 1 ]' ], {
        cwd: __dirname
    } );

    t.ok( result.status, 'Error when called with nonexistent file' );

    t.end();
} );

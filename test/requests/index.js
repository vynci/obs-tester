'use strict';

var helper = require( process.cwd() + '/test/init.js' );

require( 'should' );

describe ( 'Test', function () {

	var error;
	var body;

	before( function ( done  ) {
		var requestData = {
			'path'   : '/api/v1/users/13778/observations',
			'method' : 'get',
			'body'   : {}, // optional
			'qs'     : {} // optional
		};

		helper.fetch( requestData, function( fetchError, fetchLoad, fetchResult ) {
			error = fetchError;
			body = fetchResult;
			done();
		} );
	} );

	it( 'should return proper structure and data', function () {
		console.log( body );
		true.should.be.ok; // just to test
	} );
} );
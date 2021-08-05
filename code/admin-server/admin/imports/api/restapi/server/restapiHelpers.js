/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import SimpleSchema from 'simpl-schema';
import logger from '../../logger';

/**
 * Check if the request has a valid auth token
 * in case of error returns error object { statusCode , message }
 * @param {Object} request
 * @returns {Object} - { error }
 */
export function checkApiKey(request) {
    const { authToken } = request;

    if (!authToken) {
        const error = new Meteor.Error('restapi.missingApiKey', 'Please provide a valid api key.');
        error.statusCode = 401;
        return { error };
    }

    const application = Meteor.users.findOne(authToken);
    if (_.isEmpty(application)) {
        const error = new Meteor.Error(
            'restapi.applicationDoesNotExist',
            'This api key does not correspond to any application.'
        );
        error.statusCode = 403;
        return { error };
    }
    // if (!application.active) {
    //     const error = new Meteor.Error(
    //         'restapi.applicationIsDisabled',
    //         'This api key does not correspond to an active application.'
    //     );
    //     error.statusCode = 403;
    //     return { error };
    // }

    return { error: null };
}

/**
 * Handle Http errors and convert into json object
 * End request and response with http error
 *
 * @param {Object} err - Error object
 * @param {Object} request - http request
 * @param {Object} response - http response
 * @param {Object} next - Middleware ( optional )
 * @return null
 */
export function handleErrorAsJsonMiddleware(err, request, response, next) {
    const apiKey = request.headers && request.headers.authorization;
    const errorString = err.error || err.name || err.code;

    const [finishTime] = process.hrtime(request.startTime);
    logger.error(
        `handleErrorAsJsonMiddleware.${errorString} (timeElapsed:${finishTime}s) Message:${err.message}`,
        { apiKey, body: request.body, stack: err.stack }
    );

    if (err.sanitizedError && err.sanitizedError.errorType === 'Meteor.Error') {
        if (!err.sanitizedError.statusCode) {
            err.sanitizedError.statusCode = err.statusCode || 400;
        }

        err = err.sanitizedError;
    } else if (err.errorType === 'Meteor.Error') {
        if (!err.statusCode) err.statusCode = 400;
    } else {
        // Hide internal error details
        // XXX could check node_env here and return full
        // error details if development
        const statusCode = err.statusCode;
        err = new Error();
        err.statusCode = statusCode;
    }
    let body = {
        error: err.error || 'apiError',
        reason: err.reason || 'Somehting went wrong, please contact support.',
        details: err.details,
        data: err.data
    };

    body = JSON.stringify(body, null, 2);

    response.statusCode = err.statusCode || 500;
    response.setHeader('Content-Type', 'application/json');
    response.write(body);
    response.end();
}

export function checkForParams({ schema, params, callSite = 'restapi' }) {
    const validationContext = new SimpleSchema(schema).newContext();
    validationContext.validate(params);
    const errors = validationContext.validationErrors();

    if (errors.length) {
        const [{ name }] = errors;

        const newError = new Meteor.Error(
            `${callSite}.params`,
            validationContext.keyErrorMessage(name)
        );
        newError.statusCode = 400;
        throw newError;
    }
}

// https://github.com/stubailo/meteor-rest/pull/146/commits/dac077c0d7098c11d25c568f1e68e7bbe90aaa38
/**
 * Cors handler
 * @param {Object} request - http request
 * @param {Object} response  - Http response
 * @param {Object} next - Optional middleware
 */
export function handleCors(request, response, next) {
    const origin =
        request.headers && request.headers.origin && request.headers.origin !== 'null'
            ? request.headers.origin
            : '*';

    const newHeaders = {
        CORSTEST: origin,
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
            'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true'
    };
    if (!response.headers) response.headers = {};
    Object.keys(newHeaders).forEach(k => {
        if (!response.headers[k]) {
            response.headers[k] = newHeaders[k];
            response.setHeader(k, newHeaders[k]);
        }
    });
    next();
}

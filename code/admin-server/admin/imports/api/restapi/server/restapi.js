import { JsonRoutes } from 'meteor/simple:json-routes';
import { WebApp } from 'meteor/webapp';
import Resolvers from './generalApiResolvers.js';
import {
    checkApiKey,
    handleErrorAsJsonMiddleware,
    handleCors
} from '/imports/api/restapi/server/restapiHelpers.js';

import logger from '../../logger';

const ACTIVE_REST_ROUTE = '/rest/v1';

// enable middleware
JsonRoutes.Middleware.use(ACTIVE_REST_ROUTE, JsonRoutes.Middleware.parseBearerToken);
JsonRoutes.Middleware.use(ACTIVE_REST_ROUTE, handleCors);
JsonRoutes.ErrorMiddleware.use(handleErrorAsJsonMiddleware);

const getTodayCounterMeasure = `${ACTIVE_REST_ROUTE}/counter/:counterId/measure`;

// Params: none
// o={headers:{'Authorization': 'Bearer ' + token}}
// res = HTTP.get('http://localhost:3003/rest/v1/counter/1/measure',o)

/**
 * @url rest/v1/counter/:counterId/measure
 * @Method GET
 * @return {Object} - { data: todayCounterMeasure }
 */
JsonRoutes.add('get', getTodayCounterMeasure, function(req, res) {
    logger.debug(`restapi.get.measures.calledBy.${req.authToken}`);
    // const { error } = checkApiKey(req); // check if token is valid
    // if (error) throw error;

    const { counterId } = req.params;

    // get user pairs
    const todayCounterMeasure = Resolvers.getTodayCounterMeasure({ counterId });
    JsonRoutes.sendResult(res, { data: todayCounterMeasure });
});

const createCounterMeasure = `${ACTIVE_REST_ROUTE}/counter/:counterId/measure`;
JsonRoutes.add('post', createCounterMeasure, function(req, res) {
    logger.debug(`restapi.create.measures.calledBy.${req.authToken}`);

    // const { error } = checkApiKey(req); // check if token is valid
    // if (error) throw error;

    const { counterId } = req.params;
    // console.log({ req });
    console.log({ f: req.file });
    console.log({ fs: req.files });

    logger.debug('get offer price params ', { data: req.body, counterId });

    const data = Resolvers.createMeasure({ data: req.body, counterId });
    logger.debug('offer price %o', data);

    JsonRoutes.sendResult(res, { data });
});

// // unknow endpoints
// WebApp.connectHandlers.use((req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.writeHead(404);
//     res.end(
//         JSON.stringify(
//             {
//                 error: 'unknownEndpoint',
//                 reason: 'This endpoint is not part of our api.'
//             },
//             null,
//             2
//         )
//     );
// });

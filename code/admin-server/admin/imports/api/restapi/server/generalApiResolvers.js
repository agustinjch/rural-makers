import measuresFunctions from '../../measures/server/functions';

/**
 * Get today counter measure if any
 * @param {String} counterId - Meteor user id
 * @returns {Object} - validPairs is a array of
 */
export function getTodayCounterMeasure({ counterId }) {
    const todayMeasure = measuresFunctions.getTodayCounterMeasure({ counterId });
    return todayMeasure;
}

/**
 * Creaet today counter measure if any
 * @param {String} counterId - Counter id
 * @param {Object} img - IMG to be analyzed
 * @returns {Object} - OK || not OK
 */
export function createMeasure({ counterId, data }) {
    const createdMesure = measuresFunctions.createMeasure({ counterId, data });
    return createdMesure;
}

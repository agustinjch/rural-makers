import { Measures } from '../collections';
import { Counters } from '../../counters/collections';
import { Usages } from '../../usages/collections';
import moment from 'moment';
import AWS from 'aws-sdk';
import logger from '../../logger';

export function removeDataless({ measureId }) {
    const measure = Measures.findOne({ _id: measureId });

    if (!measure) return;

    const s3 = new AWS.S3({
        accessKeyId: '',
        secretAccessKey: ''
    });
    const params = { Bucket: measure.bucket, Key: measure.path };
    Promise.await(s3.deleteObject(params).promise());
    Measures.remove({ _id: measureId });

    return 'ok';
}

export function addDataToDataless({ measureId, data }) {
    const measure = Measures.findOne({ _id: measureId });

    if (!measure) return;

    const updateOptions = {
        $set: {
            data
        }
    };
    Measures.update(measure._id, updateOptions);

    const s3 = new AWS.S3({
        accessKeyId: '',
        secretAccessKey: ''
    });
    const params = { Bucket: measure.bucket, Key: measure.path };
    Promise.await(s3.deleteObject(params).promise());

    // update the usage
    const lastUsages = Measures.find(
        { counterId: measure.counterId, data: { $exists: true } },
        { sort: { createdAt: -1 }, limit: 2 }
    ).fetch();
    console.log({ lastUsages });

    let liters =
        lastUsages.length < 2
            ? data
            : parseFloat(lastUsages[0].data) - parseFloat(lastUsages[1].data);
    const insertOptions = {
        date: measure.date,
        liters,
        counterId: measure.counterId
    };
    Usages.insert(insertOptions);

    return 'ok';
}

export function getTodayCounterMeasure({ counterId }) {
    logger.debug('Create measure called');

    const counter = Counters.findOne({ id: counterId });
    if (!counter) {
        throw new Meteor.Error('Measures.createMeasure', 'No valid counter');
    }

    const todayDate = moment()
        .utc()
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate();

    const existingTodayMeasure = Measures.findOne({ date: todayDate, counterId });
    if (existingTodayMeasure) {
        return existingTodayMeasure.data;
    }
    return null;
}

// Data is the image itself
export function createMeasure({ counterId, data }) {
    logger.debug('Create measure called');

    const counter = Counters.findOne({ id: counterId });
    if (!counter) {
        throw new Meteor.Error('Measures.createMeasure', 'No valid counter');
    }

    const { bucket, pic_path } = data;

    const todayDate = moment()
        .utc()
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate();
    // const yesterdayDate = moment()
    //     .utc()
    //     .hour(0)
    //     .minute(0)
    //     .second(0)
    //     .millisecond(0)
    //     .subtract(1, 'day')
    //     .toDate();
    //
    // const existingTodayMeasure = Measures.findOne({ date: todayDate, counterId });
    // if (existingTodayMeasure) {
    //     return 'OK';
    // }
    //
    // const lastExistingMeasure = Measures.findOne({ counterId }, { sort: { date: -1 } });

    const insertOptions = {
        counterId,
        bucket,
        path: pic_path,
        url: `https://${bucket}.s3.us-east-1.amazonaws.com/${pic_path}`,
        date: todayDate
    };
    Measures.insert(insertOptions);

    // if (!lastExistingMeasure) {
    //     logger.warn('Measures.createMeasure not existing any data before today');
    //     return 'OK';
    // }

    // Do the calculation of the usage based on yesterday data
    // if lastExistingMeasure.date !== yesterdayDate , we have missing data
    // if (lastExistingMeasure.date.getTime() !== yesterdayDate.getTime()) {
    //     logger.warn('Measures.createMeasure missing data in counter', { counter });
    // }
    //
    // const increasedSpent = parseFloat(data) - parseFloat(lastExistingMeasure.data);
    //
    // const existingUsage = Usages.findOne({ counterId, date: todayDate });
    //
    // if (existingUsage) {
    //     const updateUsageOptions = {
    //         $set: {
    //             liters: increasedSpent
    //         }
    //     };
    //     Usages.update(existingUsage._id, updateUsageOptions);
    // } else {
    //     const usageInsertOptions = {
    //         counterId,
    //         liters: increasedSpent,
    //         date: todayDate
    //     };
    //     Usages.insert(usageInsertOptions);
    // }

    return 'OK';
}

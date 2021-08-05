import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
// import faker from 'faker';
import { Currencies } from '../collections';

Factory.define('currency', Currencies, {
    versions() {
        return Random.number();
    },
    measureHourDifference() {
        return '8';
    },
    createdAt() {
        return new Date();
    }
});

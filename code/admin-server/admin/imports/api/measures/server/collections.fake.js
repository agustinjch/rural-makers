import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import { Payments } from '../collections';

Factory.define('payment', Payments, {
    counterId() {
        return faker.random.uuid();
    },
    timestamp() {
        return 12312312312;
    },
    data() {
        return '144,322';
    },
    date() {
        return new Date();
    }
});

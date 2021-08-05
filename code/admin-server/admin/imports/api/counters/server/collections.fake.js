import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
// import faker from 'faker';
import { Currencies } from '../collections';

Factory.define('currency', Currencies, {
    address() {
        return 'Calle de la guasa';
    },
    decimals() {
        return Random.number();
    },
    id() {
        return '000105';
    },
    picture() {
        return '2222';
    },
    active() {
        return true;
    },
    hasRelative() {
        return true;
    },
    hasAbsolute() {
        return true;
    },
    createdAt() {
        return new Date();
    }
});

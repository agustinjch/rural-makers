/* eslint-disable no-empty-pattern */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import userFunctions from './functions';

import '../collections.fake'; // to access fake data with factory

const rB = () => {
  resetDatabase();
};

describe('User functions', function() {});

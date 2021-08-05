// import { resetDatabase } from 'meteor/xolvio:cleaner';
// import { Factory } from 'meteor/dburles:factory';
// import { expect } from 'chai';
// import {
//     getValidPairs,
//     getOfferPrice,
//     generatePayment,
//     checkPaymentStatus,
//     cancelPayment
// } from './functions.js';
//
// import { Payments } from '../collections.js';
//
// import './collections.fake';
// import '/imports/api/users/server/collections.fake.js';
// import '/imports/api/currencies/server/collections.fake.js';
//
// describe('Payments functions', () => {
//     describe('getValidPairs', () => {
//         beforeEach(() => {
//             resetDatabase();
//         });
//
//         it('Throws error when no user', () => {
//             const undefinedError = () =>
//                 getValidPairs({
//                     userId: 'test'
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.getValidPairs.noUser');
//         });
//
//         it('Throws error when no set up', () => {
//             const user = Factory.create('user');
//             const undefinedError = () =>
//                 getValidPairs({
//                     userId: user._id
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.getValidPairs.noSetup');
//         });
//
//         it('Throws error when no valid currency', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             const DI = {
//                 marketsFunctions: {
//                     getMarkets: () => {
//                         return [];
//                     }
//                 }
//             };
//
//             // TODO - error when no currencies
//             const undefinedError = () =>
//                 getValidPairs({
//                     userId: user._id,
//                     DI
//                 });
//             expect(undefinedError).to.throw('paymentsFunctions.getValidPairs.noCurrencies');
//         });
//
//         it('Works when valid data', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//             Factory.create('currency', { active: true, symbol: 'BTC' });
//
//             const DI = {
//                 marketsFunctions: {
//                     getMarkets: () => {
//                         return [
//                             {
//                                 quote: 1,
//                                 icon: 'test',
//                                 symbol: 'BTC',
//                                 minLimit:'0.1',
//                                 maxLimit:'1000',
//                             }
//                         ];
//                     }
//                 }
//             };
//
//             // TODO - error when no currencies
//             const validMarkets = getValidPairs({
//                 userId: user._id,
//                 DI
//             });
//
//             expect(validMarkets).to.be.an('array');
//             expect(validMarkets.length).to.be.equal(1);
//             expect(validMarkets[0].symbol).to.be.equal('BTC');
//             expect(validMarkets[0].icon).to.be.an('string');
//             expect(validMarkets[0].minLimit).to.be.an('string');
//             expect(validMarkets[0].maxLimit).to.be.an('string');
//         });
//
//
//     });
//
//
//
//     describe('getOfferPrice', () => {
//         beforeEach(() => {
//             resetDatabase();
//         });
//
//         it('Throws error when no user', () => {
//             const undefinedError = () =>
//                 getOfferPrice({
//                     userId: 'test',
//                     symbol: 'BTC',
//                     amount: 20
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.getOfferPrice.noUser');
//         });
//
//         it('Throws error when no set up', () => {
//             const user = Factory.create('user');
//             const undefinedError = () =>
//                 getOfferPrice({
//                     userId: user._id,
//                     symbol: 'BTC',
//                     amount: 20
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.getOfferPrice.noSetup');
//         });
//
//         it('Throws error when no valid pair', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             const DI = {
//                 swFunctions: {
//                     getMarketInfo: () => {
//                         return {
//                             data: [
//                                 {
//                                     pair: 'BTC-UST',
//                                     quote: 1
//                                 }
//                             ]
//                         };
//                     }
//                 }
//             };
//
//             // TODO - error when no currencies
//             const undefinedError = () =>
//                 getOfferPrice({
//                     userId: user._id,
//                     symbol: 'BTC2',
//                     amount: 20,
//                     DI
//                 });
//             expect(undefinedError).to.throw('paymentsFunctions.getOfferPrice.noValidPair');
//         });
//
//         it('Returns market when all good', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             const DI = {
//                 swFunctions: {
//                     getMarketInfo: () => {
//                         return {
//                             data: [
//                                 {
//                                     pair: 'BTC-UST',
//                                     quote: 1,
//                                     signature: 'signature'
//                                 }
//                             ]
//                         };
//                     }
//                 }
//             };
//
//             const offerPrice = getOfferPrice({
//                 userId: user._id,
//                 symbol: 'BTC',
//                 amount: 20,
//                 DI
//             });
//             expect(offerPrice).to.be.an('object');
//             expect(offerPrice.pair).to.be.equal('BTC-UST');
//             expect(offerPrice.quote).to.be.equal(1);
//             expect(offerPrice.price).to.be.equal(20);
//             expect(offerPrice.signature).to.be.equal('signature');
//         });
//     });
//
//     describe('generatePayment', () => {
//         beforeEach(() => {
//             resetDatabase();
//         });
//
//         it('Throws error when no user', () => {
//             const undefinedError = () =>
//                 generatePayment({
//                     userId: 'test',
//                     symbol: 'symbol',
//                     referenceId: 'referenceId',
//                     userIp: '123.23.23.22',
//                     fromAmount: 1
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.generatePayment.noUser');
//         });
//
//         it('Throws error when no set up', () => {
//             const user = Factory.create('user');
//             const undefinedError = () =>
//                 generatePayment({
//                     userId: user._id,
//                     symbol: 'symbol',
//                     referenceId: 'referenceId',
//                     userIp: '123.23.23.22',
//                     fromAmount: 1
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.generatePayment.noSetup');
//         });
//
//         it('Throws error when no valid symbol', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             const undefinedError = () =>
//                 generatePayment({
//                     userId: user._id,
//                     symbol: 'symbol',
//                     referenceId: 'referenceId',
//                     userIp: '123.23.23.22',
//                     fromAmount: 1
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.generatePayment.noValidAsset');
//         });
//
//         it('Throws error when existing payment', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             Factory.create('currency', { active: true, symbol: 'BTC' });
//
//             Factory.create('payment', {
//                 userId: user._id,
//                 referenceId: 'referenceId',
//                 userIp: '123.23.23.22',
//                 pair: 'BTC-UST',
//                 fromAmount: 1,
//                 toAmount: 1,
//                 status: 'waiting',
//                 orderId:'sw-order-id'
//             });
//
//             const DI = {
//                 swFunctions: {
//                     getMarketInfo: () => {
//                         return {
//                             data: [
//                                 {
//                                     pair: 'BTC-UST',
//                                     quote: 1
//                                 }
//                             ]
//                         };
//                     }
//                 }
//             };
//
//             // TODO - error when no currencies
//             const undefinedError = () =>
//                 generatePayment({
//                     userId: user._id,
//                     symbol: 'BTC',
//                     referenceId: 'referenceId',
//                     userIp: '123.23.23.22',
//                     fromAmount: 1,
//                     DI
//                 });
//             expect(undefinedError).to.throw('paymentsFunctions.generatePayment.existingPayment');
//         });
//
//         it('Returns market when all good', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             Factory.create('currency', { active: true, symbol: 'BTC' });
//
//             const DI = {
//                 swFunctions: {
//                     getMarketInfo: () => {
//                         return {
//                             data: [
//                                 {
//                                     pair: 'BTC-UST',
//                                     quote: 1
//                                 }
//                             ]
//                         };
//                     },
//                     createOrder: ({}) => {
//                         return {
//                             data: {
//                                 orderId: 'orderId',
//                                 exchangeAddress: 'exchangeAddress'
//                             }
//                         };
//                     }
//                 },
//                 jobFunctions: {
//                     addJob: ({}) => {}
//                 }
//             };
//
//             const generatedPayment = generatePayment({
//                 userId: user._id,
//                 symbol: 'BTC',
//                 referenceId: 'referenceId',
//                 userIp: '123.23.23.22',
//                 fromAmount: 1,
//                 DI
//             });
//             console.log({generatedPayment});
//             expect(generatedPayment).to.be.an('object');
//             expect(generatedPayment.receivingAddress).to.be.equal('exchangeAddress');
//             expect(generatedPayment.amount).to.be.equal(1);
//             expect(generatedPayment.referenceId).to.be.equal('referenceId');
//             expect(generatedPayment.status).to.be.equal('waiting');
//             expect(generatedPayment.symbol).to.be.equal('BTC');
//
//             const payment = Payments.findOne(generatedPayment.paymentId);
//             console.log({payment})
//             expect(payment).to.be.an('object');
//             expect(payment.fromAmount).to.be.equal(generatedPayment.amount);
//             expect(payment.address).to.be.equal(generatedPayment.receivingAddress);
//             expect(payment.pair).to.be.equal(generatedPayment.symbol+"-"+user.wallet.symbol);
//         });
//
//         it('Returns market when create a payment converting currency inside', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             Factory.create('currency', { active: true, symbol: 'BTC' });
//
//             const DI = {
//                 swFunctions: {
//                     getMarketInfo: () => {
//                         return {
//                             data: [
//                                 {
//                                     pair: 'BTC-UST',
//                                     quote: 1
//                                 }
//                             ]
//                         };
//                     },
//                     createOrder: ({}) => {
//                         return {
//                             data: {
//                                 orderId: 'orderId',
//                                 exchangeAddress: 'exchangeAddress'
//                             }
//                         };
//                     }
//                 },
//                 jobFunctions: {
//                     addJob: ({}) => {}
//                 },
//                 marketsFunctions:{
//                     getMarkets: () => {
//                         return [
//                                 {
//                                     symbol:'BTC',
//                                     quote:1,
//                                     icon: `https://media.switchain.com/icons-png/btc.png`,
//                                     digits: 6,
//                                     maxLimit:0.1,
//                                     minLimit:1000,
//                                 }
//                             ]
//
//                     },
//                 }
//             };
//
//             const generatedPayment = generatePayment({
//                 userId: user._id,
//                 symbol: 'BTC',
//                 referenceId: 'referenceId',
//                 userIp: '123.23.23.22',
//                 fromAmount: 1,
//                 fromUserSymbol:true,
//                 DI
//             });
//             expect(generatedPayment).to.be.an('object');
//             expect(generatedPayment.receivingAddress).to.be.equal('exchangeAddress');
//             expect(generatedPayment.amount).to.be.equal(1);
//             expect(generatedPayment.referenceId).to.be.equal('referenceId');
//             expect(generatedPayment.status).to.be.equal('waiting');
//             expect(generatedPayment.symbol).to.be.equal('BTC');
//
//             const payment = Payments.findOne(generatedPayment.paymentId);
//             expect(payment).to.be.an('object');
//             expect(payment.fromAmount).to.be.equal(generatedPayment.amount);
//             expect(payment.address).to.be.equal(generatedPayment.receivingAddress);
//             expect(payment.pair).to.be.equal(generatedPayment.symbol+"-"+user.wallet.symbol);
//         });
//     });
//
//     describe('checkPaymentStatus', () => {
//         beforeEach(() => {
//             resetDatabase();
//         });
//
//         it('Throws error when no user', () => {
//             const undefinedError = () =>
//                 checkPaymentStatus({
//                     userId: 'test',
//                     paymentId: '12345'
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.checkPaymentStatus.noUser');
//         });
//
//         it('Throws error when no set up', () => {
//             const user = Factory.create('user');
//             const undefinedError = () =>
//                 checkPaymentStatus({
//                     userId: user._id,
//                     paymentId: '12345'
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.checkPaymentStatus.noSetup');
//         });
//
//         it('Throws error when no existing payment', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             // TODO - error when no currencies
//             const undefinedError = () =>
//                 checkPaymentStatus({
//                     userId: user._id,
//                     paymentId: '1234'
//                 });
//             expect(undefinedError).to.throw('paymentsFunctions.checkPaymentStatus.noPayment');
//         });
//
//         it('Returns market when all good', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             const payment =  Factory.create('payment', {
//                 userId: user._id,
//                 referenceId: 'referenceId',
//                 userIp: '123.23.23.22',
//                 pair: 'BTC-UST',
//                 fromAmount: 1,
//                 toAmount: 1,
//                 status: 'waiting',
//                 orderId:'sw-order-id'
//             });
//
//             const DI = {
//                 swFunctions: {
//                     getOrderInfo: ({}) => {
//                         return {
//                             data: {
//                                 status: 'received'
//                             }
//                         };
//                     }
//                 }
//             };
//
//             const paymentStatus = checkPaymentStatus({
//                 userId: user._id,
//                 paymentId: payment._id,
//                 DI
//             });
//             expect(paymentStatus.status).to.be.equal('received');
//             const updatedPayment = Payments.findOne(payment._id);
//             expect(updatedPayment.status).to.be.equal('received');
//         });
//     });
//
//     describe('cancelPayment', () => {
//         beforeEach(() => {
//             resetDatabase();
//         });
//
//         it('Throws error when no user', () => {
//             const undefinedError = () =>
//                 cancelPayment({
//                     userId: 'test',
//                     paymentId: '12345'
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.cancelPayment.noUser');
//         });
//
//         it('Throws error when no set up', () => {
//             const user = Factory.create('user');
//             const undefinedError = () =>
//                 cancelPayment({
//                     userId: user._id,
//                     paymentId: '12345'
//                 });
//
//             expect(undefinedError).to.throw('paymentsFunctions.cancelPayment.noSetup');
//         });
//
//         it('Throws error when no existing payment', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//
//             // TODO - error when no currencies
//             const undefinedError = () =>
//                 cancelPayment({
//                     userId: user._id,
//                     paymentId: '1234'
//                 });
//             expect(undefinedError).to.throw('paymentsFunctions.cancelPayment.noPayment');
//         });
//
//         it('Returns market when all good', () => {
//             const user = Factory.create('user', {
//                 'wallet.symbol': 'UST',
//                 'wallet.address': 'USTAddress'
//             });
//             const payment =  Factory.create('payment', {
//                 userId: user._id,
//                 referenceId: 'referenceId',
//                 userIp: '123.23.23.22',
//                 pair: 'BTC-UST',
//                 fromAmount: 1,
//                 toAmount: 1,
//                 status: 'waiting',
//                 orderId:'sw-order-id'
//             });
//
//             const DI = {
//                 swFunctions: {
//                     getOrderInfo: ({}) => {
//                         return {
//                             data: {
//                                 status: 'received'
//                             }
//                         };
//                     }
//                 }
//             };
//
//             const paymentStatus = cancelPayment({
//                 userId: user._id,
//                 paymentId: payment._id,
//                 DI
//             });
//             expect(paymentStatus.status).to.be.equal('cancelled');
//             const updatedPayment = Payments.findOne(payment._id);
//             expect(updatedPayment.status).to.be.equal('cancelled');
//         });
//     });
// });

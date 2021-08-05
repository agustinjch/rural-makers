import { Measures } from '../../api/measures/collections';
import { Counters } from '../../api/counters/collections';
import { Usages } from '../../api/usages/collections';
import moment from 'moment';

const counters = [
    {
        address: 'Lugar ramis 3',
        decimals: 3,
        id: '2'
    },
    {
        address: 'Anceu 56',
        decimals: 3,
        id: '3'
    },
    {
        address: 'Lugar ramis 6',
        decimals: 3,
        id: '40'
    },
    {
        address: 'Lugar ramis 5',
        decimals: 3,
        id: '5'
    },
    {
        address: 'Lugar ramis 8',
        decimals: 3,
        id: '18'
    },
    {
        address: 'Anceu 52',
        decimals: 3,
        id: '102'
    },
    {
        address: 'Anceu 20',
        decimals: 3,
        id: '6'
    },
    {
        address: 'Anceu 21',
        decimals: 3,
        id: '7'
    },
    {
        address: 'Anceu 26',
        decimals: 3,
        id: '12'
    },
    {
        address: 'Anceu 70',
        decimals: 3,
        id: '21'
    },
    {
        address: 'Anceu 56',
        decimals: 3,
        id: '66'
    }
];

const days = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

export function createLocalData() {
    if (Counters.find().count() === 0) {
        counters.forEach(item => {
            Counters.insert(item);
        });

        // Create Measures of the past 10 days
        const existingCounters = Counters.find().fetch();

        existingCounters.forEach(counter => {
            let data = 0;
            days.forEach(day => {
                const date = moment()
                    .utc()
                    .subtract(day, 'day')
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toDate();
                const liters = Math.floor(Math.random() * 300 + 0);
                data += liters;
                Measures.insert({
                    date,
                    counterId: counter.id,
                    data
                });
                Usages.insert({
                    date,
                    counterId: counter.id,
                    liters: liters
                });
            });
        });
    }
}

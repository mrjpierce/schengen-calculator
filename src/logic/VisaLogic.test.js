import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import VisaLogic from './VisaLogic';
import DatePair from '../models/DatePair';
import App from '../components/App';

describe('VisaLogic', () => {

    function createDatePairWithOffset(startDayOffset, endDayOffset) {
        let startDate = Moment();
        let endDate = Moment();

        startDate.startOf('days');
        endDate.startOf('days');

        startDate.add(startDayOffset, 'days');
        endDate.add(endDayOffset, 'days');

        return new DatePair(startDate, endDate);
    }

    describe('daysBetweenDatesInclusive', () => {

        it('should return 1 when dates are the same', () => {
            // ARRANGE
            let periodStartDate = Moment('2017-06-20');
            let periodEndDate = Moment('2017-06-20');

            // ACT
            let result = VisaLogic
                .daysBetweenDatesInclusive(periodStartDate, periodEndDate);

            // ASSERT
            expect(result).toBe(1);
        });

        it('should return 11 when dates are the same', () => {
            // ARRANGE
            let periodStartDate = Moment('2017-06-10');
            let periodEndDate = Moment('2017-06-20');

            // ACT
            let result = VisaLogic
                .daysBetweenDatesInclusive(periodStartDate, periodEndDate);

            // ASSERT
            expect(result).toBe(11);
        });

    });

    describe('daysBetweenDatesExclusive', () => {

        it('should return 1 when dates are the same', () => {
            // ARRANGE
            let periodStartDate = Moment('2017-06-20');
            let periodEndDate = Moment('2017-06-20');

            // ACT
            let result = VisaLogic
                .daysBetweenDatesExclusive(periodStartDate, periodEndDate);

            // ASSERT
            expect(result).toBe(0);
        });

        it('should return 11 when dates are the same', () => {
            // ARRANGE
            let periodStartDate = Moment('2017-06-10');
            let periodEndDate = Moment('2017-06-20');

            // ACT
            let result = VisaLogic
                .daysBetweenDatesExclusive(periodStartDate, periodEndDate);

            // ASSERT
            expect(result).toBe(10);
        });

    });

    describe('daysInDatePairAfterOrOnDate', () => {
        
        it('should return 1 when the DatePair end date is the date', () => {
            // ARRANGE
            let date = Moment('2017-06-20');
            let datePair = new DatePair(Moment('2017-06-10'), Moment('2017-06-20'));

            // ACT
            let result = VisaLogic
                .daysInDatePairAfterOrOnDate(datePair, date);

            // ASSERT
            expect(result).toBe(1);
        });

        it('should return 6 when DatePair start date is before the date with 6 days overlap', () => {
            // ARRANGE
            let date = Moment('2017-06-20');
            let datePair = new DatePair(Moment('2017-06-10'), Moment('2017-06-25'));

            // ACT
            let result = VisaLogic
                .daysInDatePairAfterOrOnDate(datePair, date);

            // ASSERT
            expect(result).toBe(6);
        });

        it('should return 11 when DatePair is 11 days and after the date', () => {
            // ARRANGE
            let date = Moment('2017-06-01');
            let datePair = new DatePair(Moment('2017-06-10'), Moment('2017-06-20'));

            // ACT
            let result = VisaLogic
                .daysInDatePairAfterOrOnDate(datePair, date);

            // ASSERT
            expect(result).toBe(11);
        });
    });

    describe('findLatestEndDate', () => {

        it('should return the oldest date pair end date when today is less than that end date', () => {
            // ARRANGE
            let expectedDatePair = createDatePairWithOffset(-11, 10);
            let datePairs = [
                createDatePairWithOffset(-30, -20),
                expectedDatePair,
                createDatePairWithOffset(-21, -10),
            ];

            // ACT
            let result = VisaLogic
                .findLatestEndDate(datePairs);

            // ASSERT
            expect(result).toBe(expectedDatePair.endDate);
        });

        it('should throw error when null, undefined, or empty', () => {
            // ASSERT
            expect(() => VisaLogic.findLatestEndDate(null)).toThrow();
            expect(() => VisaLogic.findLatestEndDate(undefined)).toThrow();
            expect(() => VisaLogic.findLatestEndDate([])).toThrow();
        });

    });

    describe('daysInDatePairsInVisaPeriod', () => {

        it(`should return a correct count excluding all days of a date pair not 
            in visa period and all DatePairs are before today`, () => {
            // ARRANGE
            let passportDatePairs = [
                createDatePairWithOffset(-50, -40),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];
            // 30 day visa period ending on today
            let visaPeriodDatePair = createDatePairWithOffset(-30, 0);

            // ACT
            let result = VisaLogic
                .daysInDatePairsInVisaPeriod(passportDatePairs, visaPeriodDatePair);

            // ASSERT
            expect(result).toEqual(23);
        });

        it(`should return a correct count excluding some days of a date pair not 
            in visa period and all DatePairs are before today`, () => {
            // ARRANGE
            let passportDatePairs = [
                createDatePairWithOffset(-40, -25),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];
            // 30 day visa period ending on today
            let visaPeriodDatePair = createDatePairWithOffset(-30, 0);

            // ACT
            let result = VisaLogic
                .daysInDatePairsInVisaPeriod(passportDatePairs, visaPeriodDatePair);

            // ASSERT
            expect(result).toEqual(29);
        });

        it(`should return a correct of all DatePairs including a one day
            DatePair directly on the visa period start date`, () => {
            // ARRANGE
            let passportDatePairs = [
                createDatePairWithOffset(-30, -30),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];
            // 30 day visa period ending on today
            let visaPeriodDatePair = createDatePairWithOffset(-30, 0);

            // ACT
            let result = VisaLogic
                .daysInDatePairsInVisaPeriod(passportDatePairs, visaPeriodDatePair);

            // ASSERT
            expect(result).toEqual(24);
        });

        it('should throw error when null, undefined, or empty', () => {
            // ARRANGE
             let passportDatePairs = [
                createDatePairWithOffset(-30, -30),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];
            let visaPeriodDatePair = createDatePairWithOffset(-30, 0);

            // ASSERT
            expect(() => VisaLogic.daysInDatePairsInVisaPeriod(null, visaPeriodDatePair)).toThrow();
            expect(() => VisaLogic.daysInDatePairsInVisaPeriod(undefined, visaPeriodDatePair)).toThrow();
            expect(() => VisaLogic.daysInDatePairsInVisaPeriod([], visaPeriodDatePair)).toThrow();

            expect(() => VisaLogic.daysInDatePairsInVisaPeriod(passportDatePairs, null)).toThrow();
            expect(() => VisaLogic.daysInDatePairsInVisaPeriod(passportDatePairs, undefined)).toThrow();
        });

    });
});
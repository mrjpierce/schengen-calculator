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

    describe('findVisaPeriodEndDate', () => {

        it('should return the oldest date pair end date when today is less than that end date', () => {
            // ARRANGE
            let expectedDatePair = createDatePairWithOffset(-11, 10);
            let datePairs = [
                createDatePairWithOffset(-30, -20),
                createDatePairWithOffset(-21, -10),
                expectedDatePair
            ];

            // ACT
            let result = VisaLogic
                .findVisaPeriodEndDate(datePairs);

            // ASSERT
            expect(result).toBe(expectedDatePair.endDate);
        });

        it('should return today when all date pair end dates are younger', () => {
            // ARRANGE
            let today = Moment();
            today.startOf('day');
            let datePairs = [
                createDatePairWithOffset(-30, -20),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];

            // ACT
            let result = VisaLogic
                .findVisaPeriodEndDate(datePairs);

            // ASSERT
            expect(result).toEqual(today);
        });

    });

    describe('daysinDatePairsInVisaPeriod', () => {

        it(`should return a correct count excluding all days of a date pair not 
            in visa period and all DatePairs are before today`, () => {
            // ARRANGE
            let datePairs = [
                createDatePairWithOffset(-50, -40),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];

            // ACT
            let result = VisaLogic
                .daysinDatePairsInVisaPeriod(datePairs, 30);

            // ASSERT
            expect(result).toEqual(23);
        });

        it(`should return a correct count excluding some days of a date pair not 
            in visa period and all DatePairs are before today`, () => {
            // ARRANGE
            let datePairs = [
                createDatePairWithOffset(-40, -25),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];

            // ACT
            let result = VisaLogic
                .daysinDatePairsInVisaPeriod(datePairs, 30);

            // ASSERT
            expect(result).toEqual(29);
        });

        it(`should return a correct of all DatePairs including a one day
            DatePair directly on the visa period start date`, () => {
            // ARRANGE
            let datePairs = [
                createDatePairWithOffset(-30, -30),
                createDatePairWithOffset(-21, -10),
                createDatePairWithOffset(-11, -1)
            ];

            // ACT
            let result = VisaLogic
                .daysinDatePairsInVisaPeriod(datePairs, 30);

            // ASSERT
            expect(result).toEqual(24);
        });

    });
});
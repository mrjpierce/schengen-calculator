import Moment from 'moment';
import DatePair from '../models/DatePair';

export default class VisaLogic {

    static daysInDatePairsInVisaPeriod(passportDatePairs, visaPeriodDatePair) {
        if(!passportDatePairs || passportDatePairs.length === 0)
            throw new Error('passportDatePairs array can not be null, undefined, or empty');

        if(!visaPeriodDatePair)
            throw new Error('visaPeriodDatePair array can not be null, undefined, or empty');

        let visaPeriodEndDate = visaPeriodDatePair.endDate;
        let visaPeriodStartDate = visaPeriodDatePair.startDate;

        let daysInDatePairsInVisaPeriod = 0;
        passportDatePairs.forEach((passportDatePair) => {
            daysInDatePairsInVisaPeriod += this.
                daysInDatePairAfterOrOnDate(passportDatePair, visaPeriodStartDate);
        });

        return daysInDatePairsInVisaPeriod;
    }

    static findLatestEndDate(datePairs) {
        if(!datePairs || datePairs.length === 0)
            throw new Error('datePairs array can not be null, undefined, or empty');

        let visaPeriodEndDate;

        datePairs.map((d) => {
            if(d.endDate.isAfter(visaPeriodEndDate)) {
                visaPeriodEndDate = d.endDate;
            }
        });
        return visaPeriodEndDate;
    }

    static daysInDatePairAfterOrOnDate(datePair, date) {
        let periodStartDate = datePair.startDate;
        let periodEndDate = datePair.endDate;

        // The DatePair end date is before the date we can safely assume 0 days
        if(periodEndDate.isBefore(date))
            return 0;

        let daysInPeriod = this
            .daysBetweenDatesInclusive(periodStartDate, periodEndDate);

        // If the DatePair start date is before the date we need to subtract some days
        let daysBeforeDate = 0;
        if(periodStartDate.isBefore(date)) {
            daysBeforeDate = this
                .daysBetweenDatesExclusive(periodStartDate, date);
        }

        return daysInPeriod - daysBeforeDate;
    }

    static daysBetweenDatesInclusive(startDate, endDate) {
        // We need to clone the moment objects because they are stupidly mutable
        let startDateClone = startDate.clone();
        let endDateClone = endDate.clone();

        // Normalizing
        startDateClone.startOf('day');
        endDateClone.startOf('day');

        // Making Inclusive
        endDateClone.add(1, 'days');

        return endDateClone.diff(startDateClone, 'days');
    }

    static daysBetweenDatesExclusive(startDate, endDate) {
        // We need to clone the moment objects because they are stupidly mutable
        let startDateClone = startDate.clone();
        let endDateClone = endDate.clone();

        // Normalizing
        startDateClone.startOf('day');
        endDateClone.startOf('day');

        return endDateClone.diff(startDateClone, 'days');
    }

}
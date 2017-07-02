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

    updateAvailableVisaDays(datePairs, visa) {
        let {
            visaOffsetStartDate,
            maxDaysInOffset
        } = this.state;

        let visaDaysUsed = 0;

        datePairs.forEach(function(datePair, index, array) {
        let {
            beginDate,
            endDate
        } = datePair;

        if(!this.validateDatePair(beginDate, endDate))
            return;

        let daysInPeriod = endDate.diff(beginDate, 'days');
        let daysOutOfPeriod = visaOffsetStartDate.dif(beginDate, 'days');
        daysOutOfPeriod = daysOutOfPeriod >= 0 ? daysOutOfPeriod : 0;
        visaDaysUsed = daysInPeriod - daysOutOfPeriod;

        }, this);

        this.setState({
        visaDaysLeft: maxDaysInOffset - visaDaysUsed
        });
    }

    validateDatePair(beginDate, endDate) {
        let { 
            visaOffsetStartDate 
        } = this.state;

        // TODO: Special case for end days after today
        //      visa 180 period should be calculated from the last day of datepairs
        //      if last day is greater than today
        // TODO: Notify user future dates have been entered  

        // Not valid if the end date is before the visa offset start
        if(endDate < visaOffsetStartDate)
            return false;

        // Not valid if one of the dates is undefined
        if(beginDate === undefined || endDate === undefined)
            return false;

        // Not valid the end date is before the begin date
        if(endDate > beginDate)
            return false;

        return true;
    }
}
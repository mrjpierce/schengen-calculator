import DataModel from './DataModel';

export default class DatePair extends DataModel {

    constructor(startDate, endDate) {
        super();
        this.startDate = startDate;
        this.endDate = endDate;
    }

    validate() {
        this.validationError = null;

        // Not valid if one of the dates is undefined
        if(this.startDate === undefined)
            this.validationError = 'Start Date is not set';
        
        if(this.endDate === undefined)
            this.validationError = 'End Date is not set';

        // Not valid the end date is before the begin date
        if(this.endDate > this.startDate)
            this.validationError = 'End Date is before Start Date';

        return !this.validationError;
    }
}
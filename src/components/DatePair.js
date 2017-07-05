import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePair from '../models/DatePair';

export default class DatePair extends Component {

    render() {
        let {
            index,
            datePair,
            onBeginDateChange,
            onEndDateChange
        } = this.props;
        
        return (
            <div className="Date-pair" key={index}>
            Trip {index} 
            <input type="date" onChange={(e) => onBeginDateChange(e, index)} value={datePair.startDate} /> 
            - 
            <input type="date" onChange={(e) => onEndDateChange(e, index)} value={datePair.endDate}/>
            </div>
        );
    }
}

DatePair.propTypes = {
    index: PropTypes.number,
    datePair: PropTypes.instanceOf(DatePair),
    onBeginDateChange: PropTypes.func,
    onEndDateChange: PropTypes.func
};
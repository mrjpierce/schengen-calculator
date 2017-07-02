import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DatePair extends Component {

    render() {
        let {
            index,
            beginDate,
            endDate,
            onBeginDateChange,
            onEndDateChange
        } = this.props;

        return (
            <div className="Date-pair" key={index}>
            Trip {index} 
            <input type="date" onChange={(e) => onBeginDateChange(e, index)} value={beginDate} /> 
            - 
            <input type="date" onChange={(e) => onEndDateChange(e, index)} value={endDate}/>
            </div>
        );
    }
}

DatePair.propTypes = {
    index: PropTypes.number,
    beginDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    onBeginDateChange: PropTypes.func,
    onEndDateChange: PropTypes.func,
};
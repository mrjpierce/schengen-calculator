import React, { Component } from 'react';
import Moment from 'moment';
import EuropeanUnionCircle from '../content/european-union-circle.svg';
import {default as DatePairComponent} from './DatePair';
import DatePair from '../models/DatePair';
import VisaLogic from '../logic/VisaLogic';
import './App.css';

class App extends Component {
  
    constructor(props) {
        super(props);

        const maxDaysInOffset = 90;
        const visaStartDayOffset = 180;
        let visaOffsetStartDate = Moment().subtract(visaStartDayOffset, 'days');

        this.state = {
            maxDaysInOffset,
            visaStartDayOffset,
            visaOffsetStartDate,
            visaDaysUsed: 0,
            visaDaysLeft: maxDaysInOffset,
            datePairs: [{ startDate: undefined, endDate: undefined}]
        };
        this.onAddBtnClick = this.onAddBtnClick.bind(this);
    }

    onAddBtnClick(event) {
        const datePairs = this.state.datePairs;
        this.setState({
            datePairs: datePairs.concat({ startDate: undefined, endDate: undefined})
        });
    }

    onBeginDateChange = (event, index) => {
        event.preventDefault();
        const datePairs = this.state.datePairs;
        datePairs[index].startDate = Moment(event.target.value);
        this.setState((prevState, props) => { datePairs }, this.updateVisaDays);
    }

    onEndDateChange = (event, index) => {
        event.preventDefault();
        const datePairs = this.state.datePairs;
        datePairs[index].endDate = Moment(event.target.value);
        this.setState((prevState, props) => { datePairs }, this.updateVisaDays);
    }

    updateVisaDays() {
        const datePairs = this.state.datePairs;
        let visaEndDate = VisaLogic.findLatestEndDate(datePairs);
        let visaStartDate = visaEndDate.clone();
        const visaPeriod = new DatePair(visaStartDate, visaEndDate);
        this.setState({
            visaDaysUsed: VisaLogic.daysInDatePairsInVisaPeriod(datePairs, visaPeriod)
        });
    }

    render() {
        var datePairs = this.state.datePairs.map((d, i) => {
            return(
                <DatePairComponent 
                    key={i}
                    index={i}
                    beginDate={d.beginDate} 
                    endDate={d.endDate} 
                    onBeginDateChange={this.onBeginDateChange} 
                    onEndDateChange={this.onEndDateChange}
                />
            );
        });

        return (
            <div className="App">
                <div className="App-header">
                <img src={EuropeanUnionCircle} className="App-logo" alt="logo" />
                <h2>Schengen Calculator</h2>
                </div>
                <div className="App-intro">
                <div>
                    <div><b>{this.state.visaStartDayOffset} day offset start date: </b>{this.state.visaOffsetStartDate.format('MM/DD/YYYY')}</div>
                    <div><b>{this.state.visaDaysLeft} of {this.state.maxDaysInOffset} days used</b> </div>
                </div>
                {datePairs}
                <button onClick={this.onAddBtnClick}>Add Date Pair</button>
                </div>
            </div>
        );
    }
}

export default App;

import React, { Component } from 'react';
import Moment from 'moment';
import EuropeanUnionCircle from './european-union-circle.svg';
import DatePair from './DatePair';
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
      datePairs: [{ beginDate: undefined, endDate: undefined}]
    };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
  }

  onAddBtnClick(event) {
    const datePairs = this.state.datePairs;
    this.setState({
      datePairs: datePairs.concat({ beginDate: undefined, endDate: undefined})
    });
  }

  onBeginDateChange = (event, index) => {
    event.preventDefault();
    const datePairs = this.state.datePairs;
    let beginDate = Moment(event.target.value);
    datePairs[index].beginDate = beginDate;
    this.setState({ datePairs });
    this.updateAvailableVisaDays();
  }

  onEndDateChange = (event, index) => {
    event.preventDefault();
    const datePairs = this.state.datePairs;
    let endDate = Moment(event.target.value);
    datePairs[index].endDate = endDate;
    this.setState({ datePairs });
    this.updateAvailableVisaDays();
  }

  updateAvailableVisaDays() {
    let {
      datePairs,
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

  render() {
    var datePairs = this.state.datePairs.map((d, i) => {
      return(
        <DatePair 
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

import React, { Component } from 'react';
import EuropeanUnionCircle from './european-union-circle.svg';
import DatePair from './DatePair';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    const visaStartDayOffset = 180;
    let visaStartDate = new Date();
    visaStartDate.setDate(visaStartDate.getDate() - visaStartDayOffset);

    this.state = {
      visaStartDayOffset,
      visaStartDate: visaStartDate,
      inputList: [{ beginDate: undefined, endDate: undefined}]
    };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
  }

  onAddBtnClick(event) {
    const inputList = this.state.inputList;
    this.setState({
      inputList: inputList.concat({ beginDate: undefined, endDate: undefined})
    });
  }

  onBeginDateChange = (event, index) => {
    event.preventDefault();
    const inputList = this.state.inputList;
    inputList[index].beginDate = event.target.value;
  }

  onEndDateChange = (event, index) => {
    event.preventDefault();
    const inputList = this.state.inputList;
    inputList[index].endDate = event.target.value;
  }

  render() {
    var datePairs = this.state.inputList.map((d, i) => {
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
            <b>{this.state.visaStartDayOffset} day offset start date: </b>{this.state.visaStartDate.toDateString()}
          </div>
          {datePairs}
          <button onClick={this.onAddBtnClick}>Add Date Pair</button>
        </div>
      </div>
    );
  }
}

export default App;

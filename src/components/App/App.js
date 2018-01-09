import React, { Component } from 'react';
import { connect } from 'react-redux';

import Plot from '../Plot/Plot';
import { 
  changeLocation,
  setSelectedTemp,
  setSelectedDate,
  fetchData
} from '../../actions';


function mapStateToProp(state){
  return state
}

class App extends Component {
  
  fetchData = (event) => {

    event.preventDefault();
  
    var location = encodeURIComponent(this.props.location);

    var urlPrefix = "http://api.openweathermap.org/data/2.5/forecast?q=";
    var urlSuffix = "&APPID=c1f62f052159942bc0c53780caf947bd&units=metric";
    var url = urlPrefix + location + urlSuffix;
    
    this.props.dispatch(fetchData(url));
  }

  changeLocation = (event) => {
    this.props.dispatch(changeLocation(event.target.value))
  }

  onPlotClick = (data) => {
  	if (data.points){
  		var number = data.points[0].pointNumber;
      this.props.dispatch(setSelectedDate(this.props.dates[number]));
      this.props.dispatch(setSelectedTemp(this.props.dates[number]));
  	}
  }

  render() {
    var currentTemp = 'not loaded yet';
    
    if (this.props.data.list){
      currentTemp = this.props.data.list[0].main.temp;
    }
	
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
            <input 
              type="text" 
              placeholder={"City, Country"}
              value={this.props.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>

        { (this.props.data.list) ? (
			<div>
				{/* Render the current temperatura if no specific date is picked */}
				<p>
		          <span>{ this.props.selected.temp ? this.props.selected.temp : currentTemp }</span>
		          <span> °C</span>
		          <span> | { this.props.selected.temp ? this.props.selected.date: '' }</span>
		        </p>
		        <h2>Forecast</h2>
		        <Plot
		        	xData={this.props.dates}
		        	yData={this.props.temps}
		        	onPlotClick={this.onPlotClick}
		        	type="scatter"
		        />
			</div>
        ) : null }
      </div>
    );
  }
}

export default connect(mapStateToProp, null)(App);

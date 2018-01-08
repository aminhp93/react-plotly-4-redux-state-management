import React, { Component } from 'react';
import { connect } from 'react-redux';

import xhr from 'xhr';
import Plot from '../Plot/Plot';
import { changeLocation } from '../../actions';


function mapStateToProp(state){
  return {
    location: state.location
  }
}

class App extends Component {
  state = {
    data: {},
    dates: [],
    temps: [],
    selected: {
      date: '',
      temp: null
    }
  }
  
  fetchData = (event) => {

    event.preventDefault();
  
    var location = encodeURIComponent(this.props.location);

    var urlPrefix = "http://api.openweathermap.org/data/2.5/forecast?q=";
    var urlSuffix = "&APPID=c1f62f052159942bc0c53780caf947bd&units=metric";
    var url = urlPrefix + location + urlSuffix;
    
    var self = this;
    xhr({
      url: url
    }, function(err, data){

    	var body = JSON.parse(data.body);
    	var list = body.list;
    	var dates = [];
    	var temps = [];
    	for (var i = 0; i < list.length; i++){
    		dates.push(list[i].dt_txt);
    		temps.push(list[i].main.temp);
    	}

		// save data here
		self.setState({
			data: body,
			dates: dates,
			temps: temps,
			selected: {
		    	date: '',
		    	temp: null
		    }
		})

    })
  }

  changeLocation = (event) => {
    this.props.dispatch(changeLocation(event.target.value))
  }

  onPlotClick = (data) => {
  	if (data.points){
  		this.setState({
  			selected: {
  				date: data.points[0].x,
  				temp: data.points[0].y	
  			}  			
  		})
  	}
  }

  render() {
    var currentTemp = 'not loaded yet';
    
    if (this.state.data.list){
      currentTemp = this.state.data.list[0].main.temp;
    }
	
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
            <input 
              type="text" 
              placeholder={"City, Country"}
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>

        { (this.state.data.list) ? (
			<div>
				{/* Render the current temperatura if no specific date is picked */}
				<p>
		          <span>{ this.state.selected.temp ? this.state.selected.temp : currentTemp }</span>
		          <span> °C</span>
		          <span> | { this.state.selected.temp ? this.state.selected.date: '' }</span>
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

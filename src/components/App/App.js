import React, { Component } from 'react';
import './App.css';

import xhr from 'xhr';
import Plot from '../Plot/Plot'

class App extends Component {
  state = {
    location: '',
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
    console.log(this.state)
  
    var location = encodeURIComponent(this.state.location);

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
    console.log(this.state)
  }

  changeLocation = (event) => {
    console.log('changeLocation')
    this.setState({
      location: event.target.value
    })
  }

  onPlotClick = (data) => {
  	console.log(data)
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
		        	xData={this.state.dates}
		        	yData={this.state.temps}
		        	onPlotClick={this.onPlotClick}
		        	type="scatter"
		        />
			</div>
        ) : null }
      </div>
    );
  }
}

export default App;

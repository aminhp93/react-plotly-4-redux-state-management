## 3 - With Plotly

[https://academy.plot.ly/react/3-with-plotly/](https://academy.plot.ly/react/3-with-plotly/)

1. - App.js: comment in React 
`{/* Render the current temperatura if no specific date is picked */}`

2. - App.js: 
`
There is one small user experience improvement we could do. When switching to a new city, the text persists because this.state.selected.temp still references the old data—in reality want to show the current temperature though!

To fix this, we set selected back to the default values in our fetchData method when the request has returned data:
`
```
self.setState({
  data: body,
  dates: dates,
  temps: temps,
  selected: {
    date: '',
    temp: null
  }
});
```
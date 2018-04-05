updateBars(SELECTED_VARIABLE, filteredData[0])
updateTable(stateData[0])
setZoom(false,true, false)
updateMap(variable)

  var tmp_state = topojson.feature(us, us.objects.states).features; //176

  // look in ready for all of the initial data transformations


  // To get data right
  var BigData = OverallTransformData(us,county,state,countyData,stateData);
  var tmp_state = BigData.tmp_state,
    tmp_county = BigData.tmp_county,
    filteredCounties = BigData.filteredCounties,
    us_data_ph = BigData.us_data_ph,
    state_data = BigData.state_data,
    county_data = BigData.county_data;


var SELECTED_VARIABLE = "perc_debt_collect";
var COLORRANGE = ["#cfe8f3", "#73bfe2","#1696d2", "#0a4c6a", "#000000"];
var margin = {top: 10, right: 10, bottom: 10, left: 10}
var CATEGORY = "medical";
var bodyWidth = $("body").width();
var bodyHeight = $("body").height();
var width = (bodyWidth*.7) - margin.left -margin.right,
    height = (width*.8) - margin.top-margin.bottom,     

    centered,
    selectedState;
var COLORS = 
  {
    "q0-5": "#cfe8f3",
    "q1-5": "#73bfe2",
    "q2-5": "#1696d2",
    "q3-5": "#0a4c6a",
    "q4-5": "#000000",
  }
// d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
//   if (error) throw error;

d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data/county_" + CATEGORY + ".csv")
    .defer(d3.csv, "data/state_"+ CATEGORY + ".csv")
    .await(ready);

function transformData(geography){
  var geography_nested = d3.nest()
    .key(function(d) { return d.id })
    .entries(geography);
  return geography_nested
}


function ready(error, us, county, state) {
  if (error) throw error;
  /*SETTING UP THE DATA*/
  var countyData = us.objects.counties.geometries
  var stateData = us.objects.states.geometries

  var county_data = transformData(county)

  county_data.forEach(function(d,i){ 
    countyData.forEach(function(e, j) { 
      if (d.key == e.id) { 
       for (var property in d["values"][0]) {
          e[property] = d.values[0][property]
        }
      }
    })
  })
  var state_data = transformData(state)
  state_data.forEach(function(d,i){ 
    stateData.forEach(function(e, j) { 
      if (d.key == e.id) {
        for (var property in d["values"][0]) {
          e[property] = d.values[0][property]
        }
      }
    })
  })
  var tmp_county = topojson.feature(us, us.objects.counties).features;
  for (var i =0; i<tmp_county.length; i++){
    var mergeID = +tmp_county[i]["id"]
    for (var j = 0; j<countyData.length;j++){
      if(+countyData[j]["id"] == mergeID){ 
          for (var property in countyData[j]) {
            var data = (isNaN(countyData[j][property]) == true) ? countyData[j][property] : +countyData[j][property];
            tmp_county[i]["properties"][property] = data;
          }
        break;
      }
    }
  }
  var tmp_state = topojson.feature(us, us.objects.states).features;
  for (var i =0; i<tmp_state.length; i++){
    var mergeIDState = +tmp_state[i]["id"]
    for (var j = 0; j<stateData.length;j++){
      if(+stateData[j]["id"] == mergeIDState){
        for (var property in stateData[j]) {
          var data = (isNaN(stateData[j][property]) == true) ? stateData[j][property] : +stateData[j][property];
          tmp_state[i]["properties"][property] = data;
        }
        break;
      }
    }
  }
  /*END*/
  $( function() {
    var searchArray = [];
    for (var i = 0; i<tmp_state.length; i++){
     searchArray.push(tmp_state[i]["properties"]["state"])
    }
    for (var i = 0; i<tmp_county.length; i++){
     searchArray.push(tmp_county[i]["properties"]["county"] + ", " + tmp_county[i]["properties"]["abbr"])
    }
    $( "#searchBox" ).autocomplete({ 
      source: searchArray,
      appendTo: ".search-div"
    });
  } );
  var zoom = d3.zoom()
      // .translate([0, 0])
      // .scale(1)
      .scaleExtent([0, 8])
      .on("zoom", zoomed);


  var min = d3.min(tmp_county, function(d) {
    return d.properties[SELECTED_VARIABLE]
  })
  var max = d3.max(tmp_county, function(d) { 
    return d.properties[SELECTED_VARIABLE]
  })
  var quantize = d3.scaleQuantize()
    .domain([min, max])
    .range(d3.range(5).map(function(i) { return "q" + i + "-5"; }))

  /*ADD MAP*/

  var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('transform', 'translate(' + 10 + ',' + 100 + ')')

  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "background")

      // .on("click", clicked);
  var path = d3.geoPath()
  var g = svg.append("g")
    .attr("transform", "scale(" + $("body").width()/1400 + ")");
  g.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(tmp_county)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function (d) { return d.properties.id; })
    .style("fill", function(d){
        return (isNaN(d.properties[SELECTED_VARIABLE]) == true) ? "#adabac" : COLORS[quantize(d.properties[SELECTED_VARIABLE])];
    })
    .on('click', function(d) { 
      var state = d.properties.state;
      var filteredData = tmp_state.filter(function(d){ 
        return d.properties.state == state
      })
      var selectedData = filteredData[0]["properties"]
      clicked(d, selectedData)
    })
    .on('mouseover', function(d) {
      var state = d.properties.state
      hoverState(state)
    })
    .on('mouseout', function() {
      d3.selectAll(".hover").classed("hover", false)
    })
    .call(zoom)

  g.append("g")
    .attr("class", "state-borders")
    .selectAll("path")
    .data(tmp_state)
    .enter().append("path")
    .attr("d", path)

    .attr("id", function(d){
      return d.properties.abbr
    })

/*LEGEND*/
 var legendSvg = d3.select("#legend")
    .append("svg")
    .attr("width", width)
    .attr("height", height/5)
    .attr('transform', 'translate(' + 10 + ',' + 100 + ')')

  var legend = legendSvg.append("g")
    .attr("width", width/3)
    .attr("height", 50)
    .attr("transform", "translate("+width/3+"," + 10 + ")")
  var keyHeight =   15;
  var keyWidth =  50;
 for (i=0; i<=5; i++){
  if(i !== 5){  
    legend.append("rect")
      .attr("width",keyWidth)
      .attr("height",keyHeight)
      .attr("class","rect"+i)
      .attr("x",keyWidth*i)
      .style("fill", COLORRANGE[i])
      // .on("mouseover",function(){ mouseEvent({type: "Legend", "class": (d3.select(this).attr("class"))}, "hover") })
      // .on("mouseleave", function(){
      //   d3.selectAll(".demphasized").classed("demphasized",false)
      // })
  //     .on("click",function(){ mouseEvent(dataID, {type: "Legend", "class": "q" + (this.getAttribute("x")/keyWidth) + "-4"}, "click") })
    legend.append("text")
      .attr("y", 20)
      .attr("class","legend-labels")
      .attr("x",keyWidth*i)
      .text(function(){
        return "bp-" + i
        //console.log((i ==0) ? MIN : BREAKS[SELECTED_VARIABLE(1)])
        //return (i ==0) ? MIN : BREAKS[SELECTED_VARIABLE[i-1]]
        // var array = BREAKS[SELECTED_VARIABLE]
        // return (i==0) ? legendFormat(MINVALUE[SELECTED_VARIABLE]) : legendFormat((array[i-1]))
      })
   }
   if (i == 5) { 
    legend.append("text")
      .attr("y", 20)
      .attr("class","legend-labels")
      .attr("x",keyWidth*i)
      .text(function(){
        return "bp-5"
        //  return legendFormat(MAXVALUE[SELECTED_VARIABLE])
      })
   }
  }
  function hoverState(state) {
    var filteredData = tmp_state.filter(function(d){
      return d.properties.state == state
    })
    d3.select("path#" + filteredData[0]["properties"]["abbr"])
      .classed('hover', true)
  }

      // .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      // .attr("id", "state-borders")
      // .attr("d", path)

  /*ADD TABLE*/
  var columns = ["Overall", "White", "Non-White"]
  var groups = ["% has any debt in collections, 2016", "Median amount all collections among those with, 2016", "% has medical debt in collections, 2016", "Median amount medical collections among those with, 2016","% population white", "% population with health insurance, 2015 (ACS)","Average household income, 2015 (ACS)"]
  var rowNumbers = [1,2,3]
  var rowData = ["perc_debt_collect", "med_debt_collect", "perc_debt_med", "med_debt_med", "perc_pop_wh", "perc_pop_ins", "avg_income"]
  var table = d3.select("#table-div").append("table"),
      tbody = table.selectAll('tbody')
        .data(rowData)
        .enter().append("tbody")
        .attr("class", "group")
        .on('click', function(d) {
          console.log(d)
          d3.selectAll('tbody')
            .classed('selected', false)
          d3.select(this)
            .classed('selected', true)
          updateMap(d)
        })
  table.select('tbody:first-child').classed('selected', true)
  
  var us_data = state_data[0]["values"][0]
  var tr = tbody.selectAll('tr')
      .data(rowNumbers)
      .enter().append('tr')
      .attr("class", function(d,i) {
        if (i%3 == 0 ) {
          return "cell-header"
        }else if (i%3==2) {
          return "cell-data"
        }else {
          return "cell-column"
        }
      })
  d3.selectAll(".cell-header")
    .append("th")
    .attr("colspan", 3)
    .each(function(d,i) {console.log(i)
      d3.select(this)
        .text(function() { 
          return groups[i]
        })
    })
  d3.selectAll(".cell-column")
    .each(function() {
      d3.select(this).selectAll("td")
        .data(columns)
        .enter().append("td")
        .text(function(d) {
          return d
        })
    })
  d3.selectAll(".cell-data")
    .each(function(d,i) {
      var rowVariable = [rowData[i]],
          rowVariable_nw = rowVariable + "_nw";
          rowVariable_wh = rowVariable + "_wh";
      // var column_data = [us_data].filter(function(d,i){
      //   return rowData[i]
      // })
      // console.log(column_data)
      d3.select(this).selectAll("td")
        .data(columns)
        .enter().append("td")
        .text(function(d,i) {
          if (i==0) {
            return ((us_data[rowVariable]) == undefined) ? "-" : formatNumber(us_data[rowVariable]);
          }else if (i==1){
            return ((us_data[rowVariable_wh]) == undefined) ? "-" : formatNumber(us_data[rowVariable_wh]);
          }else if (i==2) {
            return ((us_data[rowVariable_nw]) == undefined) ? "-" : formatNumber(us_data[rowVariable_nw]);
          }
        })
    })
  /*END TABLE*/
  function formatNumber(d) { 
    var percent = d3.format(",.1%"),
        number = d3.format("$,.0f");
    return (d<1) ? percent(d) : number(d);
  }

  function updateMap(variable) {
    var min = d3.min(tmp_county, function(d) {
      return d.properties[variable]
    })
    var max = d3.max(tmp_county, function(d) { 
      return d.properties[variable]
    })
    var quantize = d3.scaleQuantize()
      .domain([min, max])
      .range(d3.range(5).map(function(i) { return "q" + i + "-5"; }))

    d3.select(".counties").selectAll("path")
    .transition()
    .duration(800)
    .style("fill", function(d){
        return (isNaN(d.properties[variable]) == true) ? "#adabac" : COLORS[quantize(d.properties[variable])];
    })
  }

  function updateTable(data) {
    console.log(data)
    d3.selectAll(".cell-data")
      .each(function(d,i) { 
        var rowVariable = [rowData[i]],
            rowVariable_nw = rowVariable + "_nw";
            rowVariable_wh = rowVariable + "_wh";
        d3.select(this).selectAll("td")
          .text(function(d,i) { 
            if (i==0) { 
              return ((data[rowVariable]) == undefined) ? "-" : formatNumber(data[rowVariable]);
            }else if (i==1){
              return ((data[rowVariable_wh]) == undefined) ? "-" : formatNumber(data[rowVariable_wh]);
            }else if (i==2) {
              return ((data[rowVariable_nw]) == undefined) ? "-" : formatNumber(data[rowVariable_nw]);
            }
          })
      })
  }
  function clicked(d, data) {
    var x, y, k;
    if (d.properties.state && centered !== d.properties.state) { 
      for (var i = 0; i < tmp_state.length; i++) {
        if (tmp_state[i]["properties"]["state"] == d.properties.state){
          selectedState = tmp_state[i]
        }
      }
      var centroid = path.centroid(selectedState); //replace with variable d to center by county 
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = selectedState.properties.state;
      updateTable(data)

    } 
    else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
      var us_data = state_data[0]["values"][0]
      updateTable(us_data)

    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
  }

  function zoomed() {
    g.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
  }


};


$(window).resize(function() {
  sizeChange()
  function sizeChange() {
      d3.select("g").attr("transform", "scale(" + $("body").width()/1400 + ")");
      $("svg").height($("body").width()*0.8);
  }


})



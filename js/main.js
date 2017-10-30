var SELECTED_VARIABLE;
var WHITE;
var NONWHITE;
var COLORRANGE = ["#cfe8f3", "#73bfe2","#1696d2", "#0a4c6a", "#000000"];
var zoomState;
var zoomNational;
var zoomCounty;
var margin = {top: 10, right: 10, bottom: 10, left: 10}
var CATEGORY = "medical";
var tdMap;
function setWidth(width) {
  tdMap = width;
}
function setVariable(variable) {
  SELECTED_VARIABLE = variable;
  WHITE = variable + "_wh"
  NONWHITE= variable + "_nw"
}
function setZoom(national, state, county) {
  zoomNational = national;
  zoomState = state;
  zoomCounty = county;
}
setWidth($('.td-map').width())
setZoom(true,false, false)
setVariable("perc_debt_collect")

var width = (tdMap) - margin.left -margin.right,
    height = (width*.7) - margin.top-margin.bottom,     
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
    .key(function(d) {return d.id })
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
      if (+d.key == e.id) {
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
    var mergeIDState = tmp_state[i]["id"]
    for (var j = 0; j<stateData.length;j++){
      if(stateData[j]["id"] == mergeIDState){ 
        for (var property in stateData[j]) {
          var data = (isNaN(stateData[j][property]) == true) ? stateData[j][property] : +stateData[j][property];
          tmp_state[i]["properties"][property] = data;
        }
        break;
      }
    }
  }
  /*END*/

  // $( function() {
    var searchArray = [];
    for (var i = 0; i<tmp_state.length; i++){
     searchArray.push(tmp_state[i]["properties"]["state"])
    }
    for (var i = 0; i<tmp_county.length; i++){
     searchArray.push(tmp_county[i]["properties"]["county"] + ", " + tmp_county[i]["properties"]["abbr"])
    }
    $( "#searchBox" ).autocomplete({ 
      appendTo: ".search-div"
    });

    $('input[name="tags"').tagit({
        availableTags: searchArray,
        allowSpaces: true,
        autocomplete:{
          // availableTags: searchArray, // this param is of course optional. it's for autocomplete.
          // configure the name of the input field (will be submitted with form), default: item[tags]
          itemName: 'item',
          fieldName: 'tags',
          onlyAvailableTags: true,
          tagLimit: 2,
          appendTo: ".search-div"
        },
        beforeTagAdded: function(event, ui) {
          if(searchArray.indexOf(ui.tagLabel) == -1){ 
            return false;
          }
          if(ui.tagLabel == "not found"){
              return false;
          }
        },
        afterTagAdded: function(event, ui) {
          var tag = (ui.tag[0]["textContent"]);
          var county = (tag.search(",") > 0) ? tag.split(",")[0] : "";
          var state = (tag.search(",") > 0) ? (tag.split(", ")[1]).slice(0,-1) : tag.slice(0,-1);
          var geoData = (tag.search(",") > 0) ? tmp_county : tmp_state;
          var geoType = (tag.search(",") > 0) ? "county" : "state";
          var filteredData = geoData.filter(function(d) {
            if (geoType == "county"){
              return d.properties["county"] == county && d.properties["abbr"] == state
            }else {
              return d.properties["state"] == state;
            }
          })
          var data1 = filteredData[0]
          var data2 = filteredData[0]["properties"]
          zoomMap(data1, data2, geoType)
          if (county != "") {
            addTag(data2["state"], county, state)
          }

        },
        afterTagRemoved: function(event,ui) { 
           var tag = (ui.tag[0]["textContent"]);
           if (tag.search(",") > 0) {
            d3.selectAll(".counties > path.selected")
              .classed("selected", false)
            setZoom(false, true, false)
           }else {
            d3.select("#location").html("National")
            setZoom(true, false, false)
            zoomMap(null, null, "national")
           }
          updateBars(SELECTED_VARIABLE)
        }
    });
  // });
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
    .attr('transform', 'translate(' + (-10) + ',' + 0 + ')')

  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "background")
  var path = d3.geoPath()
  var g = svg.append("g")
    .attr("transform", "scale(" + $(".td-map").width()/960 + ")");
  g.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(tmp_county)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function (d) { return d.properties.abbr + d.id; })
    .style("fill", function(d){
        return (isNaN(d.properties[SELECTED_VARIABLE]) == true) ? "#adabac" : COLORS[quantize(d.properties[SELECTED_VARIABLE])];
    })
    .on('click', function(d) { 
      var state = d.properties.state;
      var stateData = tmp_state.filter(function(d){ 
        return d.properties.state == state
      })
      var selectedState = stateData[0]
      var previousState = (d3.select(".state-borders > path.selected").node() != null) ? d3.select(".state-borders > path.selected").attr("id") : ""
      var selectedCounty = (d["properties"])
      var level = (zoomState == true && previousState == d["properties"]["abbr"]) ? "county": "state";
      console.log(level)
      var county = d.properties["county"]
      var abbr = d.properties["abbr"]
      if (d3.select(this).classed('selected') == true) {
        d3.select(this).classed('selected', false)
        if (level == "county") {
          $('ul.tagit > li:nth-child(2)').remove()
          setZoom(false, true, false)
          updateTable(selectedState)
          updateBars(SELECTED_VARIABLE, d)
        }
      }else {
        var county = (level == "state") ? null : county;
        addTag(state, county, abbr)
        zoomMap(d, d, level)
        updateBars(SELECTED_VARIABLE, d)
      }
    })
    .on('mouseover', function(d) { 
      if (zoomNational == true) { 
        $(".state-borders").css("pointer-events", "all")
        $(".counties").css("pointer-events", "none")
        hoverLocation("", d.properties.abbr, "state");
        updateBars(SELECTED_VARIABLE, d) 
      }else {
        $(".state-borders").css("pointer-events", "none")
        $(".counties").css("pointer-events", "all")
      }
      var previousState = (d3.select(".state-borders > path.selected").node() != null) ? d3.select(".state-borders > path.selected").attr("id") : ""
      var hoveredState = d.properties.abbr
      var geography = (zoomState == true && previousState == hoveredState) ? "county" : "state";
      var county = (geography == "county") ? d.properties.county : ""
      var state = d.properties.abbr
      hoverLocation(county, state, geography)
      updateBars(SELECTED_VARIABLE, d)
    })
    .on('mouseout', function(d) { 
      if (d3.select(".counties > path.selected").node() != undefined) {
        var county = d3.select(".counties > path.selected").datum().properties.county
        var abbr = d3.select(".counties > path.selected").datum().properties.abbr
        d3.select("#location").html(county + ", " + abbr)
      }else if (d3.select(".state-borders > path.selected").node() != undefined) {
        var state = d3.select(".state-borders > path.selected").datum().properties.state
        d3.select("#location").html(state)
      }
      d3.selectAll("path.selected").moveToFront()
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
    .on('click', function(d) {
      var state = d.properties.state;
      // var county = d.properties.county;
      var abbr = d.abbr;
      var level = "state"
      setZoom(false, true, false)
      $(".state-borders").css("pointer-events", "none")
      $(".counties").css("pointer-events", "all")
      addTag(state, null, abbr)
      zoomMap(d, d, level)
      updateBars(SELECTED_VARIABLE, d)
    })
    .on('mouseover', function(d) {
      if (zoomNational == true) { 
        $(".state-borders").css("pointer-events", "all")
        $(".counties").css("pointer-events", "none")
        hoverLocation("", d.properties.abbr, "state");
        updateBars(SELECTED_VARIABLE, d) 
      }else {
        $(".state-borders").css("pointer-events", "none")
        $(".counties").css("pointer-events", "all")

      }
    })
    .on('mouseout', function(d) {
      if (zoomNational==true) {
        d3.select('#location').html('National')
        if (d3.select(".state-borders > path.selected").node() != undefined) {
          var state = d3.select(".state-borders > path.selected").datum().properties.state
          d3.select("#location").html(state)
          d3.selectAll("path.selected").moveToFront()
        }else {
          d3.selectAll(".hover").classed("hover", false)
          updateBars(SELECTED_VARIABLE, undefined, true)
        }
      }
    })

/*LEGEND*/
 var legendSvg = d3.select("#legend")
    .append("svg")
    .attr("width", width)
    // .attr("height", 50)
    .attr('transform', 'translate(' + 10 + ',' + 0 + ')')

  var legend = legendSvg.append("g")
    .attr("width", width/3)
    // .attr("height", 50)
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

  d3.selection.prototype.moveToFront = function() {  
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  d3.selection.prototype.moveToBack = function() {  
      return this.each(function() { 
          var firstChild = this.parentNode.firstChild; 
          if (firstChild) { 
              this.parentNode.insertBefore(this, firstChild); 
          } 
      });
  };
  function hoverLocation(county, state, geography) {
    var data = (geography == "county") ? tmp_county : tmp_state
    var filteredData = data.filter(function(d){
      if (geography == "county") {
        return d.properties.county == county && d.properties.abbr == state
      }else { 
        return d.properties.abbr == state
      }
    })
    d3.select("#location").html(function() { 
      return (geography=="county") ? filteredData[0]["properties"]["county"] + ", " + filteredData[0]["properties"]["abbr"] : filteredData[0]["properties"]["state"]
    })
    var id = (geography == "county") ? filteredData[0]["properties"]["id"] : ""
    d3.select("path#" + filteredData[0]["properties"]["abbr"] + id)
      .classed('hover', true)
      .moveToFront()
  }

      // .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      // .attr("id", "state-borders")
      // .attr("d", path)

  /*ADD TABLE*/
  $("#table-div").empty()
  var columns = ["Overall", "White", "Non-White"]
  var groups = ["% has any debt in collections, 2016", "Median amount all collections among those with, 2016", "% has medical debt in collections, 2016", "Median amount medical collections among those with, 2016","% population white", "% population with health insurance, 2015 (ACS)","Average household income, 2015 (ACS)"]
  var rowNumbers = [1,2,3]
  var rowData = ["perc_debt_collect", "med_debt_collect", "perc_debt_med", "med_debt_med", "perc_pop_wh", "perc_pop_ins", "avg_income"]
  var table = d3.select("#table-div")
    .append("table")
      tbody = table.selectAll('tbody')
        .data(rowData)
        .enter().append("tbody")
        .attr("class", "group")
        .on('click', function(d) {
          d3.selectAll('tbody')
            .classed('selected', false)
          d3.select(this)
            .classed('selected', true)
          setVariable(d)
          updateMap(d)
        })
  table.select('tbody').classed('selected', true)
  
  var us_data = state_data[0]["values"][0]
  for (var key in us_data) {
      if (us_data.hasOwnProperty(key)) { 
          if (+us_data[key] == NaN || +us_data[key] == 0){
            us_data[key = us_data[key]]
          }else {
            us_data[key] = +us_data[key]
          }
      }
  }

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
    .each(function(d,i) {
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
  /*BAR CHARTS*/

  var barHeight = height/3
  var x = d3.scaleBand()
    .rangeRound([0, width/5])
    .padding(0.2)
  var y = d3.scaleLinear()
      .rangeRound([barHeight, 0]);
  state_data.forEach(function(d) { 
    d.national = +d.values[0][SELECTED_VARIABLE]
  })
  state_data.forEach(function(d) { 
    d.white = +d.values[0][WHITE];
  })
  state_data.forEach(function(d) { 
    d.white = +d.values[0][NONWHITE]
  })
  x.domain([[us_data].map(function(d){ 
    return d.abbr
  })]);
  y.domain([0, d3.max(state_data, function(d) {
    return d.national
  })])

  var formatPercent = d3.format(".0%")
  var xAxis = d3.axisBottom()
      .scale(x)
  var yAxis = d3.axisLeft()
      .scale(y)
      .tickFormat(formatPercent);
  var barCategories = ["National", "State", "State", "White", "Nonwhite"]
  var barSvg = d3.select("#bar-chart")
    .append("svg")
    .attr('width', width)
    .attr('height', barHeight)
  var barG = barSvg.selectAll("g")
    .data(barCategories)
    .enter()
    .append('g')
    .each(function(d,i) {
      d3.select(this)
        .attr("transform", function() {
          if (i<2){
            return "translate(" + (width/6) *i + "," + -35 + ")"
          }else {
            return "translate(" + ((width/6) * (i+1)) + "," + -35 + ")";
          } 
        })
        .attr("class", "g-" + i)
    })
  barG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + barHeight+ ")")
    .call(xAxis)
  barG.append("g")
    .attr("class", "g-text")
    .append("text")
    .attr("x", 0)
    .attr("y", barHeight*1.1)
    .attr("dy", ".71em")
    .attr("text-anchor", "start")
    .attr("font-size", "1.1em")
    .text(function(d) { return d});
  barG.selectAll(".bar")
    .data([us_data])
    .enter()
    .append("rect")
    .attr("x", function(d) { 
      return d.abbr
    })
    .each(function(d,i) {
      var parentClass = d3.select(this.parentNode).attr('class');
      d3.select(this)
        .attr("class", "bar " + parentClass)
        .attr("width", x.bandwidth())
        .attr("y", function() {  
          if (parentClass.search(0) > -1 || parentClass.search(1) > -1) {
            return y(d[SELECTED_VARIABLE])
          }else if (parentClass.search(2) > -1) {
            return y(d[WHITE])
          }else{
            return y(d[NONWHITE])
          }
        })
        .attr("height", function() {
          if (parentClass.search(0) > -1 || parentClass.search(1) > -1) {
            return barHeight - y(d[SELECTED_VARIABLE])
          }else if (parentClass.search(2) > -1){
            return barHeight - y(d[WHITE])
          }else{
            return barHeight - y(d[NONWHITE])
          }
        })
        .attr("fill", function(d) {
         return "#fdbf11"
        })
    })

  d3.selectAll(".g-1, .g-2").style("opacity", 0)

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
    updateBars(variable)
  }
  function updateBars(variable, selected, mouseout) { 
    var WHITE = variable + "_wh"
    var NONWHITE = variable + "_nw"
    var data = (zoomCounty == true) ? county_data : state_data
    data.forEach(function(d) { 
      d.national = +d.values[0][variable]
    })
    data.forEach(function(d) { 
      d.white = +d.values[0][WHITE];
    })
    data.forEach(function(d) { 
      d.nonwhite = +d.values[0][NONWHITE]
    })
    x.domain([[us_data].map(function(d){
      return d.abbr
    })]);

    y.domain([0, d3.max(data, function(d) {
      return d.national
    })])
    // y.domain([0, d3.max(data, function(d) {
    //   return (d.white < d.nonwhite) ? d.white : d.nonwhite
    // })])
    if (zoomNational == true && selected == undefined) {  

      d3.selectAll(".g-1, .g-2").style("opacity", 0)
      if (mouseout == true) {
      }else { 
        d3.selectAll(".bar")
          .each(function(d,i) {
            var parentClass = d3.select(this.parentNode).attr('class');
            var bar = d3.select(this)
              .data([us_data])
            bar
              .attr("x", function(d) { 
                return d.abbr
               })
              .transition()
              .duration(300)
              .attr("y", function(d) {  
                if (parentClass.search(0) > -1) { 
                  return (isNaN(d[variable]) == false) ? y(d[variable]) : barHeight;
                }else if (parentClass.search(3) > -1) {
                  return (isNaN(d[WHITE]) == false) ? y(d[WHITE]) : barHeight;
                }else if (parentClass.search(4) > -1){
                  return (isNaN(d[NONWHITE]) == false) ? y(d[NONWHITE]) : barHeight;
                }
              })
              .attr("height", function(d) {
                if (parentClass.search(0) > -1 || parentClass.search(1) > -1) {
                  return (isNaN(d[variable]) == false) ? barHeight - y(d[variable]) : 0;
                }else if (parentClass.search(3) > -1){
                  return (isNaN(d[WHITE]) == false) ? barHeight - y(d[WHITE]) : 0;
                }else if (parentClass.search(4) > -1){
                  return (isNaN(d[NONWHITE]) == false) ? barHeight - y(d[NONWHITE]) : 0;
                }
              })
              .attr("fill", function(d) {
               return "#fdbf11"
              })
          })
      }
    } else if (zoomNational == false || selected != undefined) { 
        var countyID = (d3.select(".counties > path.selected").node() == null) ? "" : d3.select(".counties > path.selected").attr("id");
        var county = countyID.slice(2,)
        var state = selected["properties"]["abbr"]
        var data = (county == "") ? tmp_state : tmp_county
        // var filteredData = data.filter(function(d){
        //   if (data == tmp_county) {
        //     return d.properties.id == county //&& d.properties.abbr == state
        //   }else { 
        //     return d.properties.abbr == state
        //   }
        // })

        // x.domain([[filteredData[0].properties].map(function(d){console.log(d.abbr)
        //   return d.abbr
        // })]);
       
        d3.selectAll(".bar:not(.g-0):not(.g-1)")
          // .data([filteredData[0]["properties"]])
          .each(function(d,i) { 
            var parentClass = d3.select(this.parentNode).attr('class')
            var bar = d3.select(this)
              .data([selected["properties"]]);
            bar
              .transition()
              .duration(300)
              .attr("y", function(d) {  
                if (parentClass.search(2) > -1) { 
                  return (isNaN(d[variable]) == false) ? y(d[variable]) : barHeight;
                }else if (parentClass.search(3) > -1) {
                  return (isNaN(d[WHITE]) == false) ? y(d[WHITE]) : barHeight;
                } else if (parentClass.search(4) > -1) { 
                  return (isNaN(d[NONWHITE]) == false) ? y(d[NONWHITE]) : barHeight;
                }
              })
              .attr("height", function(d) {
                if (parentClass.search(2) > -1) { 
                  return (isNaN(d[variable]) == false) ? barHeight - y(d[variable]) : 0;
                }else if (parentClass.search(3) > -1) {
                  return (isNaN(d[WHITE]) == false) ? barHeight - y(d[WHITE]) : 0;
                } else if (parentClass.search(4) > -1) { 
                  return (isNaN(d[NONWHITE]) == false) ? barHeight - y(d[NONWHITE]) : 0;
                }
              })
              .attr("fill", function(d) {
               return "#000000"
              })
          })

        if (countyID == "") { 
          d3.selectAll(".g-1").style("opacity", 0)
          d3.selectAll(".g-2").style("opacity", 1)
          d3.select(".g-2").select(".g-text > text")
            .text(function() {
              return [selected["properties"]["state"]]
            })
          d3.select(".bar.g-0")
            .transition()
            .duration(300)
            .attr("y", function(d) {  
                return (d[variable] == undefined) ? barHeight :y(d[variable])
            })
            .attr("height", function(d) {
                return (d[variable] == undefined) ? 0 : barHeight - y(d[variable])
            })

          } else if (countyID !== "") { 
              var stateData = tmp_state.filter(function(d){
                  return d.properties.abbr == state
              })
              state_data.forEach(function(d) { 
                d.national = +d.values[0][variable]
              })
              state_data.forEach(function(d) { 
                d.white = +d.values[0][WHITE];
              })
              state_data.forEach(function(d) { 
                d.nonwhite = +d.values[0][NONWHITE]
              })
              d3.selectAll(".g-1").style("opacity", 1)
              d3.selectAll(".g-2").style("opacity", 1)
              d3.select(".g-2").select(".g-text > text")
                .text(function() {
                  return [selected["properties"]["county"]]
                })              
              d3.select(".g-1").select(".g-text > text")
                .text(function() {
                  return [stateData[0]["properties"]["state"]]
                })
              d3.select(".bar.g-0")
                .transition()
                .duration(300)
                .attr("y", function(d) {  
                    return (d[variable] == undefined) ? barHeight :y(d[variable])
                })
                .attr("height", function(d) {
                    return (d[variable] == undefined) ? 0 : barHeight - y(d[variable])
                })
              d3.select(".bar.g-1")
                .data([stateData[0]["properties"]])
                .transition()
                .duration(300)
                .attr("y", function(d) {  
                    return (d[variable] == undefined) ? barHeight :y(d[variable])
                })
                .attr("height", function(d) {
                    return (d[variable] == undefined) ? 0 : barHeight - y(d[variable])
                })
          }
        }

  }
  function addTag(state, county, abbr) { 
      d3.selectAll('li.tagit-choice').remove()
      var newTag = $("ul.tagit").append('<li id="state" class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable"></li>')
      $('li#state').insertBefore(".tagit-new").append('<span class="tagit-label">' + state + '</span>')
      $('li#state').append('<a class="tagit-close"</a>')
      $("li#state > a.tagit-close").append('<span class="text-icon"</span>')
      $("li#state > a.tagit-close").append('<span class="ui-icon ui-icon-close"</span>')
      setZoom(false,true, false)
      $("li#state").on('click', function() {
        d3.selectAll('li.tagit-choice').remove()

        d3.selectAll("path.selected")
          .classed("selected", false)
        d3.select("#location").html("National")
        setZoom(true,false, false)
        zoomMap(null, null, "national")
      })
    if (county != undefined) { 
      var newTag = $("ul.tagit").append('<li id="county" class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable"></li>')
      $('li#county').insertBefore(".tagit-new").append('<span class="tagit-label">' + county + ', ' + abbr + '</span>')
      $('li#county').append('<a class="tagit-close"</a>')
      $("li#county > a.tagit-close").append('<span class="text-icon"</span>')
      $("li#county > a.tagit-close").append('<span class="ui-icon ui-icon-close"</span>')
      setZoom(false,true, true)
      $("li#county").on('click', function() {
        setZoom(false,true, false)
        var filteredData = tmp_state.filter(function(d) {
            return d.properties["state"] == state;
        })
        d3.select(this).remove()
        d3.select("#location").html(state)
        d3.selectAll(".counties > path.selected")
          .classed("selected", false)
        updateBars(SELECTED_VARIABLE, filteredData[0])
        updateTable(filteredData[0])
      })
    }
  }
  function updateTable(data) { 
    var data = (zoomNational == true) ? data : data["properties"];
    d3.selectAll(".cell-data")
      .each(function(d,i) { 
        var rowVariable = [rowData[i]],
            rowVariable_nw = rowVariable + "_nw";
            rowVariable_wh = rowVariable + "_wh";
        d3.select(this).selectAll("td")
          .text(function(d,i) { 
            if (i==0) { 
              return ((data[rowVariable]) == undefined || (typeof data[rowVariable]) == 'string') ? "-" : formatNumber(data[rowVariable]);
            }else if (i==1){ 
              return ((data[rowVariable_wh]) == undefined || (typeof data[rowVariable_wh]) == 'string') ? "-" : formatNumber(data[rowVariable_wh]);
            }else if (i==2) {
              return ((data[rowVariable_nw]) == undefined || (typeof data[rowVariable_nw]) == 'string') ? "-" : formatNumber(data[rowVariable_nw]);
            }
          })
      })
  }
  function zoomMap(d, data, zoomLevel) { 
    var x, y, k;
    // if (d.properties.state && centered !== d.properties.state && zoomLevel != "national") { 
    if (zoomLevel != "national") { 
      d3.selectAll("path").classed("selected", false)
      d3.select("path#" + d["properties"]["abbr"])
        .classed("selected", true)
        .moveToFront()
      d3.select("#location").html(d["properties"]["state"])
      setZoom(false, true, false)
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
      g.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });

      g.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");
      if (zoomLevel == "county") { 
          setZoom(false, true, true)
          d3.select("#location").html(d["properties"]["county"] + ", " + d["properties"]["abbr"])
          d3.selectAll("g.counties > path").classed("selected", false)
          d3.select("path#" + d["properties"]["abbr"] + d.id)
            .classed("selected", true)
            .moveToFront()
          // updateTable(data)
      }
    } else { 
      x = width / 1.4;
      y = height / 1.4;
      k = .7;
      centered = null;
      updateTable(us_data)
      g.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });

      g.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");
    }
      updateBars(SELECTED_VARIABLE, d)

  }

  function zoomed() {
    g.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
  }
  $(window).resize(function() { 
    setWidth($('.td-map').width())
    d3.select("g").attr("transform", "scale(" + $(".td-map").width()/960 + ")");
    $("table").height($("table").width()*0.8);

    var width = $('.td-map').width()
    var height = width*.7
    d3.select("#map").select('svg')
      .attr('width', width)
      .attr('height', height)
    svg.select("rect")
      .attr('width', width)
      .attr('height', height)
    d3.select("#legend").select("svg")
      .attr("width", width)
      .attr("height", height/5)
    legendSvg.select("g")
    .attr("width", width/3)
    .attr("transform", "translate("+width/3+"," + 10 + ")")
  })


};






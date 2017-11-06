var BREAKS ={"perc_debt_collect":[0.219, .309, .389, .489], "med_debt_collect":[1199, 1499, 1799, 2299], "perc_debt_med":[.109,.179,.259,.339], "med_debt_med":[499,699,949,1250], "perc_pop_wh":[.129,.279,.459,.669], "perc_pop_ins":[.079,.129,.179,.259], "avg_income":[52649,63849,77899,101049]}
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
var dropdown;
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

var width = ((tdMap) - margin.left -margin.right)*.86,
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
          if (isNaN(+d.values[0][property]) == true && property != "state" && property != "abbr" && property != "county") {
            e[property] == null
          }else {
            e[property] = d.values[0][property]
          }
        }
      }
    })
  })
  var state_data = transformData(state)
  state_data.forEach(function(d,i){ 
    stateData.forEach(function(e, j) { 
      if (+d.key == e.id) {
        for (var property in d["values"][0]) {
          if (isNaN(+d.values[0][property]) == true && property != "state" && property != "abbr" && property != "county") {
            e[property] == null
          }else { 
            e[property] = d.values[0][property]
          }
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

    function createSearchArray(filter) {
      var searchArray = [];
      if (zoomNational == true) {
        for (var i = 0; i<tmp_state.length; i++){
         searchArray.push(tmp_state[i]["properties"]["state"])
        }
        for (var i = 0; i<tmp_county.length; i++){
         searchArray.push(tmp_county[i]["properties"]["county"] + ", " + tmp_county[i]["properties"]["abbr"])
        }
      }else if (zoomState == true) { 
        for (var i = 0; i<tmp_county.length; i++){ 
          if (tmp_county[i]["properties"]["abbr"] == filter) {
            searchArray.push(tmp_county[i]["properties"]["county"] + ", " + tmp_county[i]["properties"]["abbr"])
          }
        }
      }
     dropdown = searchArray
     $('input[name="tags"').tagit("option", {availableTags: dropdown})
    }

    $( "#searchBox" ).autocomplete({ 
      appendTo: ".search-div"
    });

    $('input[name="tags"').tagit({
        availableTags: dropdown,
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
          if(dropdown.indexOf(ui.tagLabel) == -1){ 
            return false;
          }
          if(ui.tagLabel == "not found"){
              return false;
          }
        },
        afterTagAdded: function(event, ui) { 
          // console.log($('input[name="tags"').tagit('assignedTags'))
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
          var data = filteredData[0]
          zoomMap(data, geoType)
          if (county != "") { 
            addTag(data["properties"]["state"], county, state)
          }else {
            var filter = data["properties"]["abbr"]
            createSearchArray(filter)
          }

        },
        afterTagRemoved: function(event,ui) { 
          // console.log($('input[name="tags"').tagit('assignedTags'))

           var tag = (ui.tag[0]["textContent"]);
           if (tag.search(",") > 0) {
            d3.selectAll(".counties > path.selected")
              .classed("selected", false)
            setZoom(false, true, false)
           }else {
            d3.select("#location").html("National")
            setZoom(true, false, false)
            zoomMap(null, "national")
           }
          updateBars(SELECTED_VARIABLE)
        }
    });

    createSearchArray("")

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
    .domain(BREAKS[SELECTED_VARIABLE])
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
    .attr("transform", "scale(" + $(".td-map").width()/1060 + ")");
  g.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(tmp_county)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function (d) { return d.properties.abbr + d.id; })
    .style("fill", function(d){
        return ((d.properties[SELECTED_VARIABLE]) == null) ? "#adabac" : COLORS[quantize(d.properties[SELECTED_VARIABLE])];
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
        zoomMap(d, level)
        updateBars(SELECTED_VARIABLE, d)
      }
    })
    .on('mouseover', function(d) { 
      var previousState = (d3.select(".state-borders > path.selected").node() != null) ? d3.select(".state-borders > path.selected").attr("id") : ""
      var hoveredState = d.properties.abbr
      var geography = (zoomState == true && previousState == hoveredState) ? "county" : "state";
      var county = (geography == "county") ? d.properties.county : ""
      var state = d.properties.abbr
      if (zoomNational == true ) { 
        $(".state-borders").css("pointer-events", "all")
        $(".counties").css("pointer-events", "none")
        hoverLocation("", d.properties.abbr, "state");
        updateBars(SELECTED_VARIABLE, d) 
      }else{
        if (geography == "state") { 
          hoverLocation(county, state, geography)
          updateBars(SELECTED_VARIABLE, d3.select("path#" + hoveredState).datum())
        }else {
          hoverLocation(county, state, geography)
          updateBars(SELECTED_VARIABLE, d)
        }
        // $(".state-borders").css("pointer-events", "none")
        // $(".counties").css("pointer-events", "all")

      }
    })
    .on('mouseout', function(d) { 
      if (d3.select(".counties > path.selected").node() != undefined) { //IF A COUNTY IS SELECTED
        var county = d3.select(".counties > path.selected").datum().properties.county
        var abbr = d3.select(".counties > path.selected").datum().properties.abbr
        d3.select("#location").html(county + ", " + abbr)
        setZoom(false, false, true)
        updateBars(SELECTED_VARIABLE, d3.select(".counties > path.selected").datum())
      }else if (d3.select(".state-borders > path.selected").node() != undefined) { //IF A STATE IS SELECTED
        var state = d3.select(".state-borders > path.selected").datum().properties.state
        d3.select("#location").html(state)
        setZoom(false, true, false)
        updateBars(SELECTED_VARIABLE, d3.select(".state-borders > path.selected").datum())
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
      // $(".state-borders").css("pointer-events", "none")
      // $(".counties").css("pointer-events", "all")
      addTag(state, null, abbr)
      zoomMap(d, level)
      updateBars(SELECTED_VARIABLE, d)
    })
    .on('mouseover', function(d) { 
      if (zoomNational == true) { 
        // $(".state-borders").css("pointer-events", "all")
        // $(".counties").css("pointer-events", "none")
        hoverLocation("", d.properties.abbr, "state");
        updateBars(SELECTED_VARIABLE, d) 
      }else {
        // $(".state-borders").css("pointer-events", "none")
        // $(".counties").css("pointer-events", "all")

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
          updateBars(SELECTED_VARIABLE, undefined)
        }
      }
    })

/*LEGEND*/
 var legendSvg = d3.select("#map")
    .append("svg")
    .attr("height", height)
    .attr("width", 50)

  var legend = legendSvg.append("g")
    .attr("transform", "translate("+0+"," + 10 + ")")
  var keyWidth =   15;
  var keyHeight =  30;
 for (i=0; i<=5; i++){
  if(i !== 5){  
    legend.append("rect")
      .attr("width",keyWidth)
      .attr("height",keyHeight)
      .attr("class","rect"+i)
      .attr("y",keyHeight*i)
      .attr("x", 38)
      .style("fill", COLORRANGE[i])
      // .on("mouseover",function(){ mouseEvent({type: "Legend", "class": (d3.select(this).attr("class"))}, "hover") })
      // .on("mouseleave", function(){
      //   d3.selectAll(".demphasized").classed("demphasized",false)
      // })
  //     .on("click",function(){ mouseEvent(dataID, {type: "Legend", "class": "q" + (this.getAttribute("x")/keyWidth) + "-4"}, "click") })
    legend.append("text")
      .attr("x", 33)
      .attr("class","legend-labels")
      .attr("y",keyHeight*i)
      .attr("text-anchor", "end")
      .text(function(){
        var min = d3.min(tmp_county, function(d) { 
          return d.properties[SELECTED_VARIABLE]
        })
        var array = BREAKS[SELECTED_VARIABLE]
        return (i==0) ? formatNumber(min) : formatNumber((array[i-1]))
      })
   }
   if (i == 5) { 
    legend.append("text")
      .attr("x", 33)
      .attr("class","legend-labels")
      .attr("text-anchor", "end")
      .attr("y",keyHeight*i)
      .text(function(){
        var max = d3.max(tmp_county, function(d) { 
          return d.properties[SELECTED_VARIABLE]
        })
        return formatNumber(max)
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
    var id = (geography == "county") ? filteredData[0]["id"] : ""
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
          return "cell-column"
        }else {
          return "cell-data"
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

  var barSvgHeight = height/4
  var barHeight = barSvgHeight*.5
  var x = d3.scaleBand()
    .rangeRound([0, width/11])
  var y = d3.scaleLinear()
      .rangeRound([barHeight, 0]);
  state_data.forEach(function(d) { 
    d.national = +d.values[0][SELECTED_VARIABLE]
  })
  state_data.forEach(function(d) { 
    d.white = +d.values[0][WHITE];
  })
  state_data.forEach(function(d) { 
    d.nonwhite = +d.values[0][NONWHITE]
  })
  x.domain([[us_data].map(function(d){ 
    return d.abbr
  })]);
  y.domain([0, d3.max(state_data, function(d) {
    if (isNaN(d.nonwhite) == true && isNaN(d.white) == true){
      return d.national
    }else if (isNaN(d.nonwhite) == true && isNaN(d.white) == false) {
      return Math.max(d.white, d.national)
    }else if (isNaN(d.white) == true && isNaN(d.nonwhite) == false) {
      return Math.max(d.nonwhite, d.national)
    }else {
      return Math.max(d.white, d.nonwhite, d.national)
    }
  })])

    // y.domain([0, d3.max(data, function(d) {
    //   if (d.white == undefined && d.nonwhite == undefined) {
    //     return d.national
    //   }else if (d.white == undefined) {
    //     return (d.national < d.nonwhite) ? d.nonwhite : d.national
    //   }else if (d.nonwhite == undefined) {
    //     return (d.national < d.white) ? d.white : d.national
    //   }else {
    //     if (d.national >= d.white && d.national >= d.nonwhite) {
    //       return d.national
    //     }else if (d.white >= d.national ** d.white >= d.nonwhite) {
    //         return d.white
    //     }else {
    //       return d.nonwhite
    //     }
    //   }
    // })])

  var formatPercent = d3.format(".0%")
  var xAxis = d3.axisBottom()
      .scale(x)
  var yAxis = d3.axisLeft()
      .scale(y)
      .tickFormat(formatPercent);
  // var barCategories = ["National", "State", "State", "White", "Nonwhite"]
  var groups = ["National", "State", "County"]
  var categories = ["Overall", "White", "Nonwhite"]
  var barSvg = d3.select("#bar-chart")
    .append("svg")
    .attr('width', width)
    .attr('height', barSvgHeight)
  var barG = barSvg.selectAll("g")
    .data(groups)
    .enter()
    .append('g')
    .attr("transform", function(d,i) {
      return "translate(" + (width/3 * i + 10) + "," + (17) + ")"
    })
    .attr("id", function(d) { 
      return d
    })
  barG.append("text")
    .text(function(d) {
      return d;
    })
    .attr("class", function(d) {
      return "group-label " + d
    })
  barG.append("text")
    .attr("class", "group-label-2")
    .attr("transform", function(d,i) {
      var width = (d3.select(".group-label." + d).node().getBoundingClientRect().width) + 5
      return "translate(" + width + "," + 0 + ")"
    })
  // var subBarText = barG.selectAll("g")
  //   .data(categories)
  //   .enter()
  //   .append("g")
  //   .attr("class", "g-label")
  //   .attr("transform", function(d,i) {
  //     return "translate(" + (width/9 * i ) + "," + 0 + ")"
  //   })
  // subBarText.append("text")
  //   .text("hello")
  var subBarG = barG.selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", function(d) {
      return "category " + d
    })
    .attr("transform", function(d,i) {
      return "translate(" + (width/10 * i ) + "," + 10 + ")"
    })
  subBarG.selectAll("text")
    .data([us_data])
    .enter()
    .append("text")
    .attr("class", "data-label")
    .attr("transform", function(d,i) {
      return "translate(" + 0 +"," + 10+ ")"
    })
    .text(function(d) { 
      var parentClass = d3.select(this.parentNode).attr('class');
      if (parentClass.search("Overall") > -1) {
        return formatNumber(d[SELECTED_VARIABLE])
      }else if (parentClass.search("Non") > -1) {
        return formatNumber(d[NONWHITE])
      }else{
        return formatNumber(d[WHITE])
      }
    })

  //add background rects
  
  var rectG = subBarG.append("g")
    .attr("class", function(d) { 
      return "rect-g " + d})
    .attr("transform", function(d,i) {
      return "translate(" + 0 +"," + 15+ ")"
    })
  rectG
    .append("g")
    .attr("class", "g-text")
    .append("text")
    .attr("x", 0)
    .attr("y", barHeight*1.1)
    .attr("dy", ".71em")
    .attr("text-anchor", "start")
    .attr("font-size", "1.1em")
    .text(function(d) { return d});
  rectG.append("g")
    .attr("class", "x axis")
    .attr("transform", function(d,i) {
      return "translate(" + 0 +"," + barHeight+ ")"
    })
    .call(xAxis)
  rectG.selectAll("rect")
    .data([us_data])
    .enter()
    .append("rect")
    .attr("x", function(d) { 
      return d.abbr
    })
    .attr("class", "background-rect")
    .attr("width", x.bandwidth())
    // .attr("y", function(d) { 
    //   var parentClass = d3.select(this.parentNode).attr('class');
    //   if (parentClass.search("Overall") > -1) {
    //     return y(d[SELECTED_VARIABLE])
    //   }else if (parentClass.search("Non") > -1) {
    //     return y(d[NONWHITE])
    //   }else{
    //     return y(d[WHITE])
    //   }
    // })
    .attr("height", function(d) {
      var parentClass = d3.select(this.parentNode).attr('class');
      if (parentClass.search("Overall") > -1) {
        return barHeight //- y(d[SELECTED_VARIABLE])
      }else if (parentClass.search("Non") > -1){
        return barHeight //- y(d[NONWHITE])
      }else{
        return barHeight //- y(d[WHITE])
      }
    })
    .style("fill", "#adabac")
  //add bars
  rectG.selectAll("rect:not(.background-rect)")
    .data([us_data])
    .enter()
    .append("rect")
    .attr("x", function(d) { 
      return d.abbr
    })
    .attr("class", "bar")
    .attr("fill", function(d) { 
      var parentClass = d3.select(this.parentNode).attr('class');
      if (parentClass.search("Overall") > -1) {
        return "#fdbf11"
      }else if (parentClass.search("Non") > -1) {
        return "#000000"
      }else{
        return "#1696d2"
      }
    })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { 
      var parentClass = d3.select(this.parentNode).attr('class');
      if (parentClass.search("Overall") > -1) {
        return y(d[SELECTED_VARIABLE])
      }else if (parentClass.search("Non") > -1) {
        return y(d[NONWHITE])
      }else{
        return y(d[WHITE])
      }
    })
    .attr("height", function(d) {
      var parentClass = d3.select(this.parentNode).attr('class');
      if (parentClass.search("Overall") > -1) {
        return barHeight - y(d[SELECTED_VARIABLE])
      }else if (parentClass.search("Non") > -1){
        return barHeight - y(d[NONWHITE])
      }else{
        return barHeight - y(d[WHITE])
      }
    })

  d3.selectAll("#State, #County").style("opacity", 0)

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
      .domain(BREAKS[variable])
      .range(d3.range(5).map(function(i) { return "q" + i + "-5"; }))

    d3.selectAll(".legend-labels")
      .each(function(d,i) {
        d3.select(this)
          .text(function(){
            var min = d3.min(tmp_county, function(d) {
              return d.properties[variable]
            })
            var max = d3.max(tmp_county, function(d) {
              return d.properties[variable]
            })
            var array = BREAKS[SELECTED_VARIABLE]
            if (i==0) {
              return formatNumber(min)
            }else if (i==5) {
              return formatNumber(max)
            }else {
              return formatNumber(array[i-1])
            }
        })
      })
    d3.select(".counties").selectAll("path")
    .transition()
    .duration(800)
    .style("fill", function(d){
        return ((d.properties[variable]) == null) ? "#adabac" : COLORS[quantize(d.properties[variable])];
    })
    var selected = (d3.select("path.selected").node() != null) ? (d3.select("path.selected").datum()) : undefined

    updateBars(variable, selected)
  }
  function updateBars(variable, selected) { 
    
    var WHITE = variable + "_wh"
    var NONWHITE = variable + "_nw"
    var data = (zoomCounty == true) ? county_data : state_data;
    var x = d3.scaleBand()
      .rangeRound([0, width/9])
      .padding(0.1)
    // var y = d3.scaleLinear()
    //   .rangeRound([barHeight, 0]);
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
      if (isNaN(d.nonwhite) == true && isNaN(d.white) == true){
        return d.national
      }else if (isNaN(d.nonwhite) == true && isNaN(d.white) == false) {
        return Math.max(d.white, d.national)
      }else if (isNaN(d.white) == true && isNaN(d.nonwhite) == false) {
        return Math.max(d.nonwhite, d.national)
      }else {
        return Math.max(d.white, d.nonwhite, d.national)
      }
    })])
    // y.domain([0, d3.max(data, function(d) {
    //   if (d.white == undefined && d.nonwhite == undefined) {
    //     return d.national
    //   }else if (d.white == undefined) {
    //     return (d.national < d.nonwhite) ? d.nonwhite : d.national
    //   }else if (d.nonwhite == undefined) {
    //     return (d.national < d.white) ? d.white : d.national
    //   }else {
    //     if (d.national >= d.white && d.national >= d.nonwhite) {
    //       return d.national
    //     }else if (d.white >= d.national ** d.white >= d.nonwhite) {
    //         return d.white
    //     }else {
    //       return d.nonwhite
    //     }
    //   }
    // })])

      var National = d3.select("#National").selectAll(".category")
      National
        .each(function() {
          d3.select(this).select(".bar")
            .data([us_data])
            .transition()
            .duration(300)
            .attr("y", function(d) {  
              var parentClass = d3.select(this.parentNode).attr('class');
              if (parentClass.search("Overall") > -1) { 
                return ((d[variable]) != undefined) ? y(d[variable]) : barHeight;
              }else if (parentClass.search("Non") > -1) { 
                return ((d[NONWHITE]) != undefined) ? y(d[NONWHITE]) : barHeight;
              }else {
                return ((d[WHITE]) != undefined) ? y(d[WHITE]) : barHeight;
              }
            })
            .attr("height", function(d) { 
              var parentClass = d3.select(this.parentNode).attr('class');
              if (parentClass.search("Overall") > -1) { 
                return ((d[variable]) != undefined) ? barHeight - y(d[variable]) : 0;
              }else if (parentClass.search("Non") > -1){ 
                return ((d[NONWHITE]) != undefined) ? barHeight - y(d[NONWHITE]) : 0;
              }else {
                return ((d[WHITE]) != undefined) ? barHeight - y(d[WHITE]) : 0;
              }
            })
          d3.select(this).select(".data-label")
            .data([us_data])
            .text(function(d) {
              var parentClass = d3.select(this.parentNode).attr('class');
              if (parentClass.search("Overall") > -1) { 
                return ((d[variable]) != undefined) ? formatNumber(d[variable]) : ""
              }else if (parentClass.search("Non") > -1) {
                return ((d[NONWHITE]) != undefined) ? formatNumber(d[NONWHITE]) : ""
              }else{
                return ((d[WHITE]) != undefined) ? formatNumber(d[WHITE]) : ""
              }
            })
        })
      // if (mouseout == true) { //NATIONAL VIEW AND MOUSE OUT STATES



      // }else { console.log(d3.select(this))
        // var State = d3.select("#State").selectAll(".category")
        // State
        //   .each(function() {
        //     d3.select(this).select(".bar")
        //       .data([state_data])
        //       .transition()
        //       .duration(300)
        //       .attr("y", function(d) {  console.log(d)
        //         var parentClass = d3.select(this.parentNode).attr('class');
        //         if (parentClass.search("Overall") > -1) { 
        //           return (isNaN(d[variable]) == false) ? y(d[variable]) : barHeight;
        //         }else if (parentClass.search("Non") > -1) {
        //           return (isNaN(d[NONWHITE]) == false) ? y(d[NONWHITE]) : barHeight;
        //         }else {
        //           return (isNaN(d[WHITE]) == false) ? y(d[WHITE]) : barHeight;
        //         }
        //       })
        //       .attr("height", function(d) {
        //         var parentClass = d3.select(this.parentNode).attr('class');
        //         if (parentClass.search("Overall") > -1) {
        //           return (isNaN(d[variable]) == false) ? barHeight - y(d[variable]) : 0;
        //         }else if (parentClass.search("Non") > -1){
        //           return (isNaN(d[NONWHITE]) == false) ? barHeight - y(d[NONWHITE]) : 0;
        //         }else {
        //           return (isNaN(d[WHITE]) == false) ? barHeight - y(d[WHITE]) : 0;
        //         }
        //       })
        //   })
      // }
      if (zoomNational == true && selected == undefined) {  
        d3.selectAll("#State, #County").style("opacity", 0)
      } else if (zoomNational == false || selected != undefined) { //IF MOUSE IS OVER A STATE OR COUNTY IN WHICHEVER VIEW
        var countyID = (d3.select(".counties > path.selected").node() == null) ? "" : d3.select(".counties > path.selected").attr("id");
        var countyIDHov = (d3.select(".counties > path.hover").node() == null) ? "" : d3.select(".counties > path.hover").attr("id");
        var county = countyID.slice(2,)
        var state = selected["properties"]["abbr"]
        var data = (county == "") ? tmp_state : tmp_county
        var State = d3.select("#State").selectAll(".category")
        var selectedState = d3.select("path#" + selected["properties"]["abbr"]).datum()
        var stateData = selectedState["properties"]
        
        d3.select("#State").select(".group-label-2").text(stateData["state"])
        State
          .each(function() {
            d3.select(this).select(".bar")
              .data([stateData])
              .transition()
              .duration(300)
              .attr("y", function(d) {  
                var parentClass = d3.select(this.parentNode).attr('class');
                if (parentClass.search("Overall") > -1) { 
                  return ((d[variable]) != undefined) ? y(d[variable]) : barHeight;
                }else if (parentClass.search("Non") > -1) {
                  return ((d[NONWHITE]) != undefined) ? y(d[NONWHITE]) : barHeight;
                }else {
                  return ((d[WHITE]) != undefined) ? y(d[WHITE]) : barHeight;
                }
              })
              .attr("height", function(d) {
                var parentClass = d3.select(this.parentNode).attr('class');
                if (parentClass.search("Overall") > -1) {
                  return ((d[variable]) != undefined) ? barHeight - y(d[variable]) : 0;
                }else if (parentClass.search("Non") > -1){
                  return ((d[NONWHITE]) != undefined) ? barHeight - y(d[NONWHITE]) : 0;
                }else {
                  return ((d[WHITE]) != undefined) ? barHeight - y(d[WHITE]) : 0;
                }
              })
            d3.select(this).select(".data-label")
              .data([stateData])
              .text(function(d) {
                var parentClass = d3.select(this.parentNode).attr('class');
                if (parentClass.search("Overall") > -1) { 
                  return ((d[variable]) != undefined) ? formatNumber(d[variable]) : ""
                }else if (parentClass.search("Non") > -1) {
                  return ((d[NONWHITE]) != undefined) ? formatNumber(d[NONWHITE]) : ""
                }else{
                  return ((d[WHITE]) != undefined) ? formatNumber(d[WHITE]) : ""
                }
              })
          })

            if (countyID !== "" || countyIDHov !== "") { 
              d3.selectAll("#National, #State, #County").style("opacity", 1)
              // var stateData = tmp_state.filter(function(d){
              //     return d.properties.abbr == state
              // })
              // state_data.forEach(function(d) { 
              //   d.national = +d.values[0][variable]
              // })
              // state_data.forEach(function(d) { 
              //   d.white = +d.values[0][WHITE];
              // })
              // state_data.forEach(function(d) { 
              //   d.nonwhite = +d.values[0][NONWHITE]
              // })
            var County = d3.select("#County").selectAll(".category")
            var countyData = selected["properties"]
            d3.select("#County").select(".group-label-2").text(countyData["county"])

            County
              .each(function() {
                d3.select(this).select(".bar")
                  .data([countyData])
                  .transition()
                  .duration(300)
                  .attr("y", function(d) {  
                    var parentClass = d3.select(this.parentNode).attr('class');
                    if (parentClass.search("Overall") > -1) { 
                      return ((d[variable]) != undefined) ? y(d[variable]) : barHeight;
                    }else if (parentClass.search("Non") > -1) {
                      return ((d[NONWHITE]) != undefined) ? y(d[NONWHITE]) : barHeight;
                    }else {
                      return ((d[WHITE]) != undefined) ? y(d[WHITE]) : barHeight;
                    }
                  })
                  .attr("height", function(d) {
                    var parentClass = d3.select(this.parentNode).attr('class');
                    if (parentClass.search("Overall") > -1) {
                      return ((d[variable]) != undefined) ? barHeight - y(d[variable]) : 0;
                    }else if (parentClass.search("Non") > -1){
                      return ((d[NONWHITE]) != undefined) ? barHeight - y(d[NONWHITE]) : 0;
                    }else {
                      return ((d[WHITE]) = undefined) ? barHeight - y(d[WHITE]) : 0;
                    }
                  })
                d3.select(this).select(".data-label")
                  .data([countyData])
                  .text(function(d) {
                    var parentClass = d3.select(this.parentNode).attr('class');
                    if (parentClass.search("Overall") > -1) { 
                      return ((d[variable]) != undefined) ? formatNumber(d[variable]) : ""
                    }else if (parentClass.search("Non") > -1) {
                      return ((d[NONWHITE]) != undefined) ? formatNumber(d[NONWHITE]) : ""
                    }else{
                      return ((d[WHITE]) != undefined) ? formatNumber(d[WHITE]) : ""
                    }
                  })
              })
          }else {
            d3.selectAll("#County").style("opacity", 0)
            d3.selectAll("#National, #State").style("opacity", 1)
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
        zoomMap(null, "national")
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
  function zoomMap(d,zoomLevel) { 
    var x, y, k;
    // if (d.properties.state && centered !== d.properties.state && zoomLevel != "national") { 
    if (zoomLevel != "national") { 
      $(".state-borders").css("pointer-events", "none")
      $(".counties").css("pointer-events", "all")
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
      var data = (zoomLevel == "state") ? d3.select("path#" + selectedState.properties.abbr).datum() : d;
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
      setZoom(true, false, false)
      $(".state-borders").css("pointer-events", "all")
      $(".counties").css("pointer-events", "none")
      x = width / 1.8;
      y = height / 1.7;
      k = .8;
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
    d3.select("g").attr("transform", "scale(" + $(".td-map").width()/1060 + ")");
    $("table").height($("table").width()*0.8);

    var width = ($('.td-map').width() - margin.left -margin.right) * .86,
        height = (width*.7) - margin.top-margin.bottom
    d3.select("#map").select('svg')
      .attr('width', width)
      .attr('height', height)
    svg.select("rect")
      .attr('width', width)
      .attr('height', height)
    // d3.select("#legend").select("svg")
    //   .attr("width", width)
    //   .attr("height", height/2)
 
  })


};






var SELECTED_VARIABLE = "debt_collect_all";
var width = 960,
    height = 600,
    centered,
    selectedState;
var zoom = d3.zoom()
    // .translate([0, 0])
    // .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "background")
    // .on("click", clicked);
var path = d3.geoPath()
var g = svg.append("g")


var quantize = d3.scaleQuantize()
  .domain([0, 1])
  .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));
var COLORS = 
  {
    "q0-6": "#cae0e7",
    "q1-6": "#95c0cf",
    "q2-6": "#60a1b6",
    "q3-6": "#008bb0",
    "q4-6": "#1d5669",
    "q5-6": "#0e2b35"
  }
// d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
//   if (error) throw error;
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data/county_medical_debt.csv")
    .defer(d3.csv, "data/state_medical_debt.csv")
    .await(ready);
function zoomed() {
  console.log('zoomed')
  g
   .attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
}
function transformData(geography){
  var geography_nested = d3.nest()
    .key(function(d) { return d.id })
    .entries(geography);
  return geography_nested
}


function ready(error, us, county, state) {
  if (error) throw error;
  var county = transformData(county)
  var countyData = us.objects.counties.geometries
  county.forEach(function(d,i){ 
    countyData.forEach(function(e, j) { 
      if (d.key == e.id) {
       for (var property in d["values"][0]) {
          e[property] = d.values[0][property]
        }
      }
    })
  })
  var state = transformData(state)
    var stateData = us.objects.states.geometries
      state.forEach(function(d,i){ 
        stateData.forEach(function(e, j) { 
          if (d.key == e.id) {
            for (var property in d["values"][0]) {
              e[property] = d.values[0][property]
            }
          }
        })
      })
      console.log(countyData)
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
      clicked(d)
    })
    .call(zoom)

  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path)

function clicked(d) {
  // zoomed()
  var x, y, k;

  if (d.properties.state && centered !== d.properties.state) { console.log(d)
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
  } 
  else {console.log('2')
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

};


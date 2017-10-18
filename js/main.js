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
          e.state = d.values[0].state;
          e.county = d.values[0].county;
          e.debt_collect_all = d.values[0].debt_collect_all;
          e.median_collect_all = d.values[0].median_collect_all;
          e.medical_debt_collect_all = d.values[0].medical_debt_collect_all;
          e.median_medical_collect_all = d.values[0].median_medical_collect_all;
          e.debt_collect_nonwhite = d.values[0].debt_collect_nonwhite;
          e.median_collect_nonwhite = d.values[0].median_collect_nonwhite;
          e.medical_debt_collect_nonwhite = d.values[0].medical_debt_collect_nonwhite;
          e.median_medical_collect_nonwhite = d.values[0].median_medical_collect_nonwhite;
          e.debt_collect_white = d.values[0].debt_collect_white;
          e.median_collect_white = d.values[0].median_collect_white;
          e.medical_debt_collect_white = d.values[0].medical_debt_collect_white;
          e.median_medical_collect_white = d.values[0].median_medical_collect_white;
          e.pop_white = d.values[0].pop_white;
          e.pop_ins_all = d.values[0].pop_ins_all;
          e.pop_white_ins = d.values[0].pop_white_ins;
          e.pop_nonwhite_ins = d.values[0].pop_nonwhite_ins;
          e.income_all = d.values[0].income_all;
          e.income_white = d.values[0].income_white;
          e.income_nonwhite = d.values[0].income_nonwhite;
          e.ACS5yrdataflag = d.values[0].ACS5yrdataflag;
      }
    })
  })
  var state = transformData(state)
    var stateData = us.objects.states.geometries
      state.forEach(function(d,i){ 
        stateData.forEach(function(e, j) { 
          if (d.key == e.id) {
              e.state = d.values[0].state;
              e.abbr = d.values[0].abbr;
              e.debt_collect_all_st = d.values[0].debt_collect_all_st;
              e.median_collect_all_st = d.values[0].median_collect_all_st;
              e.medical_debt_collect_all_st = d.values[0].medical_debt_collect_all_st;
              e.median_medical_collect_all_st = d.values[0].median_medical_collect_all_st;
              e.debt_collect_nonwhite_st= d.values[0].debt_collect_nonwhite_st;
              e.median_collect_nonwhite_st = d.values[0].median_collect_nonwhite_st;
              e.medical_debt_collect_nonwhite_st = d.values[0].medical_debt_collect_nonwhite_st;
              e.median_medical_collect_nonwhite_st = d.values[0].median_medical_collect_nonwhite_st;
              e.debt_collect_white_st = d.values[0].debt_collect_white_st;
              e.median_collect_white_st = d.values[0].median_collect_white_st;
              e.medical_debt_collect_white_st = d.values[0].medical_debt_collect_white_st;
              e.median_medical_collect_white_st = d.values[0].median_medical_collect_white_st;
              e.pop_white_st = d.values[0].pop_white_st;
              e.pop_ins_all_st = d.values[0].pop_ins_all_st;
              e.pop_white_ins_st = d.values[0].pop_white_ins_st;
              e.pop_nonwhite_ins_st = d.values[0].pop_nonwhite_ins_st;
              e.income_all_st = d.values[0].income_all_st;
              e.income_white_st = d.values[0].income_white_st;
              e.income_nonwhite_st = d.values[0].income_nonwhite_st;
          }
        })
      })
    var tmp_county = topojson.feature(us, us.objects.counties).features;
    for (var i =0; i<tmp_county.length; i++){
      var mergeID = +tmp_county[i]["id"]
      for (var j = 0; j<countyData.length;j++){
        if(+countyData[j]["id"] == mergeID){
          tmp_county[i]["properties"]["state"] = countyData[j]["state"]
          tmp_county[i]["properties"]["county"] = countyData[j]["county"]
          tmp_county[i]["properties"]["debt_collect_all"] = +countyData[j]["debt_collect_all"]
          tmp_county[i]["properties"]["median_collect_all"] = +countyData[j]["median_collect_all"]
          tmp_county[i]["properties"]["medical_debt_collect_all"] = +countyData[j]["medical_debt_collect_all"]
          tmp_county[i]["properties"]["median_medical_collect_all"] = +countyData[j]["median_medical_collect_all"]
          tmp_county[i]["properties"]["debt_collect_nonwhite"] = +countyData[j]["debt_collect_nonwhite"]
          tmp_county[i]["properties"]["median_collect_nonwhite"] = +countyData[j]["median_collect_nonwhite"]
          tmp_county[i]["properties"]["medical_debt_collect_nonwhite"] = +countyData[j]["medical_debt_collect_nonwhite"]
          tmp_county[i]["properties"]["median_medical_collect_nonwhite"] = +countyData[j]["median_medical_collect_nonwhite"]
          tmp_county[i]["properties"]["median_collect_white"] = +countyData[j]["median_collect_white"]
          tmp_county[i]["properties"]["pop_white"] = +countyData[j]["pop_white"]
          tmp_county[i]["properties"]["pop_ins_all"] = +countyData[j]["pop_ins_all"]
          tmp_county[i]["properties"]["pop_white_ins"] = +countyData[j]["pop_white_ins"]
          tmp_county[i]["properties"]["pop_nonwhite_ins"] = +countyData[j]["pop_nonwhite_ins"]
          tmp_county[i]["properties"]["income_all"] = +countyData[j]["income_all"]
          tmp_county[i]["properties"]["income_white"] = +countyData[j]["income_white"]
          tmp_county[i]["properties"]["income_nonwhite"] = +countyData[j]["income_nonwhite"]
          tmp_county[i]["properties"]["ACS5yrdataflag"] = +countyData[j]["ACS5yrdataflag"]

          break;
        }
      }
    }
    console.log(stateData)
    var tmp_state = topojson.feature(us, us.objects.states).features;
    for (var i =0; i<tmp_state.length; i++){
      var mergeIDState = +tmp_state[i]["id"]
      for (var j = 0; j<stateData.length;j++){
        if(+stateData[j]["id"] == mergeIDState){
          tmp_state[i]["properties"]["state"] = stateData[j]["state"]
          tmp_state[i]["properties"]["abbr"] = stateData[j]["abbr"]
          tmp_state[i]["properties"]["debt_collect_all_st"] = +stateData[j]["debt_collect_all_st"]
          tmp_state[i]["properties"]["median_collect_all_st"] = +stateData[j]["median_collect_all_st"]
          tmp_state[i]["properties"]["medical_debt_collect_all_st"] = +stateData[j]["medical_debt_collect_all_st"]
          tmp_state[i]["properties"]["median_medical_collect_all_st"] = +stateData[j]["median_medical_collect_all_st"]
          tmp_state[i]["properties"]["debt_collect_nonwhite_st"] = +stateData[j]["debt_collect_nonwhite_st"]
          tmp_state[i]["properties"]["median_collect_nonwhite_st"] = +stateData[j]["median_collect_nonwhite_st"]
          tmp_state[i]["properties"]["medical_debt_collect_nonwhite_st"] = +stateData[j]["medical_debt_collect_nonwhite_st"]
          tmp_state[i]["properties"]["median_medical_collect_nonwhite_st"] = +stateData[j]["median_medical_collect_nonwhite_st"]
          tmp_state[i]["properties"]["median_collect_white_st"] = +stateData[j]["median_collect_white_st"]
          tmp_state[i]["properties"]["pop_white_st"] = +stateData[j]["pop_white_st"]
          tmp_state[i]["properties"]["pop_ins_all_st"] = +stateData[j]["pop_ins_all_st"]
          tmp_state[i]["properties"]["pop_white_ins_st"] = +stateData[j]["pop_white_ins_st"]
          tmp_state[i]["properties"]["pop_nonwhite_ins_st"] = +stateData[j]["pop_nonwhite_ins_st"]
          tmp_state[i]["properties"]["income_all_st"] = +stateData[j]["income_all_st"]
          tmp_state[i]["properties"]["income_white_st"] = +stateData[j]["income_white_st"]
          tmp_state[i]["properties"]["income_nonwhite_st"] = +stateData[j]["income_nonwhite_st"]
          break;
        }
      }
    }
    console.log(tmp_state)
  g.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(tmp_county)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function (d) { return d.properties.id; })
    .style("fill", function(d){
        return (COLORS[quantize(d.properties[SELECTED_VARIABLE])] == undefined) ? "#adabac" : COLORS[quantize(d.properties[SELECTED_VARIABLE])];
    })
    .on('click', function(d) {console.log('click')
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


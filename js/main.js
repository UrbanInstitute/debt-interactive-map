var SELECTED_VARIABLE = "debt_collect_all";
var width = 960,
    height = 600,
    centered;
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "background")
    .on("click", clicked);
var path = d3.geoPath();
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
    .await(ready);
function transformData(county){
  var county_nested = d3.nest()
    .key(function(d) { return d.id })
    .entries(county);
  return county_nested
}

function clicked(d) {console.log(d)
  var x, y, k;

  if (d && centered !== d) { console.log('1')
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } 
  // else {console.log('2')
  //   x = width / 2;
  //   y = height / 2;
  //   k = 1;
  //   centered = null;
  // }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

function ready(error, us, county) {
    if (error) throw error;
  var county = transformData(county)
  console.log(us)
  var countyData = us.objects.counties.geometries
    county.forEach(function(d,i){
      countyData.forEach(function(e, j) { 
        if (d.key == e.id) { 
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
    console.log(countyData)
  var tmp = topojson.feature(us, us.objects.counties).features;

  for (var i =0; i<tmp.length; i++){
    var mergeID = +tmp[i]["id"]
    for (var j = 0; j<countyData.length;j++){
      if(+countyData[j]["id"] == mergeID){
        tmp[i]["properties"]["debt_collect_all"] = +countyData[j]["debt_collect_all"]
        tmp[i]["properties"]["median_collect_all"] = +countyData[j]["median_collect_all"]
        tmp[i]["properties"]["medical_debt_collect_all"] = +countyData[j]["medical_debt_collect_all"]
        tmp[i]["properties"]["median_medical_collect_all"] = +countyData[j]["median_medical_collect_all"]
        tmp[i]["properties"]["debt_collect_nonwhite"] = +countyData[j]["debt_collect_nonwhite"]
        tmp[i]["properties"]["median_collect_nonwhite"] = +countyData[j]["median_collect_nonwhite"]
        tmp[i]["properties"]["medical_debt_collect_nonwhite"] = +countyData[j]["medical_debt_collect_nonwhite"]
        tmp[i]["properties"]["median_medical_collect_nonwhite"] = +countyData[j]["median_medical_collect_nonwhite"]
        tmp[i]["properties"]["median_collect_white"] = +countyData[j]["median_collect_white"]
        tmp[i]["properties"]["pop_white"] = +countyData[j]["pop_white"]
        tmp[i]["properties"]["pop_ins_all"] = +countyData[j]["pop_ins_all"]
        tmp[i]["properties"]["pop_white_ins"] = +countyData[j]["pop_white_ins"]
        tmp[i]["properties"]["pop_nonwhite_ins"] = +countyData[j]["pop_nonwhite_ins"]
        tmp[i]["properties"]["income_all"] = +countyData[j]["income_all"]
        tmp[i]["properties"]["income_white"] = +countyData[j]["income_white"]
        tmp[i]["properties"]["income_nonwhite"] = +countyData[j]["income_nonwhite"]
        tmp[i]["properties"]["ACS5yrdataflag"] = +countyData[j]["ACS5yrdataflag"]

        break;
      }
    }
  }
  g.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(tmp)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function (d) { return d.properties.id; })
    .style("fill", function(d){
        return (COLORS[quantize(d.properties[SELECTED_VARIABLE])] == undefined) ? "#adabac" : COLORS[quantize(d.properties[SELECTED_VARIABLE])];
    })
    .on('click', function(d) {console.log('click')
      clicked(d)
    })

  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path)

};


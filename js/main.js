//js minified with this line:
//uglifyjs js/main.js --mangle -o js/minified-main.js

var pathFiles = "data/20240715-update/"

function isDelinquency(thisVar) {
  var filters = []
  if(thisVar === "delinquency_by_credit") {
    filters = ["_near", "_pr"]
  } else {
    filters = ["_white", "_com_col"]
  }
  return filters
}


// function toTitleCase(str) {
//   return str.replace(
//     /\w\S*/g,
//     text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
//   );
// }

var Startquery = {};
// DWCut? if it might could be cut/consolidated

if (window.location.search) {
  // If there's a url search query, do a bunch of stuff like create the beginning zoom variables

  // DECODE the query
  //* state being managed in a few different places, gets confusing
  //* this might be easier as a global object like
  // SELECTIONS = {
  //   "state": 1,
  //   "variable": "autoopen_pct",
  //   "type": auto
  // }
  Startquery = decodeQuery(window.location.search)

  if (Startquery["print"] === "true") {
    d3.select("body").classed("print",true)
  }
}


var IS_MOBILE;
var IS_PHONE;
var IS_PHONESM;

// insert here any variables that only have 1 item, namely "Nonwhite population share" and rural population, and in the future, anything else similar.
var limitedVars = ["poc","poprural"]

var SELECTED_VARIABLE;
var WHITE;
var NONWHITE;
var COLORRANGE = ["#cfe8f3", "#73bfe2","#1696d2", "#0a4c6a", "#000000"];
var zoomState;
var zoomNational;
var zoomCounty;
var zoomNational_St;
var type;
var typeVar;
var tdMap;
var printNameFinal;
var active = d3.select(null);
// var margin = (IS_PHONE) ? {top: 10, right: 30, bottom: 10, left: 30} : {top: 10, right: 31, bottom: 10, left: 55}

var dropdown;
var margin = (IS_PHONE) ? {top: 10, right: 30, bottom: 10, left: 30} : {top: 10, right: 0, bottom: 10, left: 45};

function setWidth(width, mobile, phone) {
  var margin = phone ? {top: 10, right: 30, bottom: 10, left: 30} : {top: 10, right: 0, bottom: 10, left: 45};
  if ($("body").width() > 1200) {
    tdMap = 870 - margin.right - margin.left
  }else if ($("body").width() <= 1200 && !mobile){
    tdMap = width - margin.right -margin.left
  }else if (mobile && !phone) {
    tdMap = width
  }else if (phone) {
    tdMap = width - margin.right -margin.left
  }
}

function setScreenState(mobile, phone, phonesm){
  IS_MOBILE = mobile
  IS_PHONE = phone
  IS_PHONESM = phonesm
}

//d3.select(".youth-banner-close").on("click",function () {d3.select(".youth-banner").classed("hidden",true)})
setScreenState(d3.select("#isMobile").style("display") == "block", d3.select("#isPhone").style("display") == "block", d3.select("#isPhoneSm").style("display") == "block" )

// hide ct notes
d3.select("#notes-section > p.note4").style("display", "none")
d3.select("#notes > p.note4").style("display", "none")

function setVariable(variable, phone) {
  if (phone == true) {
    SELECTED_VARIABLE_ph = variable;
    WHITE_ph = variable + isDelinquency(variable)[0]
    NONWHITE_ph = variable + isDelinquency(variable)[1]
  } else {
    SELECTED_VARIABLE = variable;
    WHITE = variable + isDelinquency(variable)[0]
    NONWHITE = variable + isDelinquency(variable)[1]
  }
}

function setZoom(national, state, county, national_st) {
  zoomNational = national;
  zoomState = state;
  zoomCounty = county;
  zoomNational_St = national_st;
}

var initialWidth = (IS_PHONE) ? $('body').width() : $("body").width() - $(".td-table").width() - 15
setWidth(initialWidth, IS_MOBILE, IS_PHONE)

function decodeQuery(location) {

  var validParams = ["county", "variable", "print", "state", "type"]

  var Startquery = location.split("?")
  var obj = {},
  qPos = location.indexOf("?"),
  tokens = location.substr(qPos + 1).split('&'),
  i = tokens.length - 1;
  if (qPos !== -1 || query.indexOf("=") !== -1) {
    for (; i >= 0; i--) {
      var s = tokens[i].split('=');
      if(validParams.indexOf(s[0]) != -1){
        obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null;
      }
    };
  }
  return obj;
}

function updateQueryString(type,variable,state,county,print){

  var queryString = "";

  if (type) {
    queryString += "?type=" + type;
  } else {
    queryString += "";
  }

  if (variable) {
    queryString += "&variable=" + variable;
  } else {
    queryString += "";
  }

  if (state) {
    queryString += "&state=" + state;
  } else {
    queryString += "";
  }

  if (county) {
    if (county.toString().length === 4) {
      county = "0" + county.toString();
    }
    selectedCounty = county;
    queryString += "&county=" + county;
  } else {
    selectedCounty = "";
    queryString += "";
  }

  if (print) {
    queryString += "&print=true"
  } else {
    queryString += "";
  }

  if (history.pushState) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
    window.history.pushState({path:newurl},'',newurl); //this seems to reload the page?
  }


}

function hidelimited(variable) {
  for (var i = 0; i < limitedVars.length; i++) {
    if (variable == limitedVars[i]) {
      d3.select("#County").selectAll(".White, .Nonwhite").style("opacity", 0)
      d3.select("#State").selectAll(".White, .Nonwhite").style("opacity", 0)
      d3.select("#National").selectAll(".White, .Nonwhite").style("opacity", 0)
    }else {
      d3.select("#County").selectAll(".White, .Nonwhite").style("opacity", 1)
      d3.select("#State").selectAll(".White, .Nonwhite").style("opacity", 1)
      d3.select("#National").selectAll(".White, .Nonwhite").style("opacity", 1)
    }
  }
}

function formatNumber(d, type) {
  var percent = d3.format(",.0%"),
  number = d3.format("$,.0f");
  if (type == "max") {
    return (d<=1) ? percent(Math.ceil(d * 100) / 100 ) : number( Math.ceil((d+1)/10)*10)
  }else if (type == "min") {
    return (d<=1) ? percent(Math.floor(d * 100) / 100 ) : number( Math.floor((d+1)/10)*10)
  }else {
    return (d<=1) ? percent(d) : number(d);
  }
}


// The following 4 function are for building the bars on desktop
function barY(d,dis,variable,NONWHITE,WHITE,y,barHeight) {
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("c0") > -1) {
    return (isNaN(d[variable]) != true) ? y(d[variable]) : barHeight;
  }else if (parentClass.search("c2") > -1) {
    return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) : barHeight;
  }else {
    return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) : barHeight;
  }
}

function barH(d,dis,variable,NONWHITE,WHITE,y,barHeight) {
  //PROBLEM HERE BREAKS
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("c0") > -1) {
    // if(isNaN(d[variable]) === false) {
    // }
    return (isNaN(d[variable]) != true) ? barHeight - y(d[variable]) : 0;
  }else if (parentClass.search("c2") > -1){
    // if(isNaN(d[NONWHITE]) === false) {
    // }
    return (isNaN(+d[NONWHITE]) != true) ? barHeight - y(d[NONWHITE]) : 0;
  }else {
    // if(isNaN(d[WHITE]) === false) {

    // }
    return (isNaN(d[WHITE]) != true) ? barHeight - y(d[WHITE]) : 0;
  }
}

function labelY(d,dis,variable,NONWHITE,WHITE,y,barHeight) {
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("c0") > -1) {
    return (isNaN(d[variable]) != true) ? y(d[variable]) - 16 : barHeight -8;
  }else if (parentClass.search("c2") > -1) {
    return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) - 16 : barHeight - 8;
  }else{
    return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) - 16 : barHeight - 8;
  }
}

function labelsuperscript(d,dis,variable,NONWHITE,WHITE) {
  var thisvar;

  var parentClass = d3.select(dis.parentNode.parentNode).attr('class');
  if (parentClass.search("c0") > -1) {
    thisvar = variable;
  }else if (parentClass.search("c2") > -1) {
    thisvar = NONWHITE;
  }else{
    thisvar = WHITE;
  }

  if (isNaN(d[thisvar]) != true) {
    return "";
  } else if (needsConnecticutACSnote(variable).superscript){
    return "d";
  } else {
    return "b";
    // return (d[thisvar] == "n<50") ? "b" : "c"
  }


}

function labelHTML(d,dis,variable,NONWHITE,WHITE) {

  var noData = "n/a";
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("c0") > -1) {
    return (isNaN(d[variable]) != true) ? formatNumber(d[variable]) : noData
  }else if (parentClass.search("c2") > -1) {
    return (isNaN(d[NONWHITE]) != true) ? formatNumber(d[NONWHITE]) : noData
  }else{
    return (isNaN(d[WHITE]) != true) ? formatNumber(d[WHITE]) : noData
  }
}

// The following 3 function are for building the bars on mobile and print
function barW(d,dis,variable,NONWHITE_ph,WHITE_ph,x_ph) {
  var parentClass = d3.select(dis.parentNode).attr('class');

  if (parentClass.search("c0") > -1) {
    return (isNaN(d[variable]) != true) ? x_ph(d[variable]) : 0
  }else if (parentClass.search("c2") > -1) {
    return (isNaN(d[NONWHITE_ph]) != true) ?  x_ph(d[NONWHITE_ph]) : 0
  }else{
    return (isNaN(d[WHITE_ph]) != true) ?  x_ph(d[WHITE_ph]) : 0
  }

}

function barX(d,dis,variable,NONWHITE_ph,WHITE_ph,x_ph) {
  var parentClass = $(dis).closest(".rect-g").attr("class")
  if (parentClass.search("c0") > -1) {
    return (isNaN(d[variable]) != true) ? x_ph(d[variable]) + 5 : 0
  }else if (parentClass.search("c2") > -1) {
    return (isNaN(d[NONWHITE_ph]) != true) ? x_ph(d[NONWHITE_ph]) + 5 : 0
  }else{
    return (isNaN(d[WHITE_ph]) != true) ? x_ph(d[WHITE_ph]) + 5 : 0
  }
}

function labelHTML_ph(d,dis,variable,NONWHITE_ph,WHITE_ph,yes) {

  var noData = (d[variable] == "n<50") ? "n/a<tspan font-style='italic'  baseline-shift='super'>b</tspan>" : "n/a<tspan font-style='italic'  baseline-shift='super'>c</tspan>"
  var noData_wh = (d[WHITE_ph] == "n<50") ? "n/a<tspan font-style='italic'  baseline-shift='super'>b</tspan>" : "n/a<tspan font-style='italic'  baseline-shift='super'>c</tspan>"
  var noData_nw = (d[NONWHITE_ph] == "n<50") ? "n/a<tspan font-style='italic'  baseline-shift='super'>b</tspan>" : "n/a<tspan font-style='italic'  baseline-shift='super'>c</tspan>"
  var parentClass = $(dis).closest(".rect-g").attr("class")
  if (d[NONWHITE_ph] == "n<50" || (d[WHITE_ph]) == "n<50" || (d[variable]) == "n<50") {
    d3.select("#notes-section > p.note1").style("opacity", 1)

  }
  if ((d[variable]) == "N/A" || (d[NONWHITE_ph]) == "N/A" || (d[WHITE_ph]) == "N/A") {
    d3.select("#notes-section > p.note2").style("opacity", 1)
  }
  let CTnote = needsConnecticutACSnote(variable)
  d3.select("#notes-section > p.note4").style("display", CTnote.note ? "block" : "none")
  d3.select("#notes > p.note4").style("display", CTnote.note ? "block" : "none")
  if (parentClass.search("c0") > -1) {
    return (isNaN(d[variable]) != true) ? formatNumber(d[variable]) : noData
  }else if (parentClass.search("c2") > -1) {
    return (isNaN(d[NONWHITE_ph]) != true) ? formatNumber(d[NONWHITE_ph]) : noData_nw
  }else{
    return (isNaN(d[WHITE_ph]) != true) ? formatNumber(d[WHITE_ph]) : noData_wh
  }
}

// this function hides white/non-white for the "percent non-white" question
function hideBars(variable) {
  var counterbars = 0;
  for (var i = 0; i < limitedVars.length; i++) {
    if (variable == limitedVars[i]) {
      d3.selectAll(".bar-group-ph").selectAll(".category-ph.White").attr("display", "none")
      d3.selectAll(".bar-group-ph").selectAll(".category-ph.Nonwhite").attr("display", "none")
      d3.selectAll(".bar_ph").select("svg").attr("height", 80)
      d3.selectAll(".label").select(".svg2").attr("height", 38)
      counterbars += 1;
    }
  }
  if (counterbars === 0) {
    var bar_phHeight = (IS_PHONESM == true) ? 200 : 173;
    d3.selectAll(".bar-group-ph").selectAll(".category-ph.White").attr("display", "block")
    d3.selectAll(".bar-group-ph").selectAll(".category-ph.Nonwhite").attr("display", "block")
    d3.selectAll(".bar_ph").select("svg").attr("height", bar_phHeight)
    d3.selectAll(".label").select(".svg2").attr("height", 130)

  }
}

/**
* this is used in updateTable() and in labelsuperscript().
* we need to show a superscript only when ACS variables are visible for connecticut in 2023
* because geoids do not match those in our credit database.
* @param {string} varName
* @returns {Object} {note, superscript} -- note: whether the footnote is needed in the notes section. superscript: whether the 'd' is needed on the datapoint. 
*/
function needsConnecticutACSnote(varName){
  //check that a state is active
  let stateActive = selectedState
  if (!stateActive) return {note: false, superscript: false};

  //check that active state is CT
  if (selectedState.id != "09") return {note: false, superscript: false};

  //check that county is active (hover works but selected doesn't but it's ok bc it happens at click)
  let countyActive = d3.select("g.counties").selectAll("path.hover")._groups[0].length !== 0 || selectedCounty != ""
  if (!countyActive) return {note: false, superscript: false};

  //check that we have an ACS variable
  //if we're using this function to decide whether to show the note itself, 
  //it's sufficient to show the note for any CT county. 
  //if we're using this to show superscripts on the datapoints, 
  //it matters which variable we're dealing with. 
  return ["household_income_avg","poc","educ_ltBA","nohealthinsurance"].includes(varName) ? 
          {note: true, superscript: true} : 
          {note: true, superscript: false};
}



var setHeight = tdMap*.7;
var width =  tdMap,  //(IS_MOBILE && !IS_PHONE) ? tdMap : (tdMap) - margin.right-margin.left,
height = (IS_PHONE) ? (width) - margin.top-margin.bottom :  setHeight,//(width*.57) - margin.top-margin.bottom,
centered,
selectedState,
selectedStatePh,
selectedCounty, //set in updateQueryString
selectedCountyPh
// d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
//   if (error) throw error;
d3.queue()
//.defer(d3.json, "data/us-10m.v1.json")  // <- HERE IS THE TOPOJSON
.defer(d3.json, "data/us-5m-2020-shapes.json")  // <- HERE IS THE TOPOJSON
.defer(d3.csv, pathFiles + "county_medical.csv")
.defer(d3.csv, pathFiles + "state_national_medical.csv")
.defer(d3.csv, pathFiles + "county_student.csv")
.defer(d3.csv, pathFiles + "state_national_student.csv")
.defer(d3.csv, pathFiles + "county_auto.csv")
.defer(d3.csv, pathFiles + "state_national_auto.csv")
.defer(d3.csv, pathFiles + "county_overall.csv")
.defer(d3.csv, pathFiles + "state_national_overall.csv")
.defer(d3.csv, pathFiles + "state_national_youth.csv")
.await(ready);

function transformData(geography){
  var geography_nested = d3.nest()
  .key(function(d) {return d.id })
  .entries(geography);
  return geography_nested
}

//* topo, debt data, debt data, polygons, polygons (last two were pieced out of 'us' in previous function, ready)
function OverallTransformData(us, county, state, countyData, stateData) {

  var bigbig = {}

  var county_data = null;
  var countyGeoMapped = null;
  var filteredCounties = null;
  var tmp_county = null;


  //* NESTED debt data by id (FIPS)
  var state_data = transformData(state)

  state_data.forEach(function(d,i){
    for (var property in d["values"][0]) {
      d[property] = d.values[0][property]
    }
    //* polygons... merge debt data into state polygons
    stateData.forEach(function(e, j) {
      if (+d.key == e.id) {
        for (var property in d["values"][0]) {
          // if (isNaN(+d.values[0][property]) == true && property != "state" && property != "abbr" && property != "county") {
          //   e[property] == null
          // }else {
          e[property] = d.values[0][property]
          // }
        }
      }
    })
  })

  //* country level debt data? Why not return d.key === "USA" ? ... hmm
  var us_data_ph = state_data.filter(function(d) {
    return isNaN(+d.key)
  })
  
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

  //county is not displayed for youth data, so only calc it all out if other categories are selected
  /*if (county == undefined){
    //this is the only time we refer to county data being undefined. anywhere else,
    //we refer to it by category or type. so here, it's safe to set county data
    //to be something else, just so we have the geometries loaded.
    //the problem is that county data will show up in bars, 
    //so we'll need to check type there before showing bars for data that don't exist.
    county = eval(variableListMaster.meta.dataSets["overall"].county);
  }*/
  //transforms the county and state non geographical data
  //* NESTED debt data by id (FIPS)
  county_data = transformData(county)
  //* makes the polygons availble with .get() by id (FIPS)
  countyGeoMapped = d3.map(countyData, function(d) { return d.id});

  //* brings attributes to top of object
  //* merges debt data into the polygons (countyGeoMapped)
  county_data.forEach(function(d,i){
    for (var property in d["values"][0]) {
      d[property] = d.values[0][property];
      countyGeoMapped.get(d.key)[property] = d.values[0][property];
    }
  })

  
  //* what is this? there is no USA in the county data
  filteredCounties = county_data.filter(function(d) {
    return d.state == "USA"
  })

  tmp_county = topojson.feature(us, us.objects.counties).features;
  //* loop thru the US topo by county and add in polygons?
  for (var i =0; i<tmp_county.length; i++){
    // var mergeID = +tmp_county[i]["id"]
    //* FIPS
    var mergeID2 = tmp_county[i]["id"]

    for (var property in countyGeoMapped.get(mergeID2)) {
      var data = (isNaN(countyGeoMapped.get(mergeID2)[property]) == true) ? countyGeoMapped.get(mergeID2)[property] : +countyGeoMapped.get(mergeID2)[property];
      tmp_county[i]["properties"][property] = data;
    }
  }

  bigbig.tmp_state = tmp_state;
  bigbig.tmp_county = tmp_county;
  bigbig.filteredCounties = filteredCounties;
  bigbig.us_data_ph = us_data_ph;
  bigbig.state_data = state_data;
  bigbig.county_data = county_data;

  return bigbig;
}

function buildprint(Startquery,data) {
  //build notes

  var notes = "<p><b>Notes:</b></p> " + $("#notes").html();
  $("#print-chart-notes").html(notes)
  $("#print-chart-notes").append(variableListMaster.meta.dataSets[type].specialNotes)

  // grab the correct data and variables
  var state_data;
  var county_data;
  var printdata = []

  // get us data.
  var us_data = data.state_data[0]["values"][0]
  for (var key in us_data) {
    if (us_data.hasOwnProperty(key)) {
      if (+us_data[key] == NaN || +us_data[key] == 0){
        //abbr
        us_data[key = us_data[key]]
      }else {
        us_data[key] = +us_data[key]
      }
    }
  }
  printdata.push(us_data)

  // get state and county data
  if (Startquery) {
    if (Startquery["state"]) {
      state_data = data.state_data.filter(function(d) {
        return d.key == ((Startquery["state"].length === 1) ? ("0" + Startquery["state"]) : Startquery["state"])
      })
      printdata.push(state_data[0])
    }
    if (Startquery["county"]) {
      county_data = data.county_data.filter(function(d) {

        return d.key == Startquery["county"] //&& d.state_id == Startquery["state"]
      })

      printdata.push(county_data[0])
    }
  }

  var rowData =  variableListMaster[type];

  var printContainer = d3.select("#print-chart-container")

  // Set to national, try state, if state, try county. If good, county, if bad, state, if none, national.
  printNameFinal = "National"
  var statewatch;

  try {
    printNameFinal = printdata[1].state;
    statewatch = true;
    try {
      printNameFinal = printdata[2].county + ", " + printdata[2].state;
      statewatch = false;
    }
    catch(err) {}
  }
  catch(err) {}

  if (printNameFinal === "National") {
    d3.select("body").classed("national",true)
  } else if (statewatch === true){
    d3.select("body").classed("state",true)
  }
  //add the printnamefinal at the very end of the script

  // get rid of previous ones
  printContainer.selectAll(".print-chart").remove()

  //add current ones
  printContainer.selectAll(".print-chart")
  .data(rowData)
  .enter()
  .append("div")
  .attr("class","print-chart")
  .append("div")
  .attr("class","inner")
  .html(function(d,i){
    return d.desktopLabel;
  })
  printContainer.selectAll(".print-chart")
  .append("svg")
  .attr("class",function(d){
    return d.variable + " print-row"
  })
  .attr("width", "100%")
  .attr("height", "100%")
  .each(function(d,i){
    // Max of d,d_wh,d_nw
    var y = findPrintY(d.variable,printdata)
    buildPrintBars(this,d.variable,d.desktopLabel,printdata,y)
  })


  // Add in bottom logos
  var footerIcon = '<div class="print-footer-icon icon1"><img src="img/print-footer.png"></div>';
  var footerIcon2 = '<div class="print-footer-icon icon2"><img src="img/print-footer.png"></div>';
  var footerIcon3 = '<div class="print-footer-icon icon3"><img src="img/print-footer.png"></div>';

  var firstpageBottom = $(".print-chart:eq(3)")
  var secondpageBottom = $("#print-chart-notes")
  var thirdpageBottom = $("#print-chart-notes")

  firstpageBottom.after(footerIcon)
  secondpageBottom.after(footerIcon2)
  thirdpageBottom.after(footerIcon3)
}

function findPrintY(d,printdata) {
  var nums = []

  var value1 = d + isDelinquency(d)[0],
  value2 = d + isDelinquency(d)[1]

  for (var i = 0; i < printdata.length; i++) {
    var items = [+printdata[i][d],+printdata[i][value1],+printdata[i][value2]]
    for (var j = 0; j < items.length; j++) {
      nums.push(items[j])
    }
  }

  var max = d3.max(nums)

  var y = d3.scaleLinear()
  .domain([0, max]);
  return y;
}

function buildPrintBars(dis,variable, varName, printdata,y) {
  var barSvgHeight = 110,
  barWidth = 60,
  width = 821,
  itemwidth = (barWidth*3) + 40,
  spacer = (width - (3*itemwidth))/2;

  if (printdata.length === 3) {
    var places =   ["National", "State", "County"]
  } else if (printdata.length === 2) {
    var places =   ["National", "State"]
  } else {
    var places =   ["National"]
  }
  // populate the svg
  var WHITE = variable + isDelinquency(variable)[0]
  var NONWHITE = variable + isDelinquency(variable)[1]
  // var data = bigdata.county_data;
  var categories = [variable, WHITE, NONWHITE]
  var grabVar = variableListMaster[type].filter(function(d) {
    return d.variable == variable;
  })
  var cat = grabVar[0].columns

  var barHeight = 40;
  var topMargin = 30;

  y.rangeRound([0, barHeight]);

  var barG = d3.select(dis)
  .selectAll("g")
  .data(places)
  .enter()
  .append('g')
  .attr("transform", function(d,i) {
    var left = i*itemwidth + i*spacer;
    return "translate(" + left + "," + topMargin + ")";
  })
  .attr("class", function(d) {
    return variable + d + " bar-group"
  })
  barG.append("text")
  .text(function(d) {
    if (d=="National") {
      return d
    } else if (d=="State") {
      return printdata[1]["state"]
    } else {
      return printdata[2]["county"];//toTitleCase(printdata[2]["county"])
    }
  })
  .attr("class", function(d) {
    return "group-label-2 " + d
  })
  .attr("dy", "-1.5em")

  var subBarG = barG.selectAll("g")
  .data(categories)
  .enter()
  .append("g")
  .attr("class", function(d) {
    return "category " + d
  })
  .attr("transform", function(d,i) {
    return "translate(" + (70 * i ) + "," + 10 + ")";
    // "translate(" + ((barWidth + 2) * i ) + "," + 10 + ")"
    // "translate(" + (60 * i ) + "," + 10 + ")"
  })

  var rectG = subBarG.append("g")
  .attr("class", function(d) {
    return "rect-g2 " + d})
  .attr("transform", function(d,i) {
    return "translate(" + 0 +"," + 15 + ")"
  })

  rectG
  .append("g")
  .attr("class", "g-text2")
  .append("text")
  .attr("x", 0)
  .attr("y", barHeight + 10)
  .attr("dy", ".71em")
  .attr("text-anchor", "start")
  .text(function(d,i) {
    for (var j = 0; j < limitedVars.length; j++) {
      if (d === limitedVars[j] + "_white" || d === limitedVars[j] + "_com_col") {
        return ""
      }
    }
    var label = cat[i]
    return label.substr(0,label.indexOf(' '))
  });

  rectG.append("text")
  .attr("x", 0)
  .attr("y", barHeight + 21)
  .attr("dy", ".71em")
  .attr("text-anchor", "start")
  .attr("class", "g-text2")
  .text(function(d,i) {
    for (var j = 0; j < limitedVars.length; j++) {
      if (d === limitedVars[j] + "_white" || d === limitedVars[j] + "_com_col") {
        return ""
      }
    }
    var label = cat[i]
    return label.substr(label.indexOf(' ')+1);
  });





  var counter1 = 0;
  var counter2 = 0;
  var counter3 = 0;
  var counter4 = 0;
  var counter5 = 0;

  rectG
  .append("rect")
  .attr("class", "bar")
  .attr("width", barWidth)
  .attr("y", function(d,i) {
    // i is 0,1,2 depending, mapping to all, white, nonwhite
    // d is same but with variables
    // counter is 0,1,2 mapping to national, state, county
    var result = isNaN(printdata[counter1][d]) ? 0 : y(printdata[counter1][d])
    if (i % 3 === 2) {
      counter1 +=1;
    }
    return (0 + (barHeight - result))
  })
  .attr("height", function(d,i) {
    var result = isNaN(printdata[counter2][d]) ? 0 : y(printdata[counter2][d])
    if (i % 3 === 2) {
      counter2 +=1;
    }
    return result;
  })
  .attr("fill", function(d,i) {
    if (i % 3 === 0) {
      return "#fdbf11"
    }else if (i % 3 === 1) {
      return "#000000"
    }else{
      // this counter iterates through to create a national, state, county watcher
      return "#696969"
    }
  })

  rectG
  .append("text")
  .text(function(d,i) {
    var raw = printdata[counter4][d];
    var result;
    if(isNaN(raw)) {
      if (raw === undefined) {
        result = ""
      } else {
        result = "n/a"
      }
    }
    else {
      result = formatNumber(raw)
    }

    if (i % 3 === 2) {
      counter4 +=1;
    }
    return result;
  })
  .attr("class","print-bar-text")
  .attr("dy", "-0.5em")
  .attr("transform", function(d,i) {
    var result = isNaN(printdata[counter3][d]) ? 0 : y(printdata[counter3][d])
    if (i % 3 === 2) {
      counter3 +=1;
    }
    // return (0 + (barHeight - result))
    return "translate(" + 0 + "," + (0 + (barHeight - result)) + ")";
  })
  .append("tspan")
  .attr("font-style","italic")
  .attr("baseline-shift","super")
  .text(function(d,i){
    var raw = printdata[counter5][d];
    var result;
    if (isNaN(raw)) {
      result = "b"
    }

    if (i % 3 === 2) {
      counter5 +=1;
    }

    return result;

  })
}



function ready(error, us, county1, state1, county2, state2, county3, state3, county4, state4, state5) {
  if (error) throw error;
  /*SETTING UP THE DATA*/

  // geographical data
  var countyData = us.objects.counties.geometries;
  var stateData = us.objects.states.geometries;

  // If there's a url search query, get the type or set using defaults from variableListMaster
  if (Object.keys(Startquery).length > 0) {
    // set dataset type
    type = Startquery["type"]
  } else {
    type = variableListMaster.meta.default;
    Startquery["type"] = type;
  }

  d3.selectAll("[data-cat]").classed("selected-nav", false);
  

  //make sure overall's filter states are set on load
  if (["youth","elderly"].includes(type)){
    d3.select(".filter-box-young-old-population").classed("hidden",false);
    d3.select(".filter-box-young-old-population>[data-cat='"+type+"']").classed("selected-filter", true);

    d3.select('#cat-nav>[data-cat="overall"]').classed("selected-nav",true);
    d3.select('#cat-nav-mobile>[data-cat="overall"]').classed("selected-nav",false);
    d3.select('#cat-nav-mobile>[data-cat="' + type + '"]').classed("selected-nav",true);

    d3.select("."+type+"-checkbox").property("checked",true)
    d3.select(".filter-box-clear-filter").classed("hidden",false)
  } else if(type =="overall"){
    d3.select(".filter-box-young-old-population").classed("hidden",false)
    d3.selectAll('[data-cat="overall"]').classed("selected-nav",true);
    d3.select(".filter-box-clear-filter").classed("hidden",true)
  } else {
    d3.select(".filter-box-young-old-population").classed("hidden",true)
    d3.selectAll('[data-cat="' + type + '"]').classed("selected-nav",true);
  }
  


  var defaultFirst;

  // use meta data to select correct data
  //* by which he means match the selected type of debt to the argument containing that type of data, opaquely named 1, 2, 3
  // but if it's youth off the bat, we need to send fake county data (overall instead)
  var sentCountyData = (type!="youth")?eval(variableListMaster.meta.dataSets[type].county):eval(variableListMaster.meta.dataSets["overall"].county)
  var BigData = OverallTransformData(us,sentCountyData,eval(variableListMaster.meta.dataSets[type].state),countyData,stateData);

  //* the first type of debt shown in each list, per hard coded varList
  defaultFirst = variableListMaster[type][0].variable;

  // set variable
  // NEED conditional to ensure that the wrong variable is not present
  if (!Startquery["variable"]) {
    typeVar = defaultFirst
    Startquery["variable"] = typeVar;
    updateQueryString(type,typeVar)
  } else {
    typeVar  = Startquery["variable"]
    // if(typeVar === "perc_debt_med" || typeVar === "pct_w_medical_debt_in_collections") {
    //   typeVar = "medcoll"
    // } else if(typeVar === "med_debt_med") {
    //   typeVar = "medcollpos_p50"
    // } else if(typeVar === "perc_pop_no_ins") {
    //   typeVar = "nohealthinsurance"
    // } else if(typeVar === "perc_pop_nw" || typeVar === "popnonwhite_pct" || typeVar === "pct_poc") {
    //   typeVar = "poc"
    // } else if(typeVar === "avg_income" || typeVar === "HHinc_avg" || typeVar === "avg_household_income") {
    //   typeVar = "household_income_avg"
    // } else if(typeVar === "perc_stud_debt_collect_STUD" || typeVar === "pct_student_holders_in_default") {
    //   typeVar = "stdcollofstdtot"
    // } else if(typeVar === "med_stud_debt_collect") {
    //   typeVar = "stdcollpos_p50"
    // } else if(typeVar === "perc_stud_debt") {
    //   typeVar = "stdtot"
    // } else if(typeVar === "med_stud_debt") {
    //   typeVar = "stdtotpos_p50"
    // } else if(typeVar === "med_mon_pmt") {
    //   typeVar = "stdmonthpos_p50"
    // } else if(typeVar === "perc_no_bach") {
    //   typeVar = "educ_ltBA"
    // } else if(typeVar === "autoretdelrate_sub") {
    //   typeVar = "delinquency_by_credit"
    // } else if(typeVar === "autoopen_pct") {
    //   typeVar = "autoopen"
    // } else if(typeVar === "autoretopen_pct") {
    //   typeVar = "autoretopen"
    // } else if(typeVar === "poprural_pct") {
    //   typeVar = "poprural"
    // } else if(typeVar === "pct_debt_collections") {
    //   typeVar = "totcoll"
    // } else if(typeVar === "median_debt_in_collections") {
    //   typeVar = "totcollpos_p50"
    // } else if(typeVar === "auto_retail_loan_delinquency_rate") {
    //   typeVar = "autoretdelrate"
    // } else if(typeVar === "credit_card_debt_delinquency_rate") {
    //   typeVar = "carddelrate"
    // } else if(typeVar === "median_credit_card_delinquent_debt") {
    //   typeVar = "carddelpos_p50"
    // } else {
    //   typeVar = typeVar
    // }
    // updateQueryString(type,typeVar)
  }

  // TRIGGER PRINT VIEW
  if (Startquery["print"] === "true") {

    buildprint(Startquery,BigData)
  }
  else{
  }


  // set left hand table variable names
  // this is done by setting "type" above.

  // set drop down item
  // this is done below the set up of the drop down. look for refresh

  // set visual variable placeholder
  // this is done below ADD TABLE in the 1300s of the code


  // select the state (optional)
  // select the county (optional)
  // DONE AT THE VERY BOTTOM OF THE ENTIRE READY/JS SCRIPT

  // lots happens at the bottom if it starts with a Startquery.


  // DWCut? or consolidate?
  //* sets globals SELECTED_VARIABLE, WHITE, NONWHITE to variable name
  //* of the datapoint with _wh/_nw appended for race, _ph for mobile
  setVariable(typeVar)
  setVariable(typeVar, true)

  var tmp_state = BigData.tmp_state,
  tmp_county = BigData.tmp_county,
  filteredCounties = BigData.filteredCounties,
  us_data_ph = BigData.us_data_ph,
  state_data = BigData.state_data,
  county_data = BigData.county_data;


  // if type and variable don't match, remove the variable and go down to type (reset variable)
  // if variable doesn't exist, do the top variable

  setZoom(true,false, false)

  d3.select("#debt-type").html(function(){
    // return variableListMaster[type][0].desktopLabel;
    return variableListMaster[type].filter(function(d){
      return d.variable === SELECTED_VARIABLE
    })[0].desktopLabel;
  })

  // var mapLegendTitle = d3.select("#ftitle");
  //
  // mapLegendTitle.text("All")

  //just doing this once here so user doesn't see text fragment before other stuff shows up
  d3.select("#measure").style("visibility", "visible")

  d3.selectAll("#debt-caption, #print-debt-caption").text(function(d){
    return variableListMaster.meta.dataSets[type].caption;
  })




  /*END*/

  // NOT SURE WHAT THIS IS DOING....maybe creating the search pool for the filtering county/state search??

  // Begin change jquery UI items in the DOM

  // DWCut? because we do it later on if print...could do no matter what?


  $( "#searchBox" ).autocomplete({
    appendTo: ".search-div",
  });
  //* set up search box for state
  $('input[name="tags"]').tagit({
    availableTags: dropdown,
    allowSpaces: true,
    autocomplete:{
      // availableTags: searchArray, // this param is of course optional. it's for autocomplete.
      // configure the name of the input field (will be submitted with form), default: item[tags]
      itemName: 'item',
      fieldName: 'tags',
      onlyAvailableTags: true,
      tagLimit: 2,
      appendTo: ".search-div",
      open: function(event, ui) {
        $("#ui-id-2").width($(".search-div").width())
        $("#ui-id-2").css("left", "0px")
        $("#ui-id-2").css("top", "87px")
      },
    },
    beforeTagAdded: function(event, ui) {
      // ($("li#county >span").text("hello"))
      // if ($("ul.tagit li.tagit-choice-editable").width() < 70) {
      //   $("ul.tagit li.tagit-choice-editable").css("margin-right", "100px")
      // }else {
      //   $("ul.tagit li.tagit-choice-editable").css("margin-right", "0px")
      // }
      if(dropdown.indexOf(ui.tagLabel) == -1){
        return false;
      }
      if(ui.tagLabel == "not found"){
        return false;
      }
    },
    afterTagAdded: function(event, ui) {

      ($(".search-div > .ui-widget").css("height", 60))
      var tag = (ui.tag[0]["textContent"]);
      var county = (tag.search(",") > 0) ? tag.split(",")[0] : "";
      var state = (tag.search(",") > 0) ? (tag.split(", ")[1]).slice(0,-1) : tag.slice(0,-1);

      //* move into a function that updates the map, from click on 'tagit' or map itself

      //* features
      var geoData = BigData.tmp_county
      var geoType = (tag.search(",") > 0) ? "county" : "state";
      var geography = (geoType == "county") ? county : state;
      selectedLocation()

      //* pull out just the selected place from the features
      var filteredData = geoData.filter(function(d) {
        if (geoType == "county") {
          return d.properties["county"] == county && d.properties["abbr"] == state;
        }else {
          return d.properties["state"] == state;
        }
      })

      var data = filteredData[0]
      updateBars(SELECTED_VARIABLE, data)
      zoomMap(width, data, geoType)
      if (geoType == "county") {
        addTag(data["properties"]["state"], county, state)
      }else {
        var filter = data["properties"]["abbr"]
        createSearchArray(filter)
      }

      var stateQuery = filteredData["0"].properties.state_id;
      var countyQuery = (geoType == "county") ? filteredData["0"].properties.id : null;

      updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)
    },
    afterTagRemoved: function(event,ui) {
      var tag = (ui.tag[0]["textContent"]);
      if (tag.search(",") > 0) {
        d3.selectAll(".counties > path.selected")
        .classed("selected", false)
        setZoom(false, true, false)
      }else {

        d3.selectAll(".state-borders > path.selected")
        .classed("selected", false)
        setZoom(true, false, false)
        if (d3.select("li#state").size() == 0) {
          zoomMap(width, null, "national")
        }
      }
      updateBars(SELECTED_VARIABLE)
      createSearchArray("")

      $('.ui-widget-content.ui-autocomplete-input').attr('placeholder', 'Search for a state or county')
    }
  });

  $(".search-div > .ui-widget").css("height", 60)
  $(".ui-widget-content.ui-autocomplete-input").css({"font-style" : "italic"})
  $(".ui-widget-content.ui-autocomplete-input").css({"font-weight" : "400"})
  $('.ui-widget-content.ui-autocomplete-input').attr('placeholder', 'Search for a state or county')
  $('.ui-widget-content.ui-autocomplete-input').focusin(function(){
    $(this).attr('placeholder','');
  });
  $('.ui-widget-content.ui-autocomplete-input').focusout(function(){
    $(this).attr('placeholder','Search for a state or county');
  });
  createSearchArray("")

  var zoom = d3.zoom()
  .scaleExtent([0, 8])


  var min = d3.min(BigData.tmp_county, function(d) {
    return d.properties[SELECTED_VARIABLE]
  })
  var max = d3.max(BigData.tmp_county, function(d) {
    return d.properties[SELECTED_VARIABLE]
  })

  var quantize = d3.scaleThreshold()
  .domain(variableListMaster[type].filter(function(d) {return d.variable == SELECTED_VARIABLE;})[0].breaks)
  .range(["#cfe8f3", "#73bfe2", "#1696d2", "#0a4c6a", "#000000"])


  // Create and populate Mobile Dropdowns options (mixing d3 and jquery...)
  var table = d3.select("#table-div")

  var stateMenu = d3.select(".state-menu")
  .on('click', function() {
    if ( d3.select(".state-menu.dropdown").classed("open") == true) {
      $("#state-select").selectmenu('close')
      d3.select(".state-menu.dropdown").classed("open", false)
    }else {
      d3.select(".state-menu.dropdown").classed("open", true)
      $("#state-select").selectmenu('open')
    }
  })
  .append("select")
  .attr("id", "state-select")

  var optionsState = stateMenu
  .selectAll('option')
  .data(state_data)

  optionsState.enter()
  .append('option')
  .text(function(d) {
    return d.state
  })
  .attr('value', function(d) {
    return d.state
  })
  .attr("value2", function(d){
    return d.key
  })

  var countyMenu = d3.select(".county-menu")
  .on('click', function() {
    if ( d3.select(".county-menu.dropdown").classed("open") == true) {
      $("#county-select").selectmenu('close')
      d3.select(".county-menu.dropdown").classed("open", false)
    }else {
      d3.select(".county-menu.dropdown").classed("open", true)
      $("#county-select").selectmenu('open')
    }
  })
  .append("select")
  .attr("id", "county-select")

  var optionsCounty = countyMenu
  .selectAll('option')
  .data(filteredCounties)

  optionsCounty.enter()
  .append('option')
  .text(function(d) {
    return d.county
  })

  var categoryMenu = d3.select(".category-menu")
  .on('click', function() {
    if ( d3.select(".category-menu.dropdown").classed("open") == true) {
      $("#category-select").selectmenu('close')
      d3.select(".category-menu.dropdown").classed("open", false)
    }else {
      d3.select(".category-menu.dropdown").classed("open", true)
      $("#category-select").selectmenu('open')
    }
  })
  .append("select")
  .attr("id", "category-select")

  var optionsCategory = categoryMenu
  .selectAll('option')
  .data(variableListMaster[type])
  optionsCategory.enter()
  .append('option')
  .html(function(d) {
    return d.mobileLabel;
  })
  .attr('value', function(d) {
    return d.variable;
  })


  // BEGIN FUNCTIONS!

  // On click of print
  d3.selectAll(".print-button")
  .on("click", function(){
    /*d3.select(".youth-banner").classed("hidden",true)
    d3.select("#cat-nav").classed("hidden",true)
    d3.select("#cat-nav-mobile").classed("hidden",true)
    d3.select(".print-button").classed("hidden",true)
    d3.select(".debt-title-flex-filter-box").classed("hidden",true)*/

    if (!Startquery && window.location.search === "") {
      updateQueryString(type,SELECTED_VARIABLE)
    }

    window.open(window.location.search + "&print=true")

  })

  // CHANGE DATA SET
  $( ".categories" ).on("click", function(evt) {changeCategoryDataSet(evt)})
  $( "#filter-young-adult-population" ).on("click", function(evt) {changeCategoryDataSet(evt)})
  $( "#cat-pop-filter-checkbox" ).on("click", function(evt) {changeCategoryDataSet(evt)})
  //hacked to act like overall click
  $( "#clear-text").on("click", function(evt) {changeCategoryDataSet({currentTarget:d3.select('[data-cat="overall"]')._groups[0][0]})})

  function changeCategoryDataSet(evt) {

    var userChoice = evt.currentTarget.getAttribute("data-cat");

    //check if this is a de-click on a filter
    if (d3.select(".selected-filter")._groups[0][0]?.getAttribute("data-cat") == userChoice) {
      userChoice = "overall"
    }

    //if we have selected young adult or older adult
    if (userChoice == "overall" || evt.currentTarget.classList.contains("cat-pop-filter") || evt.currentTarget.classList.contains("cat-pop-filter-checkbox")) {
      d3.select(".filter-box-young-old-population").classed("hidden", false)
    } else {
      d3.select(".filter-box-young-old-population").classed("hidden", true)
    }

    d3.selectAll("[data-cat]").classed("selected-nav", false);
    d3.selectAll(".cat-pop-filter").classed("selected-filter",false)
    d3.selectAll(".cat-pop-filter-checkbox").property("checked",false)
    d3.selectAll(".filter-remove-button").classed("hidden",true)
    d3.select(".filter-box-clear-filter").classed("hidden",true)

    if ( evt.currentTarget.classList.contains("cat-pop-filter") && ["youth","elderly"].includes(userChoice)){
      d3.select('#cat-nav>[data-cat="overall"]').classed("selected-nav",true);
      d3.select('#cat-nav-mobile>[data-cat="overall"]').classed("selected-nav",false);
      d3.select('#cat-nav-mobile>[data-cat="' + userChoice + '"]').classed("selected-nav",true);

      evt.currentTarget.classList.add("selected-filter")
      d3.select("."+userChoice+"-checkbox").property("checked", true)
      d3.select(".filter-box-clear-filter").classed("hidden",false)
    } else {
      d3.selectAll('[data-cat="' + userChoice + '"]').classed("selected-nav",true);
    }

    table.selectAll('tbody').classed('selected', false);
    table.select('tbody').classed('selected', true)
    //* this is standing in for the D3 update, instead he's redrawing the map
    BigData = changeData(userChoice);
    //* type of debt, coming in from menu selection
    type = userChoice;
    //* pulling out just the relevant object from varList
    var type_category = variableListMaster[type];

    var mapLegendTitle = d3.select("#ftitle");
    mapLegendTitle.text("All")

    // update mobile categories

    var optionsCategory = d3.select("#category-select").selectAll('option')
    .data(type_category)

    optionsCategory.enter()
    .append('option')
    .merge(optionsCategory)
    .html(function(d) {
      return d.mobileLabel;
    })
    .attr('value', function(d) {
      return d.variable;
    })

    optionsCategory.exit().remove()

    $('#category-select').val(type_category[0].variable);
    $("#category-select").selectmenu("refresh")

    // DW note: this will need to get updated when we move to more than TWO variable sets.
    // to be used when ready
    var type_variable = variableListMaster[type][0].variable;
    setVariable(type_variable)
    setVariable(type_variable,true)
    updateMap(type_variable)

    d3.select("#debt-caption").text(function(d){
      return variableListMaster.meta.dataSets[type].caption
    })

    d3.select("#debt-type").html(function(){
      return variableListMaster[type].filter(function(d){
        return d.variable === SELECTED_VARIABLE
      })[0].desktopLabel;
    })

    // update notes at bottom

    $(".temp").remove()

    $("#notes").append(variableListMaster.meta.dataSets[type].specialNotes)
    $("#notes-section-inner").append(variableListMaster.meta.dataSets[type].specialNotes)

    var stateQuery;
    var countyQuery;

    if (zoomNational == true) {
      var us_data = BigData.state_data[0]["values"][0]
      for (var key in us_data) {
        if (us_data.hasOwnProperty(key)) {
          if (+us_data[key] == NaN || +us_data[key] == 0){
            us_data[key = us_data[key]]
          }else {
            us_data[key] = +us_data[key]
          }
        }
      }
      updateTable(us_data,type)
    } else if (zoomCounty == true && type != "youth") {

      countyQuery = d3.select("g.counties").selectAll("path.selected").datum().id;
      stateQuery = d3.select("path#" + selectedState.properties.abbr).datum().id;
      updateTable(d3.select("g.counties").selectAll("path.selected").datum(),type)
    } else if (zoomState == true || type == "youth") {
      stateQuery = d3.select("path#" + selectedState.properties.abbr).datum().id;
      updateTable(d3.select("path#" + selectedState.properties.abbr).datum(),type);
    } else if (zoomNational_St == true){
      updateTable(d3.select("path#" + selectedState.properties.abbr).datum(),type);
    }

    // if county is selected but we're going to youth, hide the youth bar
    if (zoomCounty && type == "youth") {setZoom(false, true, false); updateBars(type_variable,d3.select(".state-borders > path.selected").datum())}
  
    if (!zoomNational && type=="youth") {
      d3.selectAll(".state-borders > path").style("opacity",.5).classed("hide",false)
      d3.select(".state-borders > path.selected").style("opacity",1)
    } else if (!zoomNational){
      d3.selectAll(".state-borders > path").classed("hide",true)
      d3.selectAll(".state-borders > path.selected").classed("hide",false)
    } 
    if (zoomNational || zoomNational_St) {
      d3.selectAll(".state-borders > path").style("opacity",1).classed("hide",false)
    }

    // Only works on load... need to know on resize too.
    // need to set statequery and county query differently for the currently viewing updatequery

    if (IS_PHONE === true) {

      stateQuery = $("#state-select")[0].selectedOptions[0].__data__.key
      if (stateQuery != "USA") {
        if ($("#county-select")[0].length > 0 && $("#county-select")[0].selectedOptions[0].value != "") {
          countyQuery = $("#county-select")[0].selectedOptions[0].__data__.key
        }
        else {
          countyQuery = ""
        }
      } else {
        countyQuery = ""
        stateQuery = ""
      }

      if (type=="youth"){
        d3.select(".county-menu").style("display","none")
        countyQuery = ""
      } else {
        d3.select(".county-menu").style("display","block")
      }

    }

    updateQueryString(type,type_variable,stateQuery,countyQuery)

  }; // END NAV CLICK CATEGORY CHANGE STUFF



  function changeData(CATEGORY) {

    //stateData was overwritten somewhere because of the nested function structure and was no longer a source of truth
    var fixedStateData = us.objects.states.geometries;
    //this is a hack
    //we're sending overall data instead of category data when category == youth
    //this is because there is no county data for youth, but we don't want it to break elsewhere
    //this is not a problem bc it shouldn't ever surface in the youth category anyway, 
    //it just won't break if data loads out of order when switching back and there's nothing to grab yet
    //only problem is it WILL use the breaks from overall instead of our data-- TODO
    var sentCountyData = (CATEGORY!="youth")?eval(variableListMaster.meta.dataSets[CATEGORY].county):eval(variableListMaster.meta.dataSets["overall"].county)
    BigData = OverallTransformData(us,sentCountyData,eval(variableListMaster.meta.dataSets[CATEGORY].state),countyData,fixedStateData);

    var tmp_state = BigData.tmp_state,
    tmp_county = BigData.tmp_county,
    filteredCounties = BigData.filteredCounties,
    us_data_ph = BigData.us_data_ph,
    state_data = BigData.state_data,
    county_data = BigData.county_data;

    // update data bound to counties
    var countiesD3 = d3.selectAll(".counties")
    .selectAll("path")
    .each(function(d){
      d3.select(this)
      //.style("opacity", 1)
      .datum(tmp_county.filter(function(o){ return o.id == d.id})[0])
    })

    var statesD3 = d3.select(".state-borders")
    .selectAll("path")
    .each(function(d){
      d3.select(this)
      .datum(tmp_state.filter(function(o){ return o.properties.abbr == d.properties.abbr})[0])
    })

    return BigData
  }

  // ENDDDDDD dropdown header topic change logic

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
    $('input[name="tags"]').tagit("option", {
      availableTags: dropdown,
    })
  }

  // End Search Array


  function reset() {
    active.classed("active", false);
    active = d3.select(null);

    g.transition()
    .duration(750)
    .style("stroke-width", "1.5px")
    .attr("transform", "");
  }


  function filterCountyMenu(selectedState) {

    var filteredCounties = county_data.filter(function(d) {
      return d.state == selectedState
    })

    var optionsCounty = countyMenu
    .selectAll('option')
    .data(filteredCounties)
    optionsCounty.exit().remove()
    var optionsCountyEnter = optionsCounty.enter()
    .append('option')
    .text(function (d) {
      return d.county;
    })
    .attr('value', function(d){
      return d.county
    })
    optionsCounty.merge(optionsCountyEnter)
    .text(function (d) {
      return d.county;
    })
    .attr('value', function(d){
      return d.county
    })
    if (selectedState != "USA") {
      d3.selectAll(".dropdown-label").classed("disabled", false)
      d3.select("#county-select")
      .append('option')
      .text("Select a county")
      .attr('value', '')
      .attr("selected", "selected")
      .attr("disabled", "disabled")
      .attr("hidden", "hidden")
    }else {
      d3.select(".county-menu").select(".dropdown-label").classed("disabled", true)

    }
    $("#county-select").selectmenu("refresh");
  }


  var selectedLocation = function() {
    selectedCountyPh = d3.select("#county-select-button").select(".ui-selectmenu-text").text()
    selectedStatePh = d3.select("#state-select-button").select(".ui-selectmenu-text").text()
    $(".ui-widget-content.ui-autocomplete-input").blur()
  }


  $("#state-select")
  .selectmenu({
    open: function(event,ui) {
      var dropdownWidth = $("#dropdown-div").width()
      //TODO this height could be finessed, but doesn't look super broken as is
      var dropdownTop = $(".banner").height() + $(".state-menu").outerHeight(true)
      $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("top", dropdownTop + "px")
      $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("left", "0px")
      $("ul#state-select-menu").css("width", dropdownWidth + "px")
      // $("ul#state-select-menu").css("margin-left", "-137px")
      d3.select(".state-menu").select(".ui-icon")
      .classed("arrow-up", true)

    },
    close: function(event, ui) {
      d3.select(".state-menu").select(".ui-icon")
      .classed("arrow-up", false)
    },
    focus: function(event, ui) {

    },
    change: function(event, ui) {

      // if change is happening because of cmd-r keydown, break out of the cycle, and don't change the query string, etc.
      // note the event is happening BEFORE this, so $("#state-select").val() has already changed.
      // note the value change is BEFORE "change" and AFTER "focus" but both are triggered.
      if (event.handleObj.type === "keydown" && event.key === "r") {
        return ;
      }

      selectedLocation()
      var selectedState = ui.item.value;
      if (selectedState != "USA") {
        $(".bar-State").css("display", "block")
        $(".label-State").css("display", "block")
        $(".bar-County").css("display", "none")
        $(".label-County").css("display", "none")
        d3.select(".county-menu").select(".ui-icon")
        .classed("greyed", false)
        var selectedPlace = ui.item.value
        var selectedCategory = $("#category-select").val()

        updateBars(selectedCategory, selectedPlace)

        // add state to query string
        var stateQuery = ui.item.element.context.attributes[1].value;

        updateQueryString(type,selectedCategory,stateQuery)

        d3.select(".group-label-ph2.State").text(selectedPlace)
        d3.select(".group-label-ph.State").text(selectedPlace)

      }else {
        $(".bar-County").css("display", "none")
        $(".bar-State").css("display", "none")
        $(".label-County").css("display", "none")
        $(".label-State").css("display", "none")
        d3.select(".county-menu").select(".ui-icon")
        .classed("greyed", true)

        // remove state from query string
        var selectedCategory = $("#category-select").val()
        updateQueryString(type,selectedCategory,stateQuery)
      }

      filterCountyMenu(selectedState)

    }
  })
  .selectmenu("menuWidget")
  .addClass("ui-menu-icons customicons")


  $("#county-select")
  .selectmenu({
    open: function(event,ui) {
      var dropdownWidth = $("#dropdown-div").width()
      //TODO this height could be finessed, but doesn't look super broken as is
      var dropdownTop = $(".banner").height() + $(".county-menu").outerHeight(true) + $(".state-menu").outerHeight(true)
      $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("top", dropdownTop + "px")
      $("ul#county-select-menu").css("width", dropdownWidth + "px")
      $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("left", "0px")
      // $("ul#county-select-menu").css("margin-left", "-137px")
      d3.select(".county-menu").select(".ui-icon")
      .classed("arrow-up", true)
    },
    close: function(event, ui) {
      d3.select(".county-menu").select(".ui-icon")
      .classed("arrow-up", false)
    },
    change: function(event, ui) {

      // if change is happening because of cmd-r keydown, break out of the cycle, and don't change the query string, etc.
      if (event.handleObj.type === "keydown" && event.key === "r") {
        return;
      }

      selectedLocation()
      $(".bar-County").css("display", "block")
      $(".label-County").css("display", "block")
      var selectedPlace = ui.item.value
      var selectedCategory = $("#category-select").val()

      updateBars(selectedCategory, selectedPlace)
      d3.select(".group-label-ph2.County").text(selectedPlace)//toTitleCase(selectedPlace))
      d3.select(".group-label-ph.County").text(selectedPlace)//toTitleCase(selectedPlace))

      // add county/state to query string
      var countyQuery = ui.item.element.context.__data__.key;
      var stateQuery = parseInt(countyQuery.substring(0,2));
      updateQueryString(type,selectedCategory,stateQuery,countyQuery)

    }
  })
  .selectmenu("menuWidget")
  .addClass("ui-menu-icons customicons")


  $("#category-select")
  .selectmenu({
    open: function(event,ui) {
      var dropdownWidth = $("#dropdown-div").width()
      //TODO this height could be finessed, but doesn't look super broken as is
      var dropdownTop = $(".banner").height() + $(".category-menu").outerHeight(true) + $(".county-menu").outerHeight(true) + $(".state-menu").outerHeight(true)

      $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("width", "100%")
      $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("top", dropdownTop + "px")
      $("ul#category-select-menu").css("width", dropdownWidth)
      $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("left", "0px")
      // $("ul#category-select-menu").css("margin-left", "-137px")
      d3.select(".category-menu").select(".ui-icon")
      .classed("arrow-up", true)
    },
    close: function(event, ui) {
      d3.select(".category-menu").select(".ui-icon")
      .classed("arrow-up", false)
    },
    change: function(event, ui) {
      if (event.handleObj.type === "keydown" && event.key === "r") {
        return;
      }

      var selectedCategory = ui.item.value
      selectedLocation()
      updateBars(selectedCategory, selectedStatePh)
      setVariable(selectedCategory, true)

      // var countyQuery = $("#county-select")[0].selectedOptions[0].__data__.key;
      // stateQuery = $("#state-select")[0].selectedOptions[0].__data__.key
      var stateQuery = $("#state-select")[0].selectedOptions[0].__data__.key
      if (stateQuery != "USA") {

        // DW Fix this here
        if ($("#county-select")[0].length > 0 && $("#county-select")[0].selectedOptions[0].value != "") {
          countyQuery = $("#county-select")[0].selectedOptions[0].__data__.key
        }
        else {
          countyQuery = ""
        }
      } else {
        countyQuery = ""
        stateQuery = ""
      }

      updateQueryString(type,selectedCategory,stateQuery,countyQuery)

      hideBars(selectedCategory)
    }
  })
  .selectmenu("menuWidget")
  .addClass("ui-menu-icons customicons")
  
  d3.select(".county-menu").select(".ui-icon")
  .classed("greyed", true)



  /*ADD MAP*/
  var svg = d3.select("#map")
  .append("svg")
  .attr("width", width + 10)
  .attr("height", height)
  .attr("overflow", "hidden")

  svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "background")

  var projection = d3.geoAlbersUsa()
  var path = d3.geoPath().projection(projection)
  var states = topojson.feature(us, us.objects.states);
  projection.fitSize([width, height], states);
  var translateWidth = (IS_MOBILE) ? 0 : -20;
  //var mapScale = (IS_MOBILE) ? width/9300 : width/1010

  var widthOnLoad = width;
  
  var g = svg.append("g")
  .attr("class", "map-g")
  .attr("transform", "translate(" + translateWidth + ",0) scale(.90)")

  g.append("g")
  .attr("class", "counties")
  .selectAll("path")
  .data(tmp_county)
  .enter().append("path")
  .attr("d", path)
  .attr("id", function (d) { return d.properties.abbr + d.id; })
  .style("opacity",type=="youth"?0:1)
  .style("fill", function(d){
    return (isNaN(d.properties[SELECTED_VARIABLE]) == true) ? "#adabac" : quantize(d.properties[SELECTED_VARIABLE]);
  })
  .on('click', function(d) {

    // when clicked on state, this is a state click if outside of current state
    // otherwise this is county click.

    var state = d.properties.state;
    var stateData = BigData.tmp_state.filter(function(d){
      return d.properties.state == state
    })
    var selectedState = stateData[0]

    var previousState = (d3.select(".state-borders > path.selected").node() != null) ? d3.select(".state-borders > path.selected").attr("id") : ""
    var selectedCounty = (d["properties"])
    var level = (zoomState == true && previousState == d["properties"]["abbr"] && type != "youth") ? "county": "state";
    var county = d.properties["county"]
    var abbr = d.properties["abbr"]

    var countyQuery;
    var stateQuery = selectedState.id;

    if (d3.select(this).classed('selected') == true) {
      // This is the part where you unselect the county if you click on a selected county.

      $(".tagit-new").css("display", "block")
      d3.select(this).classed('selected', false)
      if (level == "county") {
        $('ul.tagit > li:nth-child(2)').remove()
        setZoom(false, true, false)
        updateTable(selectedState,type)
        updateBars(SELECTED_VARIABLE, d)
      }
    }else {
      reset()
      var county = (level == "state") ? null : county;
      countyQuery = (level == "state") ? null : d.properties.id;
      addTag(state, county, abbr)
      zoomMap(width, d, level)
      updateBars(SELECTED_VARIABLE, d)
    }
    updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)
  })
  .on('mouseover', function(d) {
    //if a state is already selected, store its abbreviation
    var previousState = (d3.select(".state-borders > path.selected").node() != null) ? d3.select(".state-borders > path.selected").attr("id") : ""
    var hoveredState = d.properties.abbr
    //what type of place is highlighted on hover?
    var geography = (zoomState == true && previousState == hoveredState && type != "youth") ? "county" : "state";
    var county = (geography == "county") ? d.properties.county : ""
    var state = d.properties.abbr

    if (zoomNational == true) {
      $(".state-borders").css("pointer-events", "all")
      $(".counties").css("pointer-events", "none")
      hoverLocation("", d.properties.abbr, "state");
      updateBars(SELECTED_VARIABLE, d)
    } else {
      if (geography == "state") {
        hoverLocation(county, state, geography)
        updateBars(SELECTED_VARIABLE, d3.select("path#" + hoveredState).datum())
        d3.select("#National").attr("transform", function() {
          return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
        })
        d3.select("#State").attr("transform", function() {
          return "translate(0, 20)";
        })
      } else {
        hoverLocation(county, state, geography)
        updateBars(SELECTED_VARIABLE, d)
      }
    }

  })
  .on('mouseout', function(d) {
    if (d3.select(".counties > path.selected").node() != undefined && type != "youth") { //IF A COUNTY IS SELECTED
      var county = d3.select(".counties > path.selected").datum().properties.county
      var abbr = d3.select(".counties > path.selected").datum().properties.abbr
      if (type != "youth"){
        d3.selectAll(".state-borders > path").classed("hide", true)
        d3.select(".state-borders > path#" + abbr).classed("hide", false)
      }else {
        d3.selectAll(".state-borders > path").style("opacity",.5).classed("hide",false)
        d3.select(".state-borders > path#" + abbr).style("opacity",1)
      }
    
      d3.selectAll("path.selected").moveToFront()
      d3.selectAll(".hover")
      .classed("hover", false)
      .classed("hoverNational", false)
      setZoom(false, true, true)
      updateBars(SELECTED_VARIABLE, d3.select(".counties > path.selected").datum())
      d3.select("#State").attr("transform", function(d,i) {
        return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
      })
    } else if (zoomNational && d3.select(".counties > path.selected").node() != undefined){//map is at national & county selected
      d3.select("#County").attr("transform", "translate(0, 20)")
      d3.select("#State").attr("transform", function(d,i) {
        return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
      })
      d3.select("#Nation").attr("transform", function(d,i) {
        return "translate(" + ( (width/3.1 + 5) * 2 ) + ", 20)";
      })
    } else if (d3.select(".state-borders > path.selected").node() != undefined) { //IF A STATE IS SELECTED
      var state = d3.select(".state-borders > path.selected").datum().properties.state
      var abbr = d3.select(".state-borders > path.selected").datum().properties.abbr
      if (type != "youth"){
        d3.selectAll(".state-borders > path").classed("hide", true)
        d3.select(".state-borders > path#" + abbr).classed("hide", false)
      } else {
        d3.selectAll(".state-borders > path").style("opacity",.5).classed("hide",false)
        d3.select(".state-borders > path#" + abbr).style("opacity",1)
      }
      

      d3.selectAll("path.selected").moveToFront()
      d3.selectAll(".hover")
      .classed("hover", false)
      .classed("hoverNational", false)
      setZoom(false, true, false)
      updateBars(SELECTED_VARIABLE, d3.select(".state-borders > path.selected").datum())
      d3.select("#State").attr("transform", "translate(0, 20)")
    } else if (zoomNational && d3.select(".state-borders > path.selected").node() != undefined){
      d3.select("#State").attr("transform", "translate(0, 20)")
      d3.select("#Nation").attr("transform", function(d,i) {
        return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
      })
    }
  })

  g.append("g")
  .attr("class", "state-borders")
  .selectAll("path")
  .data(tmp_state)
  .enter().append("path")
  .attr("d", path)
  .attr("id", function(d){
    return d.properties.abbr
  })
  .style("fill",function(d){
    if (type=="youth"){
      if (isNaN(d.properties[SELECTED_VARIABLE])){ 
        return "#adabac"
      } else {
        return quantize(d.properties[SELECTED_VARIABLE]);
      }
    } else return "rgba(0,0,0,0)";
  })
  .on('click', function(d) {

    // stateClick 1 is here

    d3.selectAll(".selectedNational").classed("selectedNational", false)
    var state = d.properties.state;
    // var county = d.properties.county;
    var abbr = d.properties.abbr;
    var level = "state"

    setZoom(false, true, false)  
    zoomMap(width, d, level)
    
    // $(".state-borders").css("pointer-events", "none")
    // $(".counties").css("pointer-events", "all")
    addTag(state, null, abbr)
    updateBars(SELECTED_VARIABLE, d)

    var stateQuery = d.properties.id;
    var countyQuery;
    updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)
  })
  .on('mouseover', function(d) {
    if (zoomNational == true || zoomNational_St == true) {
      hoverLocation("", d.properties.abbr, "state");
      updateBars(SELECTED_VARIABLE, d)
      // if you mouse over the already selected state...
      if (d3.select(".state-borders > path.selected").datum().id === d.id){
        if (zoomNational==true || zoomNational_St == true) {
          if (d3.select(".state-borders > path.selected").node() != undefined && zoomNational_St != true) {
            var state = d3.select(".state-borders > path.selected").datum().properties.state
            d3.select("#National").attr("transform", "translate(0, 20)");
            d3.selectAll("path.selected").moveToFront()
          }else if (zoomNational_St == true){
            d3.selectAll(".hover")
            .classed("hover", false)
            .classed("hoverNational", false)
            d3.selectAll("path.selected").moveToFront()
            var selected = (d3.select(".counties > path.selected").size() > 0) ? d3.select(".counties > path.selected").datum() : d3.select(".state-borders > path.selected").datum()
            var geography = (d3.select(".counties > path.selected").size() > 0) ? selected.properties["county"] + ", " + selected.properties["abbr"] : selected.properties["state"];

            updateBars(SELECTED_VARIABLE, selected)
            /*d3.select("#State").attr("transform", function(d,i) {
              return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)"; //this was making state overlap national
            })*/
          } else {

            d3.selectAll(".hover")
            .classed("hover", false)
            .classed("hoverNational", false)
            updateBars(SELECTED_VARIABLE, undefined)
          }
        }
      }
    } else {
      // $(".state-borders").css("pointer-events", "none")
      // $(".counties").css("pointer-events", "all")
      d3.select("#National").attr("transform", function(d,i) {
        return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
      })
    }
  })
  .on('mouseleave', function(d) {
    if (d3.select(".state-borders > path.selected").node() == undefined){
      d3.select("#National").attr("transform", "translate(0, 20)");
    }
    if (zoomNational==true || zoomNational_St == true) {
      if (d3.select(".state-borders > path.selected").node() != undefined && zoomNational_St != true) {
        var state = d3.select(".state-borders > path.selected").datum().properties.state
        d3.select("#National").attr("transform", "translate(0, 20)");
        d3.selectAll("path.selected").moveToFront()
      }else if (zoomNational_St == true){
        d3.selectAll(".hover")
        .classed("hover", false)
        .classed("hoverNational", false)
        d3.selectAll("path.selected").moveToFront()
        d3.select("#National").attr("transform", "translate(0, 20)");
        var selected = (d3.select(".counties > path.selected").size() > 0) ? d3.select(".counties > path.selected").datum() : d3.select(".state-borders > path.selected").datum()
        var geography = (d3.select(".counties > path.selected").size() > 0) ? selected.properties["county"] + ", " + selected.properties["abbr"] : selected.properties["state"];

        updateBars(SELECTED_VARIABLE, selected)
        // d3.select("#State").attr("transform", function(d,i) {
        //   return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
        // })
      } else {

        d3.selectAll(".hover")
        .classed("hover", false)
        .classed("hoverNational", false)
        updateBars(SELECTED_VARIABLE, undefined)
      }
    }

  })
  .on('mouseout', function(d) {
    if (zoomNational==true || zoomNational_St == true) {
      if (d3.select(".state-borders > path.selected").node() != undefined && zoomNational_St != true) {
        var state = d3.select(".state-borders > path.selected").datum().properties.state

        d3.selectAll("path.selected").moveToFront()
      }else if (zoomNational_St == true){
        d3.selectAll(".hover")
        .classed("hover", false)
        .classed("hoverNational", false)
        d3.selectAll("path.selected").moveToFront()
        var selected = (d3.select(".counties > path.selected").size() > 0) ? d3.select(".counties > path.selected").datum() : d3.select(".state-borders > path.selected").datum()
        var geography = (d3.select(".counties > path.selected").size() > 0) ? selected.properties["county"] + ", " + selected.properties["abbr"] : selected.properties["state"];

        updateBars(SELECTED_VARIABLE, selected)
      }else {

        d3.selectAll(".hover")
        .classed("hover", false)
        .classed("hoverNational", false)
        updateBars(SELECTED_VARIABLE, undefined)
      }
    }
  })


  /*ZOOM OUT BUTTON*/
  var data = [{x: width - 35, y: height / 1.5, id: "zoom_out"}]
  var button = svg.selectAll(".zoomBtn")
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'zoomBtn')
  .attr('id', function(d) {
    return d.id
  })
  .attr('transform', function(d) {
    return 'translate(' + d.x + ',' + (height - 80 ) + ')'
  });

  button
  .append("image")
  .attr("xlink:href", "img/reload.png")
  .attr("x", -15)
  .attr("y", 10)
  .attr("width", 50)
  .attr("height", 50)
  .on('click', function() {
    setZoom(false, false, false, true)
    zoomMap(width, null, "national")

    // state selected, not county
    if (d3.select(".state-borders > path.selected").node() != null && d3.select(".counties > path.selected").node() === null ){
      d3.select("#State").attr("transform", "translate(0, 20)");
    }

    // county selected
    if (d3.select(".counties > path.selected").node() != undefined){
      //position the things you’re showing
      d3.select("#National").attr("transform", function() {
        return "translate(" + ( width/3.1 + 5 ) * 2 + ", 20)";
      })
      d3.select("#State").attr("transform", function() {
        return "translate(" + ( width/3.1 + 5 ) * 1 + ", 20)";
      })
      d3.select("#County").attr("transform", "translate(0, 20)");
    }

  })

  /*LEGEND*/
  /*TABLET*/
  var keyWidthPhMaster = width * 0.8;
  var svgPh = d3.select("#legend-div")
  .append("svg")
  .attr("width", keyWidthPhMaster)
  .attr("height", 60)
  var legendPh = svgPh
  .append("g")
  .attr("class", "g-legend-ph")

  legendPh.append("text")
  .text(function() {
    if(SELECTED_VARIABLE === "delinquency_by_credit") {
      return "Subprime:"
    } else {
      return "All:"
    }
  })
  .attr("id", "legend-title")
  .attr("x", 12)
  .attr("y", 17)
  //TODO fix breaks for youth-- using overall breaks
  var selectedMeasureExtent = d3.extent(BigData.tmp_county, function(d){ if (!isNaN(d.properties[SELECTED_VARIABLE])) {return d.properties[SELECTED_VARIABLE] } })
  var keyWidthPh =   keyWidthPhMaster/9;
  var keyHeightPh =  15;
  for (i=0; i<=6; i++){
    if(i  < 5){
      legendPh.append("rect")
      .attr("width",keyWidthPh)
      .attr("height",keyHeightPh)
      .attr("class","rect"+i)
      .attr("x",keyWidthPh*i + 90)
      .attr("y", 5)
      .style("fill", COLORRANGE[i])
      legendPh.append("text")
      .attr("y", 34)
      .attr("class","legend-labels-ph legend-labels-ph" + i)
      .attr("x", keyWidthPh*i + 92)
      .attr("text-anchor", "middle")
      .text(function(){
        var min = selectedMeasureExtent[0];
        var array = variableListMaster[type].filter(function(d) {return d.variable == SELECTED_VARIABLE;})[0].breaks
        return (i==0) ? formatNumber(min, "min") : formatNumber((array[i-1]))
      })
    }
    if(i==6){
      legendPh.append("rect")
      .attr("width",keyWidthPh)
      .attr("height",keyHeightPh)
      .attr("class","rect"+i)
      .attr("x",keyWidthPh*i + 65)
      .attr("y", 5)
      .style("fill","#ADABAC")
      legendPh.append("text")
      .attr("y", 34)
      .attr("class","legend-labels-ph legend-labels-ph" + i)
      .attr("x",keyWidthPh*i + 85)
      .attr("text-anchor", "middle")
      .text("n/a")

    }
    if (i == 5) {
      legendPh.append("text")
      .attr("y", 34)
      .attr("class","legend-labels-ph legend-labels-ph" + i)
      .attr("text-anchor", "end")
      .attr("x",keyWidthPh*i + 90 )
      .attr("text-anchor", "middle")
      .text(function(){
        var max = selectedMeasureExtent[1]
        return formatNumber(max,"max")
      })
    }
  }

  legwidth = variableListMaster[type].filter(function(d) {return d.variable == SELECTED_VARIABLE;})[0].legendWidth;

  /*DESKTOP*/
  svg.append("rect")
  .attr("width", function() {
    return (IS_MOBILE) ? 73: legwidth;
  })
  .attr("class", "rect-div")
  .attr("height", 215)
  .style("fill", "#f5f5f5")
  .style("opacity", 0.8)
  .attr('transform', 'translate(' + (width- legwidth) + ',' + (-1) + ')')
  var legend = svg
  .append("g")
  .attr("class", "g-legend")
  .attr('transform', 'translate(' + (width- 55) + ',' + 20 + ')')
  legend.append("text")
  .text(function() {
    if(SELECTED_VARIABLE === "delinquency_by_credit") {
      return "Subprime"
    } else {
      return "All"
    }
  })
  .attr("id", "ftitle")
  .attr("x", 33)
  .attr("text-anchor", "end")
  legend.append("text")
  var keyWidth =   10;
  var keyHeight =  25;
  //TODO fix breaks for youth-- using overall breaks
  var selectedMeasureExtent = d3.extent(BigData.tmp_county, function(d){ if (!isNaN(d.properties[SELECTED_VARIABLE])) {return d.properties[SELECTED_VARIABLE] } })

  for (i=0; i<=6; i++){
    if(i <5){
      legend.append("rect")
      .attr("width",keyWidth)
      .attr("height",keyHeight)
      .attr("class","rect"+i)
      .attr("y",keyHeight*i + 23)
      .attr("x", 38)
      .style("fill", COLORRANGE[i])

      legend.append("text")
      .attr("x", 33)
      .attr("class","legend-labels " + i)
      .attr("y",keyHeight*i + 23)
      .attr("text-anchor", "end")
      .text(function(){
        var min = selectedMeasureExtent[0]
        var array = variableListMaster[type].filter(function(d) {return d.variable == SELECTED_VARIABLE;})[0].breaks
        return (i==0) ? formatNumber(min, "min") : formatNumber((array[i-1]))
      })
    }
    if(i==6){
      legend.append("rect")
      .attr("width",keyWidth)
      .attr("height",keyHeight)
      .attr("class","rect"+i)
      .attr("y",keyHeight*i + 10)
      .attr("x", 38)
      .style("fill", "#ADABAC")

      legend.append("text")
      .attr("x", 33)
      .attr("class","legend-labels " + i)
      .attr("y",keyHeight*i + 28)
      .attr("text-anchor", "end")
      .text("n/a")
    }
    if (i == 5) {
      legend.append("text")
      .attr("x", 33)
      .attr("class","legend-labels " + i)
      .attr("text-anchor", "end")
      .attr("y",keyHeight*i + 23)
      .text(function(){
        var max = d3.max(BigData.tmp_county, function(d) {
          // I don't *think* you should rely on researchers putting n<50 in each datasheet so isNaN seems like a better test ...
          // if (d.properties[SELECTED_VARIABLE] == "n<50") {
          if ( isNaN(d.properties[SELECTED_VARIABLE]) ){
            return -100
          } else {
            return d.properties[SELECTED_VARIABLE]
          }
        })
        return formatNumber(max,"max")
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
    var data =  tmp_county;
    var filteredData = data.filter(function(d){
      if (geography == "county") {
        return d.properties.county == county && d.properties.abbr == state
      }else {
        return d.properties.abbr == state
      }
    })

    var id = (geography == "county") ? filteredData[0]["id"] : ""
    if ( d3.select("path#" + filteredData[0]["properties"]["abbr"] + id).classed("hover") == true) {
    }else {
      d3.select("path#" + filteredData[0]["properties"]["abbr"] + id)
      .classed('hover', true)
      .classed('hide', false)
      .classed("hoverNational", function() {
        return (zoomNational == true || zoomNational_St) ? true : false
      })
      .moveToFront()
      if (type =="youth" &&!zoomNational){
        d3.select("path#" + filteredData[0]["properties"]["abbr"] + id)
        .style("opacity",1)
      }
    }
  }

  // .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  // .attr("id", "state-borders")
  // .attr("d", path)

  /*ADD TABLE*/
  // Build table

  $("#notes.temp").remove()
  $("#notes-section-inner.temp").remove()

  $("#notes").append(variableListMaster.meta.dataSets[type].specialNotes)
  $("#notes-section-inner").append(variableListMaster.meta.dataSets[type].specialNotes)

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


  $("#table-div").empty()

  var table = d3.select("#table-div")
  .append("table")

  updateTable(us_data,type)

  table.selectAll("tbody").filter(function(d) { return d.variable === typeVar}).classed('selected', true);
  //console.log(typeVar)

  /*END TABLE*/
  /*BAR CHARTS*/

  var groups = ["County", "State", "National"]
  // var groups_ph = ["County", "State", "National"]
  // var categories = ["All", "White", "Nonwhite"]
  var grabVar = variableListMaster[type].filter(function(d) {
    return d.variable == SELECTED_VARIABLE_ph;
  })


  var barData = [{data: us_data_ph[0]}, {data: us_data_ph[0]}, {data: us_data_ph[0]} ]
  /*MOBILE*/

  var barSvgHeight_ph = (IS_PHONESM) ? 200 : 173;
  var barWidth_ph = (IS_PHONESM) ? width : width*.85;
  var x_ph = d3.scaleLinear().range([0, barWidth_ph]);
  var y_ph = d3.scaleBand().range([30, 0]);
  // x_ph.domain([0, d3.max(state_data, function(d) { return d[SELECTED_VARIABLE]; })]);
  x_ph.domain([0, d3.max(BigData.county_data, function(d) {
    if (isNaN(d[NONWHITE_ph]) == true && isNaN(d[WHITE_ph]) == true){
      return +d[SELECTED_VARIABLE_ph]
    } else if (isNaN(d[NONWHITE_ph]) == true && isNaN(d[WHITE_ph]) == false) {
      return Math.max(+d[WHITE_ph], +d[SELECTED_VARIABLE_ph])
    } else if (isNaN(d[WHITE_ph]) == true && isNaN(d[NONWHITE_ph]) == false) {
      return Math.max(+d[NONWHITE_ph], +d[SELECTED_VARIABLE_ph])
    } else {
      return Math.max(+d[WHITE_ph], +d[NONWHITE_ph], +d[SELECTED_VARIABLE_ph])
    }
  })])

  y_ph.domain(us_data_ph.map(function(d) { return d[SELECTED_VARIABLE_ph]; }));
  var xAxis_ph = d3.axisBottom()
  .scale(x_ph)
  .ticks(0)
  var yAxis_ph = d3.axisLeft()
  .scale(y_ph)
  .ticks(0)

  for (var i = 0; i < groups.length; i++) {

    var group = groups[i]

    d3.select(".label-" + group )
    .append("svg")
    .attr("width", 400)
    .attr("height", 20)
    .append("text")
    .text(group)
    .attr("class", function() {
      return "group-label-ph " + group
    })
    .attr("transform", "translate(" + 15 + "," + 15 + ")")
    .attr("text-anchor", "start")

    var barLabel = d3.select(".label-" + group )
    .append("svg")
    .attr("width", 182)
    .attr("height", 130)
    .attr("class", "svg2")

    barLabel.selectAll("g")
    .data(grabVar[0].columns)
    .enter()
    .append("g")
    .append("text")
    .text(function(d,i) {
      return d
    })
    .attr("class", "category-labels-ph")
    .attr("transform", function(d,i) {
      return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i + 57) + ")" : "translate(" + 174 + "," + (40*i + 25) + ")";
    })
    .attr("text-anchor", "end")

    d3.select(".bar-" + group )
    .append("svg")
    .attr("width", barWidth_ph)
    .attr("height", barSvgHeight_ph)

    var barG_ph = d3.select(".bar-" + group).select("svg").append("g")
    .attr("class", function(d,i) {
      return "bar-group-ph " + group
    })
    .attr("transform", function(d,i) {
      return (IS_PHONESM) ? "translate(" + 0 + "," + (20) + ")" : "translate(" + 100 + "," + 0 + ")";
    })

    barG_ph.append("text")
    .text(function(d,i) {
      return group;
    })
    .attr("class", function(d,i) {
      return "group-label-ph2 " + group
    })

    barG_ph.append("text")
    .attr("class", "group-label-2")
    .attr("transform", function(d,i) {
      var width = (d3.select(".group-label-ph2." + group).node().getBoundingClientRect().width) + 5
      return "translate(" + width + "," + 0 + ")"
    })

    var subBarPh = barG_ph.selectAll("g")
    .data(grabVar[0].columns)
    .enter()
    .append("g")
    .attr("class", function(d,i) {
      return "category-ph c" + i
    })
    .attr("transform", function(d,i) {
      return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i) + ")" : "translate(" + 0 + "," + (40*i) + ")";
    })

    d3.selectAll(".bar-County, .bar-State, .label-County, .label-State")
    .style("display", "none")

    var rectG_ph = subBarPh.append("g")
    .attr("class", function(d,i) {
      return "rect-g c" + i})
    .attr("transform", function(d,i) {
      return "translate(" + 0 +"," + 28+ ")"
    })

    rectG_ph.append("g")
    .data(barData)
    .append("text")
    .attr("class", "data-label-ph")
    .attr("y", 12)
    .attr("dy", ".71em")
    // .attr("transform", function(d,i) {
    //   return "translate(" + (barWidth_ph-33) +"," + 0+ ")"
    // })

    rectG_ph.selectAll(".data-label-ph")
    .data([us_data])
    .attr("x", function(d) {
      return barX(d,this,SELECTED_VARIABLE_ph,NONWHITE_ph,WHITE_ph,x_ph)
    })
    .text(function(d) {
      var parentClass = $(this).closest(".rect-g").attr("class")
      if (limitedVars.filter(function(d) {return d == SELECTED_VARIABLE_ph;}) === []) {
        if (parentClass.search("c0") > -1) {
          return formatNumber(d[SELECTED_VARIABLE_ph])
        }else if (parentClass.search("c2") > -1) {
          return formatNumber(d[NONWHITE_ph])
        }else{
          return formatNumber(d[WHITE_ph])
        }
      } else {
        if (parentClass.search("c0") > -1) {
          return formatNumber(d[SELECTED_VARIABLE_ph])
        }
      }
    })

    rectG_ph
    .append("g")
    .attr("class", "g-text-ph")
    .append("text")
    .attr("x", 0)
    .attr("y", -13)
    .attr("dy", ".71em")
    .attr("text-anchor", "start")
    .text(function(d,i) { return d });

    rectG_ph.append("g")
    .attr("class", "x axis")
    .attr("transform", function(d,i) {
      return "translate(" + 0 +"," + 30 + ")"
    })
    .call(xAxis_ph)

    rectG_ph.append("g")
    .attr("class", "y axis")
    .call(yAxis_ph)

    rectG_ph.selectAll("rect")
    .data(us_data_ph)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("class", "bar-ph")
    .attr("height", y_ph.bandwidth())
    .attr("width", function(d) {
      var parentClass = d3.select(this.parentNode).attr('class');
      // if looking for the selected variable in limitedVars returns an empty array, bc selected != limitedVar
      if (limitedVars.filter(function(d) {return d == SELECTED_VARIABLE_ph;}) === []) {
        if (parentClass.search("c0") > -1) {
          return x_ph(+d[SELECTED_VARIABLE_ph])
        }else if (parentClass.search("c2") > -1) {
          return x_ph(+d[NONWHITE_ph])
        }else{
          return x_ph(+d[WHITE_ph])
        }
        // else if it is a limitedVar just assign a length to the first bar, not the white/poc bars
      } else {
        if (parentClass.search("c0") > -1) {
          return x_ph(+d[SELECTED_VARIABLE_ph])
        }
        else {
          return 0;
        }
      }
    })
    .attr("fill", function(d) {
      var parentClass = d3.select(this.parentNode).attr('class');
      if (parentClass.search("c0") > -1) {
        return "#fdbf11"
      }else if (parentClass.search("c2") > -1) {
        return "#696969"
      }else{
        return "#000000"
      }
    })
  }


  // this hides "white" and "non-white"
  hideBars(SELECTED_VARIABLE_ph)

  /*DESKTOP*/

  var barSvgHeight = (IS_MOBILE) ? 185 : 130;
  var barHeight = (IS_MOBILE) ? 90 : 65;
  var barWidth = (IS_MOBILE) ? 42 : 50;
  var x = d3.scaleBand()
  .rangeRound([0, barWidth])

  var y = d3.scaleLinear()
  .rangeRound([barHeight, 0]);
  county_data.forEach(function(d) {
    d.national = +d.values[0][SELECTED_VARIABLE];
    d.white = +d.values[0][WHITE];
    d.nonwhite = +d.values[0][NONWHITE];
  })
  // county_data.forEach(function(d) {

  // })
  // county_data.forEach(function(d) {

  // })
  x.domain([[us_data].map(function(d){
    return d.abbr
  })]);
  y.domain([0, d3.max(BigData.county_data, function(d) {
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

  var formatPercent = d3.format(".0%")
  var xAxis = d3.axisBottom()
  .scale(x)

  var yAxis = d3.axisLeft()
  .scale(y)
  .tickFormat(formatPercent);

  var chartPadding = (IS_MOBILE) ? 15 : 0;
  var barSvg = d3.select("#bar-chart")
  .append("svg")
  .attr('width', width - chartPadding)
  .attr('height', barSvgHeight)

  var barG = barSvg.selectAll("g")
  .data(groups)
  .enter()
  .append('g')
  .attr("transform", function(d,i) {
    var levelOfZoom = [zoomNational, zoomState, zoomCounty].indexOf(true);
    return "translate(" + ( (width/3.1 + 5) * levelOfZoom ) + ", 20)";
    // return "translate(" + ( (width/3.1 + 5) * i) + "," + (20) + ")";
  })
  .attr("id", function(d) {
    return d
  })
  .attr("class", "bar-group")

  barG.append("text")
  .text(function(d) {
    return (d=="National") ? d : "";
  })
  .attr("class", function(d,i) {
    return "group-label-2 c" + i
  })

  barG.append("text")
  .attr("class", "group-label-2")
  // .attr("transform", function(d,i) {
  //   // var width = (d3.select(".group-label." + d).node().getBoundingClientRect().width) + 5
  //   return "translate(" + width + "," + 0 + ")"
  // })

  var subBarG = barG.selectAll("g")
  .data(grabVar[0].columns)
  .enter()
  .append("g")
  .attr("class", function(d,i) {
    return "category c" + i
  })
  .attr("transform", function(d,i) {
    return (IS_MOBILE) ? "translate(" + ((barWidth + 2) * i ) + "," + 10 + ")" : "translate(" + (60 * i ) + "," + 10 + ")"
  })

  var rectG = subBarG.append("g")
  .attr("class", function(d,i) {
    return "rect-g c" + i})
  .attr("transform", function(d,i) {
    return "translate(" + 0 +"," + 15+ ")"
  })

  //remove this
  // rectG.append("g")
  // .attr("class", "x axis")
  // .attr("transform", function(d,i) {
  //   return "translate(" + 0 +"," + barHeight+ ")"
  // })
  // .call(xAxis)

  //add bars
  rectG.selectAll("rect")
  .data([us_data])
  .enter()
  .append("rect")
  .attr("x", function(d) {
    return x(d.abbr)
  })
  .attr("class", "bar")
  .attr("fill", function(d) {
    var parentClass = d3.select(this.parentNode).attr('class');
    if (parentClass.search("c0") > -1) {
      return "#fdbf11"
    }else if (parentClass.search("c2") > -1) {
      return "#696969"
    }else{
      return "#000000"
    }
  })
  .attr("width", x.bandwidth())
  .attr("y", function(d) {
    return barY(d,this,SELECTED_VARIABLE,NONWHITE,WHITE,y,barHeight)
  })
  .attr("height", function(d) {
    return barH(d,this,SELECTED_VARIABLE,NONWHITE,WHITE,y,barHeight)
  })

  d3.selectAll(".rect-g")
  .each(function(d,i) {
    d3.select(this)
    .data([us_data])
    .append("text")
    .attr("class", "bar-text")
    .attr("x", 0)
    .attr("y", function(d) {
      return labelY(d,this,SELECTED_VARIABLE,NONWHITE,WHITE,y,barHeight)
    })
    .attr("dy", ".71em")
    .attr("text-anchor", "start")
    .attr("class", "data-label")
    .text(function(d) {
      var parentClass = d3.select(this.parentNode).attr('class');
      if (parentClass.search("c0") > -1) {
        return formatNumber(d[SELECTED_VARIABLE])
      }else if (parentClass.search("c2") > -1) {
        return formatNumber(d[NONWHITE])
      }else{
        return formatNumber(d[WHITE])
      }
    })
  })


  // hide the words next to bars on restricted variables
  if (limitedVars.filter(function(d) {return d == SELECTED_VARIABLE;}).length != 0) {
    $(".category.c1").css("display", "none")
    $(".category.c2").css("display", "none")

  } else {
    $(".category.c1").css("display", "block")
    $(".category.c2").css("display", "block")
  }

  // Dan NOTE this hides state and county off the bat, but we will need to update this at some point.
  d3.selectAll("#State, #County").style("opacity", 0)
  d3.select("#Nation").attr("transform", "translate(0, 20)")


  function updateMap(variable) {

    /*var min = d3.min(BigData.tmp_county, function(d) {
      return d.properties[variable]
    })
    var max = d3.max(BigData.tmp_county, function(d) {
      return d.properties[variable]
    })*/

    var selectedMetricGeography = BigData.tmp_county;
    //TODO fix breaks for youth-- using overall breaks
    if (type=="youth"){ selectedMetricGeography = BigData.tmp_state;}

    var selectedMeasureExtent = d3.extent(selectedMetricGeography, function(d){ if (!isNaN(d.properties[SELECTED_VARIABLE])) {return d.properties[SELECTED_VARIABLE] } })
    var quantize = d3.scaleThreshold()
    .domain(variableListMaster[type].filter(function(d) {return d.variable == variable;})[0].breaks)
    .range(["#cfe8f3", "#73bfe2", "#1696d2", "#0a4c6a", "#000000"])
    d3.selectAll(".legend-labels")
    .each(function(d,i) {
      if (i != 6) {
        d3.select(this)
        .text(function(){
          var min = selectedMeasureExtent[0]
          // = d3.min(BigData.tmp_county, function(d) {
          //   if (d.properties[variable] == "n<50") {
          //     return 10000000
          //   } else {
          //     return d.properties[variable]
          //   }
          //   return d.properties[variable]
          // })
          var max = selectedMeasureExtent[1]
          // = d3.max(BigData.tmp_county, function(d) {
          //   if (d.properties[variable] == "n<50") {
          //     return 0
          //   } else {
          //     return d.properties[variable]
          //   }
          // })
          var array = variableListMaster[type].filter(function(d) {return d.variable == variable;})[0].breaks

          // README because of time restraints and uncertainty in how scales are calculated, some of these are being manually set
          if (i==0) {
            if (variable == "med_mon_pmt") {
              return "$95"
            } else {
              return formatNumber(min, "min")
            }
          }else if (i==5) {
            if (variable == "perc_stud_debt") {
              return "32%"
            } else if (variable == "perc_stud_debt_collect") {
              return "12%"
            } else if (variable == "perc_stud_debt_collect_STUD") {
              return "67%"
            } else if (variable == "med_mon_pmt") {
              return "$275"
            } else if (variable == "perc_no_bach") {
              return "98%"
            } else {
              return formatNumber(max, "max")
            }
          } else {
            return formatNumber(array[i-1])
          }
        })
      }

    })

    d3.selectAll(".legend-labels-ph")
    .each(function(d,i) {
      if (i != 6) {
        d3.select(this)
        .text(function(){
          var min = selectedMeasureExtent[0];

          var max = selectedMeasureExtent[1];
          var array = variableListMaster[type].filter(function(d) {return d.variable == variable;})[0].breaks
          if (i==0) {
            return formatNumber(min, "min")
          }else if (i==5) {
            return formatNumber(max, "max")
          }else {
            return formatNumber(array[i-1])
          }
        })
      }
    })

    var legendTitleTablet = d3.select("#legend-title")
    .text(function() {
      if(SELECTED_VARIABLE === "delinquency_by_credit") {
        return "Subprime:"
      } else {
        return "All:"
      }
    })

    if (type != "youth"){
      //make sure states hidden
      d3.select(".state-borders").selectAll("path")
      .transition()
      .duration(800)
      .style("fill", "rgba(0,0,0,0)")

      //make sure counties show, fill choropleth
      d3.select(".counties").selectAll("path")
      .transition()
      .duration(800)
      .style("opacity",1)
      .style("fill", function(d){
        return (d==undefined || isNaN(d.properties[variable]) == true) ? "#adabac" : quantize(d.properties[variable]); 
      })

    } else {
      //make sure counties hidden
      d3.select(".counties").selectAll("path")
      .transition()
      .duration(800)
      .style("opacity",0)

      //make sure states show, fill choropleth
      d3.select(".state-borders").selectAll("path")
      .classed("states-showing",true)
      .transition()
      .duration(800)
      .style("fill", function(d){
        return (isNaN(d.properties[SELECTED_VARIABLE]) ? "#adabac" : quantize(d.properties[SELECTED_VARIABLE]))
      })
    }
    

    var selected = (d3.select("path.selected").node() != null) ? (d3.select("path.selected").datum()) : undefined
    updateBars(variable, selected)

  } //end updateMap


  //legend for the bar charts on desktop
  function updateBarLegend(labels){

    d3.selectAll("li.key").remove()
    d3.selectAll("#bar-chart-legend > li").style("opacity", 1)
    var legendColors = ["#fdbf11","#000000", "#696969"]  // :(

    d3.select("#bar-chart-legend")
      .selectAll("li")
      .data(labels)
      .enter()
      .append("li")
      .text(function(d){ return d })
      .attr("class", function(d,i){
        return "key desktop-bar-legend-" + i;
      })
      .style("border-right", function(d,i){
        return "15px solid" + legendColors[i]
      })

    if ( limitedVars.indexOf(SELECTED_VARIABLE) > -1 ){
      d3.selectAll("#bar-chart-legend > li").style("opacity", 0)
    }
  }


  var barDataLabels = variableListMaster[type].filter(function(d){
    return d.variable === SELECTED_VARIABLE })[0].columns
  updateBarLegend(barDataLabels)


  function updateBars(variable, selected) {

    var barDataLabels = variableListMaster[type].filter(function(d){
      return d.variable === SELECTED_VARIABLE })[0].columns
    updateBarLegend(barDataLabels)

    var us_data = BigData.state_data[0]["values"][0]
    for (var key in us_data) {
      if (us_data.hasOwnProperty(key)) {
        if (+us_data[key] == NaN || +us_data[key] == 0){
          us_data[key = us_data[key]]
        }else {
          us_data[key] = +us_data[key]
        }
      }
    }

    d3.select("#notes-section").selectAll("p.note2, p.note1").style("opacity", 1)
    let CTnote = needsConnecticutACSnote(variable)
    d3.select("#notes-section > p.note4").style("display", CTnote.note ? "block" : "none")
    d3.select("#notes > p.note4").style("display", CTnote.note ? "block" : "none")
    // d3.selectAll(".note-header").html("<b>Note:</b>")
    //* this seems messy - updating global vars all over the place, and here using 'var'!
    //* also not forward thinking - what if there's another category down the line
    var WHITE_ph = variable + isDelinquency(variable)[0]
    var NONWHITE_ph = variable + isDelinquency(variable)[1]
    var data = BigData.county_data;
    //* just the object of info for selected variable
    grabVar = variableListMaster[type].filter(function(d) {
      return d.variable == variable;
    })

    /**MOBILE**/
    if (IS_PHONE) {

      var state_data_ph = BigData.state_data.filter(function(d) {
        return d.state == selectedStatePh
      })
      var county_data_ph = BigData.county_data.filter(function(d) {
        return d.county == selectedCountyPh && d.state == selectedStatePh
      })

      x_ph.domain([0, d3.max(data, function(d) {
        var xxxx;

        if (isNaN(+d[NONWHITE_ph]) == true && isNaN(+d[WHITE_ph]) == true){
          xxxx = +d[variable]
        }else if (isNaN(+d[NONWHITE_ph]) == true && isNaN(+d[WHITE_ph]) == false) {
          xxxx = Math.max(+d[WHITE_ph], +d[variable])
        }else if (isNaN(+d[WHITE_ph] == true && isNaN(+d[NONWHITE_ph])) == false) {
          xxxx = Math.max(+d[NONWHITE_ph], +d[variable])
        }else {
          xxxx = Math.max(+d[WHITE_ph], +d[NONWHITE_ph], +d[variable])
        }

        if (isNaN(xxxx) == true) {
          xxxx = 0
        }

        return xxxx
      })])

      var National = d3.select(".bar-group-ph.National").selectAll(".category-ph");
      var counter = -1;
      National
      .each(function() {

        d3.select(this).select(".bar-ph")
        .data(BigData.us_data_ph)
        .transition()
        .duration(300)
        .attr("width", function(d) {
          return barW(d,this,variable,NONWHITE_ph,WHITE_ph,x_ph)
        })
        d3.select(this).select(".data-label-ph")
        .data(BigData.us_data_ph)
        .attr("x", function(d) {
          return barX(d,this,variable,NONWHITE_ph,WHITE_ph,x_ph)
        })
        .attr("y", 12)
        .html(function(d) {
          return labelHTML_ph(d,this,variable,NONWHITE_ph,WHITE_ph)
        })

        d3.select(this).select(".g-text-ph > text").text(function(){
          var creditScores = ["Subprime","Near prime","Prime"]
          var communities = ["All","White communities","Communities of color"]
          counter += 1
          if (variable === "delinquency_by_credit"){
            return creditScores[counter]
          } else {
            return communities[counter]
          }
        })

      })

      var State = d3.select(".bar-group-ph.State").selectAll(".category-ph")
      var stateCounter = -1
      State
      .each(function() {
        d3.select(this).select(".bar-ph")
        .data(state_data_ph)
        .transition()
        .duration(300)
        // .attr("height", y_ph.bandwidth())
        .attr("width", function(d) {
          return barW(d,this,variable,NONWHITE_ph,WHITE_ph,x_ph)
        })
        d3.select(this).select(".data-label-ph")
        .data(state_data_ph)
        .attr("x", function(d) {
          return barX(d,this,variable,NONWHITE_ph,WHITE_ph,x_ph)
        })
        .html(function(d) {
          return labelHTML_ph(d,this,variable,NONWHITE_ph,WHITE_ph)
        })

        d3.select(this).select(".g-text-ph > text").text(function(){
          var creditScores = ["Subprime","Near prime","Prime"]
          var communities = ["All","White communities","Communities of color"]
          stateCounter += 1
          if (variable === "delinquency_by_credit"){
            return creditScores[stateCounter]
          } else {
            return communities[stateCounter]
          }
        })
      })
      if (selectedCountyPh != "" && type != "youth") {
        var County = d3.select(".bar-group-ph.County").selectAll(".category-ph")
        var countyCounter = -1
        County
        .each(function() {
          d3.select(this).select(".bar-ph")
          .data(county_data_ph)
          .transition()
          .duration(300)
          // .attr("height", y_ph.bandwidth())
          .attr("width", function(d) {
            return barW(d,this,variable,NONWHITE_ph,WHITE_ph,x_ph)
          })
          d3.select(this).select(".data-label-ph")
          .data(county_data_ph)
          .attr("x", function(d) {
            return barX(d,this,variable,NONWHITE_ph,WHITE_ph,x_ph)
          })
          .html(function(d) {
            return labelHTML_ph(d,this,variable,NONWHITE_ph,WHITE_ph,"yes")
          })
          d3.select(this).select(".g-text-ph > text").text(function(){
            var creditScores = ["Subprime","Near prime","Prime"]
            var communities = ["All","White communities","Communities of color"]
            countyCounter += 1
            if (variable === "delinquency_by_credit"){
              return creditScores[countyCounter]
            } else {
              return communities[countyCounter]
            }
          })
        })
      } else if (type == "youth") { //hide bars if coming from elsewhere
        d3.select(".bar-County").style("display","none")
        d3.select(".label-County").style("display","none")
      }

      d3.selectAll(".category-labels-ph")
      .text(function(d,i) {
        return grabVar[0].columns[i % 3];
      })



      hideBars(variable)

    }else {
      /*DESKTOP*/
      // var start = new Date();
      var data = (type=="youth") ? BigData.state_data : BigData.county_data;

      // var data = (zoomCounty == true) ? county_data : state_data;
      var x = d3.scaleBand()
      .rangeRound([0, barWidth])

      data.forEach(function(d) {
        d.national = +d.values[0][variable];
        d.white = +d.values[0][WHITE];
        d.nonwhite = +d.values[0][NONWHITE];
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



      var National = d3.select("#National").selectAll(".category")

      National
      .each(function() {

        d3.select(this).select(".bar")
        .data([us_data])
        .transition()
        .duration(300)
        .attr("y", function(d) {
          return barY(d,this,variable,NONWHITE,WHITE,y,barHeight)
        })
        .attr("height", function(d) {
          return barH(d,this,variable,NONWHITE,WHITE,y,barHeight)
        })

        d3.select(this).select(".data-label")
        .data([us_data])
        .attr("y", function(d) {
          return labelY(d,this,variable,NONWHITE,WHITE,y,barHeight)
        })
        .text(function(d) {
          return labelHTML(d,this,variable,NONWHITE,WHITE)
        })
        .append("tspan")
        .attr("font-style","italic")
        .attr("baseline-shift","super")
        .text(function(d){
          return labelsuperscript(d,this,variable,NONWHITE,WHITE);
        })
      })


      if ( (zoomNational == true) && selected == null) {
        d3.selectAll("#State, #County").style("opacity", 0)
        d3.select("#Nation").attr("transform", "translate(0, 20)")
      } else if (zoomNational_St && selected == null) {
      } else if (zoomNational == false || selected != null) { //IF MOUSE IS OVER A STATE OR COUNTY IN WHICHEVER VIEW
        var countyID = (d3.select(".counties > path.selected").node() == null ) ? "" : d3.select(".counties > path.selected").attr("id");
        var countyIDHov = (d3.select(".counties > path.hover").node() == null) ? "" : d3.select(".counties > path.hover").attr("id");
        var county = (countyID == "") ? "" : countyID.slice(2);
        var state = selected["properties"]["abbr"]
        var data =  BigData.tmp_county
        var State = d3.select("#State").selectAll(".category")
        var selectedState = d3.select("path#" + selected["properties"]["abbr"]).datum()
        var stateData = selectedState["properties"]

        d3.select("#State").select(".group-label-2").text(stateData["state"])

        d3.select("#National").attr("transform", function() {
          return "translate(" + ( (width/3.1 + 5) * 2 ) + ", 20)";
        })

        State
        .each(function() {

          d3.select(this).select(".bar")
          .data([stateData])
          .transition()
          .duration(300)
          .attr("y", function(d) {
            return barY(d,this,variable,NONWHITE,WHITE,y,barHeight)
          })
          .attr("height", function(d) {
            return barH(d,this,variable,NONWHITE,WHITE,y,barHeight)
          })

          d3.select(this).select(".data-label")
          .data([stateData])
          .attr("y", function(d) {
            return labelY(d,this,variable,NONWHITE,WHITE,y,barHeight)
          })
          .text(function(d) {
            return labelHTML(d,this,variable,NONWHITE,WHITE)
          })
          .append("tspan")
          .attr("font-style","italic")
          .attr("baseline-shift","super")
          .text(function(d){
            return labelsuperscript(d,this,variable,NONWHITE,WHITE);
          })
        })
        if ((countyID.slice(0,2) == state || countyIDHov.slice(0,2) == state) && type != "youth") { //don't show county bars in youth tab at all
          d3.selectAll("#National, #State, #County").style("opacity", 1)

          //position the things you're showing
          d3.select("#National").attr("transform", function() {
            return "translate(" + ( (width/3.1 + 5) * 2 ) + ", 20)";
          })
          d3.select("#State").attr("transform", function() {
            return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
          })
          d3.select("#County").attr("transform", "translate(0, 20)")

          var County = d3.select("#County").selectAll(".category")
          var countyData = selected["properties"]
          //this is sometimes empty ... when 'selected' is a state
          //so if there's a county in the URL rewrite teh variable countyData to have correct deets

          d3.select("#County").select(".group-label-2").text(countyData["county"])//toTitleCase(countyData["county"]))


          County
          .each(function() {

            d3.select(this).select(".bar")
            .data([countyData])
            .transition()
            .duration(300)
            .attr("y", function(d) {
              return barY(d,this,variable,NONWHITE,WHITE,y,barHeight)
            })
            .attr("height", function(d) {
              return barH(d,this,variable,NONWHITE,WHITE,y,barHeight)
            })
            d3.select(this).select(".data-label")
            .data([countyData])
            .attr("y", function(d) {
              return labelY(d,this,variable,NONWHITE,WHITE,y,barHeight)
            })
            .text(function(d) {
              return labelHTML(d,this,variable,NONWHITE,WHITE)
            })
            .append("tspan")
            .attr("font-style","italic")
            .attr("baseline-shift","super")
            .text(function(d){
              return labelsuperscript(d,this,variable,NONWHITE,WHITE);
            })
          })
        } else {
          d3.selectAll("#County").style("opacity", 0)
          d3.selectAll("#National, #State").style("opacity", 1)
          //position the things you're showing
          d3.select("#National").attr("transform", function() {
            return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
          })
          d3.select("#State").attr("transform", "translate(0, 20)")
        }
      }
    }

    //REMOVE WHITE AND NONWHITE BARS IF NONWHITE POP VARIABLE IS SELECTED
    hidelimited(variable)
  }


  function addTag(state, county, abbr) {

    var widgetHeight = (IS_MOBILE) ? 80 : 60;
    ($(".search-div > .ui-widget").css("height", widgetHeight))
    d3.selectAll('li.tagit-choice').remove()
    var newTag = $("ul.tagit").append('<li id="state" class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable"></li>')
    $('li#state').insertBefore(".tagit-new").append('<span class="tagit-label">' + state + '</span>')
    $('li#state').append('<a class="tagit-close"</a>')
    $("li#state > a.tagit-close").append('<span class="text-icon"</span>')
    $("li#state > a.tagit-close").append('<span class="ui-icon ui-icon-close"</span>')
    // if ($("li#state").width() < 70) {
    //   $("li#state").css("margin-right", "100px")
    // }else {
    //   $("li#state").css("margin-right", "20px")
    // }
    setZoom(false,true, false)
    createSearchArray(abbr)

    $("li#state").on('click', function() {
      d3.selectAll("path.selectedNational").classed("selectedNational", false)
      d3.selectAll('li.tagit-choice').remove()
      $(".tagit-new").css("display", "block")
      $('.ui-widget-content.ui-autocomplete-input').focusout(function(){
        $(this).attr('placeholder','Search for a state or county');
      });
      d3.selectAll("path.selected")
      .classed("selected", false)

      setZoom(true,false, false)
      zoomMap(width, null, "national")
      createSearchArray("")

      var stateQuery;
      var countyQuery;

      updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)
      d3.select("#National").attr("transform", "translate(0, 20)");
    })

    if (county != undefined) {

      var newTag = $("ul.tagit").append('<li id="county" class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable"></li>')
      $('li#county').insertBefore(".tagit-new").append('<span class="tagit-label">' + county /*toTitleCase(county)*/ + '</span>')
      $('li#county').append('<a class="tagit-close"</a>')
      $("li#county > a.tagit-close").append('<span class="text-icon"</span>')
      $("li#county > a.tagit-close").append('<span class="ui-icon ui-icon-close"</span>')
      setZoom(false,true, true)
      $(".tagit-new").css("display", "none")
      var filteredData = BigData.tmp_county.filter(function(d) {
        return (d.properties["county"] == county && d.properties["state"] == state);
      })


      $("li#county").on('click', function() {
        // for when you click on the x of the county.
        var stateData = BigData.tmp_state.filter(function(d) {
          return d.properties["state"] == state
        })
        d3.selectAll(".counties").selectAll("path.selectedNational").classed("selectedNational", false)
        $(".tagit-new").css("display", "block")
        $(".tagit-new").css("autocomplete", "on")
        $('.ui-widget-content.ui-autocomplete-input').focusout(function(){
          $(this).attr('placeholder','');
        });
        setZoom(false,true, false)
        d3.select(this).remove()

        d3.selectAll(".counties > path.selected")
        .classed("selected", false)
        updateBars(SELECTED_VARIABLE, filteredData[0])

        d3.select("#State").attr("transform", "translate(0, 20)")
        d3.select("#Nation").attr("transform", function(d,i) {
          return "translate(" + ( (width/3.1 + 5) * 1 ) + ", 20)";
        })

        updateTable(stateData[0],type)
        var stateQuery = stateData[0].id;
        var countyQuery;
        updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)

      })

      updateBars(SELECTED_VARIABLE, filteredData[0])
    }
  }


  function updateTable(data,type){

    var columns = ["All", "White", "NonWhite"]
    var rowNumbers = [1,2,3]

    if (type){
      // var groups = variableList[type]["groups"]
      var rowData =  variableListMaster[type]

      // based on type, define the groups and rowdata
      var tbody = table.selectAll('tbody')
      .data(variableListMaster[type])

      tbody.classed("medical",false)
      tbody.classed("student",false)
      tbody.classed("auto",false)
      tbody.classed("youth",false)
      tbody.classed(type,true)


      tbody.enter().append("tbody")

      .merge(tbody)
      .attr("class", function(d, i) {
        return type + " " + d.nondebtfirst + " " + " new group group-" + i
      })
      .on('click', function(d) {
        d3.selectAll('tbody')
        .classed('selected', false)
        d3.select(this)
        .classed('selected', true)
        d3.select(".rect-div")
        .attr("width", function() {
          return (IS_MOBILE) ? 73: d.legendWidth
        })
        .attr('transform', 'translate(' + (width - d.legendWidth) + ',' + (-1) + ')')

        setVariable(d.variable)
        updateMap(d.variable)

        // above map replace header w/ debt type
        d3.select("#debt-type").html(function(){
          return variableListMaster[type].filter(function(d){
            return d.variable === SELECTED_VARIABLE
          })[0].desktopLabel;
        })
        //here
        var mapLegendTitle = d3.select("#ftitle");

        mapLegendTitle.text(function() {
          if(SELECTED_VARIABLE === "delinquency_by_credit") {
            return "Subprime"
          } else {
            return "All"
          }
        })

        var stateQuery;
        var countyQuery;

        // add selections to querystring
        if (d3.select("g.counties").selectAll("path.selected")._groups[0].length !== 0) {
          countyQuery = d3.select("g.counties").selectAll("path.selected").datum().id;
        }
        if (d3.select("g.state-borders").selectAll("path.selected")._groups[0].length !== 0) {
          stateQuery = d3.select("path#" + selectedState.properties.abbr).datum().id;
        }
        updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)

        // hide the words next to bars on restricted variables
        if (limitedVars.filter(function(d) {return d == SELECTED_VARIABLE;}).length != 0) {
          $(".category.c1").css("display", "none")
          $(".category.c2").css("display", "none")

        } else {
          $(".category.c1").css("display", "block")
          $(".category.c2").css("display", "block")
        }

      }) //ends on 'click'
      tbody.exit().remove();

      var tr = table.selectAll('tbody.new').selectAll('tr')
      .data(rowNumbers)


      tr.enter().append('tr')
      .attr("class", function(d,i) {
        if (i%3 == 0 ) {
          return "cell-header new"
        }else if (i%3==2) {
          return "cell-column"
        }else {
          return "cell-data"
        }
      })

      d3.selectAll(".cell-header.new").selectAll("th")
      .data([1]).enter().append("th")
      .attr("colspan", 3)

      d3.selectAll(".cell-header").select("th")
      .each(function(d,i) {
        d3.select(this)
        .html(function() {
          return variableListMaster[type][i].desktopLabel;
        })
      })

      d3.selectAll(".cell-column")
      .each(function(d,i) {
        var columns = variableListMaster[type][i].columns;
        d3.select(this).selectAll("td")
        .data(columns)
        .enter().append("td")
        .merge(d3.select(this).selectAll("td"))
        .text(function(d) {
          return d;
        })
      })
      d3.selectAll(".cell-data")
      .each(function(d,i) {

        var rowVariable = variableListMaster[type][i].variable,
        rowVariable_nw = rowVariable + isDelinquency(rowVariable)[1];
        rowVariable_wh = rowVariable + isDelinquency(rowVariable)[0];
        var columns = variableListMaster[type][i].columns;

        d3.select(this).selectAll("td")
        .data(columns)
        .enter().append("td")
        .text(function(d,i) {
          if (i==0) {
            return ((us_data[rowVariable]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable]);
          }else if (i==1){
            return ((us_data[rowVariable_wh]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable_wh]);
          }else if (i==2) {
            return ((us_data[rowVariable_nw]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable_nw]);
          }
        })
      })

      // Remove things (EXIT) and remove the "new" headlines

      // create a means. (ABOVE) for passing through new data to the tables.
    } // ends if (type)


    // whether there's a 'type' or not, you must rewrite the footnotes and annotation letters
    var data = (zoomNational == true) ? data : data["properties"];
    d3.selectAll("p.note1, p.note2").style("opacity", 1)
    d3.selectAll(".cell-data")
    .each(function(d,i) {
      var rowVariable = [rowData[i].variable]
      rowVariable_nw = rowVariable + isDelinquency(rowVariable[0])[1];
      rowVariable_wh = rowVariable + isDelinquency(rowVariable[0])[0];

      if ((data[rowVariable]) == "n<50" || (data[rowVariable_nw]) == "n<50" || (data[rowVariable_wh]) == "n<50") {
        d3.select("p.note1").style("opacity", 1)
      }
      if ((data[rowVariable]) == "N/A" || (data[rowVariable_nw]) == "N/A" || (data[rowVariable_wh]) == "N/A") {
        d3.select("p.note2").style("opacity", 1)
      }

      let CTnote = needsConnecticutACSnote(rowVariable[0])
      d3.select("#notes-section > p.note4").style("display", CTnote.note ? "block" : "none")
      d3.select("#notes > p.note4").style("display", CTnote.note ? "block" : "none")

      d3.select(this).selectAll("td")
      .html(function(d,i) {
        if (i==0) {
          if (isNaN(data[rowVariable]) == true) {
            //return  "n/a<sup><i>b</i></sup>"
            return  CTnote.superscript ? "n/a<sup><i>d</i></sup>" : "n/a<sup><i>b</i></sup>"
            // return (data[rowVariable] == "n<50") ? "n/a<sup><i>b</i></sup>" : "n/a<sup><i>c</i></sup>"
          }else {
            return formatNumber(data[rowVariable]);
          }
        }else if (i==1){
          if (isNaN(data[rowVariable_wh]) == true) {
            //return "n/a<sup><i>b</i></sup>"
            return  CTnote.superscript ? "n/a<sup><i>d</i></sup>" : "n/a<sup><i>b</i></sup>"
            // return (data[rowVariable_wh] == "n<50") ? "n/a<sup><i>b</i></sup>" : "n/a<sup><i>c</i></sup>"
          }else {
            return formatNumber(data[rowVariable_wh]);
          }
        }else if (i==2) {
          if (isNaN(data[rowVariable_nw]) == true) {
            //return "n/a<sup><i>b</i></sup>"
            return  CTnote.superscript ? "n/a<sup><i>d</i></sup>" : "n/a<sup><i>b</i></sup>"
            // return (data[rowVariable_nw] == "n<50") ? "n/a<sup><i>b</i></sup>" : "n/a<sup><i>c</i></sup>"
          }else {
            return formatNumber(data[rowVariable_nw]);
          }
        }
      })
    }) //close .cell-data
  } // ends updateTable



  function zoomMap(width, d,zoomLevel){
    var x, y, k;
    d3.select(".state-borders").selectAll("path")
    .classed("hide", false)
    .classed("selectedNational", false)

    if (zoomLevel != "national") {
      $('.zoomBtn').css("display", "block")
      $('.tagit-new > input').attr('placeholder', '')
      d3.selectAll("path.hoverNational").classed("hoverNational", false)

      if (type != "youth"){
        d3.select(".state-borders").selectAll("path:not(#" + d.properties.abbr + ")")
        .classed("hide", true)
      }else {
        d3.selectAll(".counties > path").style("opacity",0)
        d3.selectAll(".state-borders > path").style("opacity",.5).classed("hide",false)
        d3.select(".state-borders > path#" + d.properties.abbr).style("opacity",1)
      }
      
      $(".state-borders").css("pointer-events", "none")
      $(".counties").css("pointer-events", "all")

      d3.selectAll("path").classed("selected", false)
      d3.select("path#" + d["properties"]["abbr"])
      .classed("selected", true)
      .moveToFront()

      setZoom(false, true, false)
      for (var i = 0; i < tmp_state.length; i++) {
        if (tmp_state[i]["properties"]["state"] == d.properties.state){
          selectedState = tmp_state[i]
        }
      }
      // var centroid = path.centroid(selectedState); //replace with variable d to center by county
      // x = centroid[0];
      // y = centroid[1];
      // k = 4;
      // centered = selectedState.properties.state;
      var data = (zoomLevel == "state") ? d3.select("path#" + selectedState.properties.abbr).datum() : d;

      updateTable(data,type)

      if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select("path#" + d.properties.abbr).classed("active", true);
      var bounds = path.bounds(selectedState),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = (type == "youth") ? .65 / Math.max(dx / width, dy / height) : .9 / Math.max(dx / width, dy / height), //edited to lessen zoom in youth tab
      translate = [width / 2 - scale * x, height / 2 - scale * y];
      g.transition()
      .duration(750)
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

      if (zoomLevel == "county") {
        setZoom(false, true, true)

        d3.selectAll("g.counties > path").classed("selected", false)
        d3.select("path#" + d["properties"]["abbr"] + d.id)
        .classed("selected", true)
        .moveToFront()
        // updateTable(data)
      }
    } else {
      if (IS_MOBILE == true) {
        d3.selectAll(".hover").classed("hover", false)
      }
      //ZOOM OUT TO NATIONAL VIEW
      if (zoomNational_St == true) {
        updateBars(SELECTED_VARIABLE, null)
        if (d3.select(".state-borders > path.selected").node() != null && d3.select(".counties > path.selected").node() === null ){
          d3.select("#State").attr("transform", "translate(0, 20)");
        }
      }else {
        setZoom(true, false, false)
        // reset zoom to US
        var us_data = BigData.state_data[0]["values"][0]
        for (var key in us_data) {
          if (us_data.hasOwnProperty(key)) {
            if (+us_data[key] == NaN || +us_data[key] == 0){
              us_data[key = us_data[key]]
            }else {
              us_data[key] = +us_data[key]
            }
          }
        }

        updateTable(us_data,type)
        updateBars(SELECTED_VARIABLE, d)
      }
      $('.zoomBtn').css("display", "none")
      $('.tagit-new > input').attr('placeholder', '')
      $(".state-borders").css("pointer-events", "all")
      $(".counties").css("pointer-events", "none")
      x = width / 1.4;
      y = height / 1.5;
      k = .7;
      centered = null;
      g.selectAll("path")
      .style("opacity",1)
      .classed("active", centered && function(d) {return d === centered; });
      var translateWidth = (IS_MOBILE) ? 0 : -50,
      mapScale = (IS_MOBILE) ? (width-50)/widthOnLoad : (width-50)/widthOnLoad;
      //mapScale = (IS_MOBILE) ? width/730 : width/760;
      //projection.fitSize([width, height], states);

      g.transition()
      .duration(750)
      .attr("transform", "translate(" + translateWidth + ",0)scale("+mapScale+")")
      // .style("stroke-width", 1.5 / k + "px");
      d3.selectAll("path.selected").classed("selectedNational", true)
    }
    // var selectedPlace = (d3.selectAll(".counties").selectAll("path.selected").size() > 0) ? d3.selectAll(".counties").select("path.selected").datum() : d3.selectAll(".state-borders").select("path.selected").datum() ;
    // var d2 = (selectedPlace==null) ? null : selectedPlace;

  }

  $(window).resize(function() {
    if (!Startquery || Startquery["print"] != "true") {
      setScreenState (d3.select("#isMobile").style("display") === "block", d3.select("#isPhone").style("display") === "block", d3.select("#isPhoneSm").style("display") === "block" )
      initialWidth = (IS_PHONE) ? $('body').width() : $("body").width() - $(".td-table").width()

      barSvgHeight = (IS_MOBILE) ? 185 : 130
      barSvgHeight_ph = (IS_PHONESM) ? 200 : 173
      barHeight = (IS_MOBILE) ? 90 : 65;
      barWidth = (IS_MOBILE) ? 42 : 50;
      setHeight = tdMap*.7;
      var x = d3.scaleBand()
      .rangeRound([0, barWidth])
      var xAxis = d3.axisBottom()
      .scale(x)
      .ticks(0)
      //    margin = (IS_PHONE) ? {top: 10, right: 30, bottom: 10, left: 30} : {top: 10, right: 31, bottom: 10, left: 55}
      setWidth(initialWidth, IS_MOBILE, IS_PHONE)
      var mobilePadding = (IS_MOBILE) ? 0 : 15;
      width = tdMap - mobilePadding  //- margin.right-margin.left,
      height = (IS_PHONE) ? (width) - margin.top-margin.bottom :  setHeight//(width*.57) - margin.top-margin.bottom,
      if (IS_PHONE) {
        var barSvgHeight_ph = (IS_PHONESM) ? 200 : 173;
        var barWidth_ph = (IS_PHONESM) ? width : width*.85;
        var x_ph = d3.scaleLinear().range([0, barWidth_ph]);
        x_ph.domain([0, d3.max(BigData.county_data, function(d) {
          var xxxx;
          if (isNaN(d[NONWHITE_ph]) == true && isNaN(d[WHITE_ph]) == true){
            xxxx = d[SELECTED_VARIABLE_ph]
          }else if (isNaN(d[NONWHITE_ph]) == true && isNaN(d[WHITE_ph]) == false) {
            xxxx = Math.max(d[WHITE_ph], d[SELECTED_VARIABLE_ph])
          }else if (isNaN(d[WHITE_ph] == true && isNaN(d[NONWHITE_ph])) == false) {
            xxxx = Math.max(d[NONWHITE_ph], d[SELECTED_VARIABLE_ph])
          }else {
            xxxx = Math.max(d[WHITE_ph], d[NONWHITE_ph], d[SELECTED_VARIABLE_ph])
          }

          if (isNaN(xxxx) == true) {
            xxxx = 0
          }

          return xxxx;

        })])
        d3.selectAll(".bar-group-ph").selectAll(".category-ph")
        .each(function(d,i) {
          d3.select(this)
          .attr("transform", function() {
            return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i) + ")" : "translate(" + 50 + "," + (40*i) + ")";
          })
        })
        d3.selectAll("g.bar-group-ph")
        .each(function(d,i) {
          d3.select(this)
          .attr("transform", function() {
            return (IS_PHONESM) ? "translate(" + 0 + "," + (20) + ")" : "translate(" + 50 + "," + 0 + ")";
          })
        })

        d3.selectAll(".label").selectAll(".category-labels-ph")
        .each(function(d,i) {
          d3.select(this)
          .attr("transform", function() {
            return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i + 57) + ")" : "translate(" + 174 + "," + (40*i + 25) + ")";

          })
        })
        d3.selectAll(".label")
        .attr("width", width*.15)
        .attr("height", 163)
        d3.selectAll(".bar_ph" ).select("svg")
        .attr("width", barWidth_ph)
        .attr("height", barSvgHeight_ph)
        d3.selectAll(".bar-ph")
        .attr("width", function(d) {
          var parentClass = d3.select(this.parentNode).attr('class');
          if (parentClass.search("c0") > -1) {
            return (isNaN(d[SELECTED_VARIABLE_ph]) != true) ? x_ph(d[SELECTED_VARIABLE_ph]) : 0
          }else if (parentClass.search("c2") > -1) {
            return (isNaN(d[NONWHITE_ph]) != true) ?  x_ph(d[NONWHITE_ph]) : 0
          }else{
            return (isNaN(d[WHITE_ph]) != true) ?  x_ph(d[WHITE_ph]) : 0
          }
        })
        d3.selectAll(".data-label-ph")
        .attr("x", function(d) {
          var parentClass = $(this).closest(".rect-g").attr("class")
          if (parentClass.search("c0") > -1) {
            return (isNaN(d[SELECTED_VARIABLE_ph]) != true) ? x_ph(d[SELECTED_VARIABLE_ph]) + 5 : 0
          }else if (parentClass.search("c2") > -1) {
            return (isNaN(d[NONWHITE_ph]) != true) ? x_ph(d[NONWHITE_ph]) + 5 : 0
          }else{
            return (isNaN(d[WHITE_ph]) != true) ? x_ph(d[WHITE_ph]) + 5 : 0
          }
        })

      }else {
        var widgetHeight = (IS_MOBILE) ? 80 : 60;
        ($(".search-div > .ui-widget").css("height", widgetHeight))
        if (d3.selectAll("path.selected").size() > 0){
          setZoom(false, false, false, true)
          zoomMap(width, null, "national")
        }else {
          setZoom(true, false, false)
          // zoomMap(null, "national")
        }
        d3.select(".state-borders").selectAll("path")
        .classed("hide", false)
        d3.selectAll("path.selected")
        .classed("selectedNational", true)
        //UPDATE MOBILE LEGEND
        // possible place for consildation of code. SIMPLIFY
        var keyWidthPhMaster = width * 0.8;

        var legendPh = d3.select("#legend-div").select("svg")
        .attr("width", keyWidthPhMaster)
        var keyWidthPh =   keyWidthPhMaster/8;
        for (i=0; i<=6; i++){
          if(i  < 5){
            legendPh.select(".rect" + i)
            .attr("width",keyWidthPh)
            .attr("x",keyWidthPh*i + 50)
            d3.select(".legend-labels-ph" + i)
            .attr("x",keyWidthPh*i + 55)
          }
          if(i==6){
            legendPh.select(".rect" + i)
            .attr("width",keyWidthPh)
            .attr("x",keyWidthPh*i + 17)
            d3.select(".legend-labels-ph" + i)
            .attr("x",keyWidthPh*i + 45)

          }
          if (i == 5) {
            d3.select(".legend-labels-ph" + i)
            .attr("x",keyWidthPh*i + 55 )
          }
        }
        //UPDATE BAR CHARTS
        var chartPadding = (IS_MOBILE) ? 15 : 0;
        d3.select("#bar-chart").select("svg")
        .attr('width', width - chartPadding)
        .attr("height", barSvgHeight)
        d3.selectAll(".bar-group")
        .each(function(d,i) {
          d3.select(this)
          .attr("transform", function(d,i) {
            return "translate(" + ( (width/3.1 + 5) * i) + "," + (20) + ")";
          })
        })
        d3.selectAll(".category")
        .each(function(d,i) {
          d3.select(this)
          .attr("transform", function(d,i) {
            return (IS_MOBILE) ? "translate(" + ((barWidth+2) * i ) + "," + 10 + ")" : "translate(" + (60 * i ) + "," + 10 + ")"
          })
        })

        d3.selectAll(".x.axis")
        .attr("transform", function(d,i) {
          return "translate(" + 0 +"," + barHeight+ ")"
        })
        .call(xAxis)
        rectG.selectAll(".bar")
        .attr("width", x.bandwidth())
        .attr("y", function(d) {
          var parentClass = d3.select(this.parentNode).attr('class');
          if (parentClass.search("c0") > -1) {
            return (isNaN(d[SELECTED_VARIABLE]) != true) ? y(d[SELECTED_VARIABLE]) : barHeight;
          }else if (parentClass.search("c2") > -1) {
            return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) : barHeight;
          }else {
            return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) : barHeight;
          }
        })
        .attr("height", function(d) {
          var parentClass = d3.select(this.parentNode).attr('class');
          if (parentClass.search("c0") > -1) {
            return (isNaN(d[SELECTED_VARIABLE]) != true) ? barHeight - y(d[SELECTED_VARIABLE]) : 0;
          }else if (parentClass.search("c2") > -1){
            return (isNaN(d[NONWHITE]) != true) ? barHeight - y(d[NONWHITE]) : 0;
          }else {
            return (isNaN(d[WHITE]) != true) ? barHeight - y(d[WHITE]) : 0;
          }
        })
        d3.selectAll(".bar-text")
        .attr("y", function(d) {
          var parentClass = d3.select(this.parentNode).attr('class');
          if (parentClass.search("c0") > -1) {
            return (isNaN(d[SELECTED_VARIABLE]) != true) ? y(d[SELECTED_VARIABLE]) - 16 : barHeight -8;
          }else if (parentClass.search("c2") > -1) {
            return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) - 16 : barHeight - 8;
          }else{
            return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) - 16 : barHeight - 8;
          }
        })
        d3.selectAll(".data-label")
        .attr("y", function(d) {
          var parentClass = d3.select(this.parentNode).attr('class');
          if (parentClass.search("c0") > -1) {
            return (isNaN(d[SELECTED_VARIABLE]) != true) ? y(d[SELECTED_VARIABLE]) - 16 : barHeight -8;
          }else if (parentClass.search("c2") > -1) {
            return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) - 16 : barHeight - 8;
          }else{
            return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) - 16 : barHeight - 8;
          }
        })
        $("table").height($("table").width()*0.8);
        // var chartPadding = (IS_MOBILE) ? 15 : 0;
        d3.select("#map").select('svg')
        .attr('width', width)
        .attr('height', height)
        svg.select("rect")
        .attr('width', width)
        .attr('height', height)
        var translateWidth = (IS_MOBILE) ? 0 : -20,
        //mapScale = (IS_MOBILE) ? width/730 : width/760;
        mapScale = (IS_MOBILE) ? (width-50)/widthOnLoad : (width-50)/widthOnLoad;
        svg.select(".map-g")
        .transition()
        .duration(750)
        .attr("transform", "translate(" + translateWidth + ",0) scale("+mapScale+")")

        //  .attr("transform", "scale(" + width/1060 + ")");
        d3.selectAll(".bar-group")
        .each(function(d,i) {
          d3.select(this)
          .attr("transform", function() {
            return "translate(" + ( (width/3.1 + 5) * (i-1)) + "," + (20) + ")"; //edited to i-1 because county is removed at this point
          })
        })
        barG.selectAll('.category')
        .each(function(d,i) {
          d3.select(this)
          .attr("transform", function() {
            return (IS_MOBILE) ? "translate(" + ((barWidth + 2) * i ) + "," + 10 + ")" : "translate(" + (60 * i ) + "," + 10 + ")"
          })
        })
        d3.selectAll(".zoomBtn")
        .each(function(d,i) {
          d3.select(this)
          .attr('transform', function() {
            return 'translate(' + (width - 35) + ',' + (height - 80 + (i*40)) + ')'
          });
        })

        d3.select(".g-legend")
        .attr("height", height/2)
        .attr("width", function() {
          return (IS_MOBILE) ? 45 : 50;
        })
        .attr('transform', 'translate(' + (width- 55) + ',' + 20 + ')')

        d3.select(".rect-div")
        .attr("width", function() {
          return (IS_MOBILE) ? 73: 65
        })
        .attr('transform', 'translate(' + (width- 64) + ',' + (-1) + ')')
      }
    }
  })

  // Update the currently viewing section in the event that its been updated by the query string on load
  // $('#dropdown-header').val(type)
  // $('#dropdown-header').selectmenu("refresh")

  // Zoom the map if the urlquery contains state and/or county
  if (Startquery && Startquery["print"] != "true") {
    if (Startquery["county"] || Startquery["state"]) {

      // if there is a county but no state listed
      if (!Startquery["state"]) {
        // add state to startquery
        stateQuery = parseInt(Startquery["county"].substring(0,2));
        Startquery["state"] = stateQuery;
        // add state to url string

        updateQueryString(type,typeVar,stateQuery,Startquery["county"])
      }

      var geoData = BigData.tmp_county
      var geoType = (Startquery["county"]) ? "county" : "state";

      // var geography = (geoType == "county") ? county : state;
      // selectedLocation()

      var filteredData = geoData.filter(function(d) {
        if (geoType == "county") {
          return d.id == Startquery["county"];
        }else {
          return d.properties["state_id"] == Startquery["state"];
        }
      })

      //  convert state number to state name
      var data = filteredData[0]

      zoomMap(width, data, geoType)

      // do stuff for county and mobile
      $("#state-select").val(filteredData[0].properties.state)
      $("#state-select").selectmenu("refresh")
      selectedLocation()
      $(".bar-State").css("display", "block")
      $(".label-State").css("display", "block")

      d3.select(".group-label-ph2.State").text(filteredData[0].properties.state)
      d3.select(".group-label-ph.State").text(filteredData[0].properties.state)

      filterCountyMenu(filteredData[0].properties.state)

      d3.select(".county-menu").select(".ui-icon").classed("greyed", false)
      $("#county-select").selectmenu("refresh")
      var county = null;
      if (geoType == "county") {
        addTag(data.properties.state,data.properties.county,data.properties.abbr)

        // do stuff for county and mobile

        $(".bar-County").css("display", "block")
        $(".label-County").css("display", "block")

        $("#county-select").val(filteredData[0].properties.county)
        $("#county-select").selectmenu("refresh")

        selectedLocation()

        d3.select(".group-label-ph2.County").text(filteredData[0].properties.county) //toTitleCase(filteredData[0].properties.county))
        d3.select(".group-label-ph.County").text(filteredData[0].properties.county) //toTitleCase(filteredData[0].properties.county))
        if (IS_PHONE) {
          county = filteredData[0].properties.county;
          updateBars(typeVar, county)
        }
      }else {
        addTag(data.properties.state,null,data.properties.abbr)
        $('.ui-widget-content.ui-autocomplete-input').attr('placeholder', '')
        var filter = data["properties"]["abbr"]
        createSearchArray(filter)

        var stateData = BigData.tmp_state.filter(function(d){
          return d.properties.state == data.properties.state;
        })

        updateBars(typeVar, stateData[0])
      }

    }
    else {
      updateBars(typeVar)
    }


    $('#category-select').val(Startquery["variable"]);
    $("#category-select").selectmenu("refresh")

  } else if (Startquery["print"] === "true") {
    d3.select("#debt-type").html(printNameFinal)
    d3.select(".youth-banner").classed("hidden",true)
    d3.select("#cat-nav").classed("hidden",true)
    d3.select("#cat-nav-mobile").classed("hidden",true)
    d3.select(".print-button").classed("hidden",true)
    d3.select(".debt-title-flex-filter-box").classed("hidden",true)
  }
};

// DWCut? if it might could be cut/consolidated

  if (window.location.search) {    
    // If there's a url search query, do a bunch of stuff like create the beginning zoom variables

    // DECODE the query
    var Startquery = decodeQuery(window.location.search)
    
    if (Startquery["print"] === "true") {
      d3.select("body").classed("print",true)
    }
}

var IS_MOBILE;
var IS_PHONE;
var IS_PHONESM;
var BREAKS ={"perc_debt_collect":[0.22, .31, .39, .49],"med_debt_collect":[1200, 1500, 1800, 2300], "perc_debt_med":[.11,.18,.26,.34], "med_debt_med":[500,700,950,1250], "perc_pop_nw":[.13,.28,.46,.67], "perc_pop_no_ins":[.08,.13,.18,.26], "avg_income":[52650,63850,77900,101050],"perc_stud_debt":[0.10,0.13,0.16,0.20],"med_stud_debt": [12550,15050,17450,20350],"perc_stud_debt_collect": [0.01,0.02,0.03,0.06],"perc_stud_debt_collect_STUD": [0.07,0.13,0.2,0.3],"med_stud_debt_collect": [6150,7550,9000,10700],"med_mon_pmt": [135,155,175,195],"perc_no_bach": [0.59,0.71,0.79,0.85]};
var legendWidth = {"perc_debt_collect": 60,"perc_debt_med": 58,"med_debt_collect": 73,"med_debt_med": 70,"perc_pop_nw": 63,"perc_pop_no_ins": 60,"avg_income": 89,"perc_stud_debt":60,"med_stud_debt":89,"perc_stud_debt_collect":60,"perc_stud_debt_collect_STUD":60,"med_stud_debt_collect":89,"med_mon_pmt":70,"perc_no_bach":60};

var variableList = {
  "medical":{
    "groups": ["Share with any debt in collections<span class=\"annotation\"><sup>a</sup></span>", "Median debt in collections<span class=\"annotation\"><sup>a</sup></span>", "Share with medical debt in collections<span class=\"annotation\"><sup>a</sup></span>", "Median medical debt in collections<span class=\"annotation\"><sup>a</sup></span>","Nonwhite population share", "Share without health insurance coverage","Average household income"],
    "variables": ["perc_debt_collect", "med_debt_collect", "perc_debt_med", "med_debt_med", "perc_pop_nw", "perc_pop_no_ins", "avg_income"]
  },
  "student":{
    "groups":["Share with student loan debt<span class=\"annotation\"><sup>a</sup></span>","Median student loan debt<span class=\"annotation\"><sup>a</sup></span>","Share of student loan holders with student loan debt in collections<span class=\"annotation\"><sup>a</sup> <sup>d</sup></span>","Median student loan debt in collections<span class=\"annotation\"><sup>a</sup></span>","Median monthly student loan payment<span class=\"annotation\"><sup>a</sup></span>","Share of people with credit records who have student loan debt in collections<span class=\"annotation\"><sup>a</sup> <sup>e</sup></span>","Nonwhite population share","Share without a bachelor’s degree","Average household income"],
    "variables":["perc_stud_debt","med_stud_debt","perc_stud_debt_collect_STUD","med_stud_debt_collect","med_mon_pmt","perc_stud_debt_collect","perc_pop_nw","perc_no_bach","avg_income"]       
  }
}


// insert here any variables that only have 1 item, namely "Nonwhite population share" for now, and in the future, anything else similar.
var limitedVars = ["perc_pop_nw"]      

// var legendTranslate = {"perc_debt_collect": width-60, "perc_debt_med": 644, "med_debt_collect": 628, "med_debt_med":631, "perc_pop_nw":638, "perc_pop_no_ins": 642, "avg_income":615}

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

setScreenState (d3.select("#isMobile").style("display") == "block", d3.select("#isPhone").style("display") == "block", d3.select("#isPhoneSm").style("display") == "block" )

function setVariable(variable, phone) {
  if (phone == true) {
    SELECTED_VARIABLE_ph = variable;
    WHITE_ph = variable + "_wh"
    NONWHITE_ph= variable + "_nw"
  }else {
    SELECTED_VARIABLE = variable;
    WHITE = variable + "_wh"
    NONWHITE= variable + "_nw"
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
  
  var Startquery = location.split("?")
  var obj = {},
    qPos = location.indexOf("?"),
    tokens = location.substr(qPos + 1).split('&'),
    i = tokens.length - 1;
    if (qPos !== -1 || query.indexOf("=") !== -1) {
      for (; i >= 0; i--) {
        var s = tokens[i].split('=');
        obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null;
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

    queryString += "&county=" + county;
  } else {
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
    return (d<1) ? percent(Math.ceil(d * 100) / 100 ) : number( Math.ceil((d+1)/10)*10)
  }else if (type == "min") {
    return (d<1) ? percent(Math.floor(d * 100) / 100 ) : number( Math.floor((d+1)/10)*10)
  }else {
    return (d<1) ? percent(d) : number(d);
  }
}


// The following 4 function are for building the bars on desktop
function barY(d,dis,variable,NONWHITE,WHITE,y,barHeight) {
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("All") > -1) { 
    return (isNaN(d[variable]) != true) ? y(d[variable]) : barHeight;
  }else if (parentClass.search("Non") > -1) {
    return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) : barHeight;
  }else {
    return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) : barHeight;
  }
}

function barH(d,dis,variable,NONWHITE,WHITE,y,barHeight) {
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("All") > -1) { 
    return (isNaN(d[variable]) != true) ? barHeight - y(d[variable]) : 0;
  }else if (parentClass.search("Non") > -1){ 
    return (isNaN(d[NONWHITE]) != true) ? barHeight - y(d[NONWHITE]) : 0;
  }else {
    return (isNaN(d[WHITE]) != true) ? barHeight - y(d[WHITE]) : 0;
  }
}

function labelY(d,dis,variable,NONWHITE,WHITE,y,barHeight) {
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("All") > -1) {
    return (isNaN(d[variable]) != true) ? y(d[variable]) - 16 : barHeight -8;
  }else if (parentClass.search("Non") > -1) {
    return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) - 16 : barHeight - 8;
  }else{
    return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) - 16 : barHeight - 8;
  }
}

function labelHTML(d,dis,variable,NONWHITE,WHITE) {
  var noData = (d[variable] == "n<50") ? "n/a<tspan font-style='italic'  baseline-shift='super'>b</tspan>" : "n/a<tspan font-style='italic'  baseline-shift='super'>c</tspan>"
  var noData_wh = (d[WHITE] == "n<50") ? "n/a<tspan font-style='italic'  baseline-shift='super'>b</tspan>" : "n/a<tspan font-style='italic'  baseline-shift='super'>c</tspan>"
  var noData_nw = (d[NONWHITE] == "n<50") ? "n/a<tspan font-style='italic'  baseline-shift='super'>b</tspan>" : "n/a<tspan font-style='italic'  baseline-shift='super'>c</tspan>"
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("All") > -1) {
    return (isNaN(d[variable]) != true) ? formatNumber(d[variable]) : noData
  }else if (parentClass.search("Non") > -1) {
    return (isNaN(d[NONWHITE]) != true) ? formatNumber(d[NONWHITE]) : noData_nw
  }else{
    return (isNaN(d[WHITE]) != true) ? formatNumber(d[WHITE]) : noData_wh
  }
}

// The following 3 function are for building the bars on mobile and print
function barW(d,dis,variable,NONWHITE_ph,WHITE_ph,x_ph) {  
  var parentClass = d3.select(dis.parentNode).attr('class');
  if (parentClass.search("All") > -1) {
    return (isNaN(d[variable]) != true) ? x_ph(d[variable]) : 0
  }else if (parentClass.search("Non") > -1) {
    return (isNaN(d[NONWHITE_ph]) != true) ?  x_ph(d[NONWHITE_ph]) : 0
  }else{
    return (isNaN(d[WHITE_ph]) != true) ?  x_ph(d[WHITE_ph]) : 0
  }

}

function barX(d,dis,variable,NONWHITE_ph,WHITE_ph,x_ph) {
  var parentClass = $(dis).closest(".rect-g").attr("class")
  if (parentClass.search("All") > -1) {
    return (isNaN(d[variable]) != true) ? x_ph(d[variable]) + 5 : 0
  }else if (parentClass.search("Non") > -1) {
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
  if (parentClass.search("All") > -1) { 
    return (isNaN(d[variable]) != true) ? formatNumber(d[variable]) : noData
  }else if (parentClass.search("Non") > -1) {
    return (isNaN(d[NONWHITE_ph]) != true) ? formatNumber(d[NONWHITE_ph]) : noData_nw
  }else{
    return (isNaN(d[WHITE_ph]) != true) ? formatNumber(d[WHITE_ph]) : noData_wh
  }  
}

// this function hides white/non-white for the "percent non-white" question
function hideBars(variable) {
  if (variable == "perc_pop_nw") {
    d3.selectAll(".bar-group-ph").selectAll(".category-ph.White").attr("display", "none")
    d3.selectAll(".bar-group-ph").selectAll(".category-ph.Nonwhite").attr("display", "none")
    d3.selectAll(".bar_ph").select("svg").attr("height", 80)
    d3.selectAll(".label").select(".svg2").attr("height", 38)
  }else {
    var bar_phHeight = (IS_PHONESM == true) ? 200 : 173; 
    d3.selectAll(".bar-group-ph").selectAll(".category-ph.White").attr("display", "block")
    d3.selectAll(".bar-group-ph").selectAll(".category-ph.Nonwhite").attr("display", "block")
    d3.selectAll(".bar_ph").select("svg").attr("height", bar_phHeight)
    d3.selectAll(".label").select(".svg2").attr("height", 130)
  }
}



var setHeight = tdMap*.7;
var width =  tdMap,  //(IS_MOBILE && !IS_PHONE) ? tdMap : (tdMap) - margin.right-margin.left,
    height = (IS_PHONE) ? (width) - margin.top-margin.bottom :  setHeight,//(width*.57) - margin.top-margin.bottom,     
    centered,
    selectedState,
    selectedStatePh,
    selectedCountyPh
// d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
//   if (error) throw error;
d3.queue()
    .defer(d3.json, "data/us-10m.v1.json")
    .defer(d3.csv, "data/county_medical.csv")
    .defer(d3.csv, "data/state_medical.csv")
    .defer(d3.tsv, "data/county_student4.tsv")
    .defer(d3.csv, "data/state_student4.csv")    
    .await(ready); 

function transformData(geography){
  var geography_nested = d3.nest()
    .key(function(d) {return d.id })
    .entries(geography);
  return geography_nested
}


function OverallTransformData(us, county, state, countyData, stateData) { 

  var bigbig = {}

  //transforms the county and state non geographical data
  var county_data = transformData(county)

  var countyGeoMapped = d3.map(countyData, function(d) { return d.id; });

  county_data.forEach(function(d,i){ 
    for (var property in d["values"][0]) {
      d[property] = d.values[0][property];
      countyGeoMapped.get(d.key)[property] = d.values[0][property];
    }

  })

  var state_data = transformData(state)

    state_data.forEach(function(d,i){ 
      for (var property in d["values"][0]) {
        d[property] = d.values[0][property]
      }
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
  
  var us_data_ph = state_data.filter(function(d) {
    return isNaN(+d.key)
  })
  var filteredCounties = county_data.filter(function(d) {
    return d.state == "USA"
  })

  var tmp_county = topojson.feature(us, us.objects.counties).features;
  for (var i =0; i<tmp_county.length; i++){
    // var mergeID = +tmp_county[i]["id"]
    var mergeID2 = tmp_county[i]["id"]

    for (var property in countyGeoMapped.get(mergeID2)) { 
      var data = (isNaN(countyGeoMapped.get(mergeID2)[property]) == true) ? countyGeoMapped.get(mergeID2)[property] : +countyGeoMapped.get(mergeID2)[property];
      tmp_county[i]["properties"][property] = data;
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

  // grab the correct data and variables
  var state_data;
  var county_data;
  var printdata = []


  // get us data.
  var us_data = data.state_data[0]["values"][0]
  for (var key in us_data) {
      if (us_data.hasOwnProperty(key)) { 
          if (+us_data[key] == NaN || +us_data[key] == 0){
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
        return d.key == Startquery["state"]
      })      
      printdata.push(state_data[0])
    }
    if (Startquery["county"]) {
     county_data = data.county_data.filter(function(d) {
        return d.key == Startquery["county"] && d.state_id == Startquery["state"]
      })

     printdata.push(county_data[0])
    }
  }

  var groups = variableList[type]["groups"]
  var rowData =  variableList[type]["variables"]

  var printContainer = d3.select("#print-chart-container")
  
  // Set to national, try state, if state, try county. If good, county, if bad, state, if none, national.
  printNameFinal = "National"

  try {
    printNameFinal = printdata[1].state;
    try {
      printNameFinal = printdata[2].county + ", " + printdata[2].state;
    }
    catch(err) {
    }  
  }
  catch(err) {
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
        return groups[i]
      })
  printContainer.selectAll(".print-chart")
    .append("svg")
      .attr("class",function(d){
        return d + " print-row"
      })
      .attr("width", "100%")
      .attr("height", "100%")
      .each(function(d,i){                
        // Max of d,d_wh,d_nw
        var y = findPrintY(d,printdata)
        buildPrintBars(this,d,groups[i],printdata,y)
      })


  // Add in bottom logos
  var footerIcon = '<div class="print-footer-icon"><img src="img/print-footer.png"></div>';
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
  for (var i = 0; i < printdata.length; i++) {      
    var items = [+printdata[i][d],+printdata[i][d + "_wh"],+printdata[i][d + "_nw"]]
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
  var barSvgHeight = 110;
  var barWidth = 50;
  var width = 831;
  var itemwidth = (barWidth*3) + 20;
  var spacer = (width - (3*itemwidth))/2;
  
  if (printdata.length === 3) {
    var places =   ["National", "State", "County"]  
  } else if (printdata.length === 2) {
    var places =   ["National", "State"]
  } else {
    var places =   ["National"]
  }
  // populate the svg
  var WHITE = variable + "_wh"
  var NONWHITE = variable + "_nw"
  // var data = bigdata.county_data;
  var categories = [variable, WHITE, NONWHITE]
  var cat = ["All","White","Nonwhite"]

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
          return printdata[2]["county"]  
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
        return "translate(" + (60 * i ) + "," + 10 + ")";
        // "translate(" + ((barWidth + 2) * i ) + "," + 10 + ")" 
        // "translate(" + (60 * i ) + "," + 10 + ")"
      })

    var rectG = subBarG.append("g")
      .attr("class", function(d) { 
        return "rect-g2 " + d})
      .attr("transform", function(d,i) {
        return "translate(" + 0 +"," + 15+ ")"
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

        if (d === "perc_pop_nw_wh" || d === "perc_pop_nw_nw") {
          return ""
        } else {
          return cat[i]  
        }        
      });      

    var counter1 = 0;
    var counter2 = 0;
    var counter3 = 0;
    var counter4 = 0;

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
        // console.log(i)
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
      .html(function(d,i) {
        var raw = printdata[counter4][d];
        var result;
        if (isNaN(raw)) {
          if (raw == "n<50") {
            result = "n/a<tspan font-style='italic'  baseline-shift='super'>b</tspan>"
          } else if (raw == "N/A") {
            result = "n/a<tspan font-style='italic'  baseline-shift='super'>c</tspan>"
          } else {
            result = ""
          }          
        } else {
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
        // console.log(counter3)
        var result = isNaN(printdata[counter3][d]) ? 0 : y(printdata[counter3][d]) 
        if (i % 3 === 2) {
          counter3 +=1;
        }        
        // return (0 + (barHeight - result))
        return "translate(" + 0 + "," + (0 + (barHeight - result)) + ")";
      });

// selection here is messed up..........
// recreate selection so that you're selecting all nine bars maybe? per row? not sure. 


// var test = [0,1,2,3,4,5,6,7,8]
//     rectG.selectAll("rect")
//       .data([us_data])
//       // .data(test)
//       .enter()
//       .append("rect")
//       // .attr("x", function(d) { 
//       //   return d.abbr
//       // })
//       .attr("class", "bar")
//       .attr("fill", function(d,i) { 
//         // var parentClass = d3.select(this.parentNode).attr('class');
//         // if (parentClass.search("All") > -1) {
//         //   return "#fdbf11"
//         // }else if (parentClass.search("Non") > -1) {
//         //   return "#696969"
//         // }else{
//         //   return "#000000"
//         // }
//         // console.log(d)
//         return "Silver"
//       })
//       .attr("width", x.bandwidth())
//       .attr("y",100)
//       .attr("height",100)
//       .attr("width", x.bandwidth())
//       .attr("y", function(d) { 
//         return barY(d,this,SELECTED_VARIABLE,NONWHITE,WHITE,y,barHeight)
//       })
//       .attr("height", function(d) {
//         return barH(d,this,SELECTED_VARIABLE,NONWHITE,WHITE,y,barHeight)        
//       })

//   // build the svg

} 

function ready(error, us, county, state, county2, state2) {
  if (error) throw error;
  /*SETTING UP THE DATA*/

  // geographical data
  var countyData = us.objects.counties.geometries;
  var stateData = us.objects.states.geometries;
  
  if (window.location.search) {    
    // If there's a url search query, do a bunch of stuff like create the beginning zoom variables

    // DECODE the query
    // var Startquery = decodeQuery(window.location.search)  

    var defaultFirst;

    // set dataset (student vs. medical)
    type = Startquery["type"]
    if (type === "medical") {
      var BigData = OverallTransformData(us,county,state,countyData,stateData);
      defaultFirst = "perc_debt_collect"
    } else if (type === "student") {
      var BigData = OverallTransformData(us,county2,state2,countyData,stateData);
      defaultFirst = "perc_stud_debt"
    } else {
      // in future other data types
      var BigData = OverallTransformData(us,county2,state2,countyData,stateData);
    }

    // set variable
      // NEED conditional to ensure that the wrong variable is not present    
    if (!Startquery["variable"]) {
      typeVar = defaultFirst
      Startquery["variable"] = typeVar;
      updateQueryString(type,typeVar)
    } else {
      typeVar  = Startquery["variable"]
    }     

    // set left hand table variable names
      // this is done by setting "type" above. 

    // set drop down item
      // this is done below the set up of the drop down. look for refresh

    // set visual variable place
      // this is done below ADD TABLE in the 1300s of the code


    // select the state (optional)
    // select the county (optional)
      // DONE AT THE VERY BOTTOM OF THE ENTIRE READY/JS SCRIPT

    // need to do mobile!
    // a lot happens at the bottom

    // TRIGGER PRINT VIEW
    if (Startquery["print"] === "true") {      
      buildprint(Startquery,BigData)  
    }
    else{
      console.log("no PRINT")
    }
    
  }

  // If there is no query at the beginning
  else {
    // var Startquery = "national";
    type = "student"
    var BigData = OverallTransformData(us,county2,state2,countyData,stateData);    
    typeVar = "perc_stud_debt"

    // when we adjust this to a DIFFERENT student item, it changes the map AND legend, but not the spot on the left hand side in the table. (but uupper and lower end is a NaN?????)
  }
   
  // DWCut? or consolidate? 
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


  /*END*/

  // NOT SURE WHAT THIS IS DOING....maybe creating the search pool for the filtering county/state search??

  // Begin change jquery UI items in the DOM

  // DWCut? because we do it later on if print...could do no matter what?
  $("#location").html("National")

  $( "#searchBox" ).autocomplete({
    appendTo: ".search-div",
  });

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
        // if ($("ul.tagit li.tagit-choice-editable").width() < 70) { console.log('1')
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

        var geoData = BigData.tmp_county 
        var geoType = (tag.search(",") > 0) ? "county" : "state";
        var geography = (geoType == "county") ? county : state;
        selectedLocation()

        console.log('here')

        // DWCut? Dedupe? write a function somewhere?
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
          $("#location").html("National")
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
    .domain(BREAKS[SELECTED_VARIABLE])
    .range(["#cfe8f3", "#73bfe2", "#1696d2", "#0a4c6a", "#000000"])  

 /*ADD DROPDOWNS*/
  var categoryData = [{label: "Share with any debt in collections<i>ᵃ</i>", variable: "perc_debt_collect"},
  {label: "Median debt in collections<i>ᵃ</i>", variable: "med_debt_collect"},
  {label: "Share with medical debt in collections<i>ᵃ</i>", variable: "perc_debt_med"},
  {label: "Median medical debt in collections<i>ᵃ</i>", variable: "med_debt_med"},
  {label: "Nonwhite population share", variable: "perc_pop_nw"},
  {label: "Share without health insurance coverage", variable: "perc_pop_no_ins" },
  {label: "Average household income", variable: "avg_income"}]
  
  var categoryData2 = [{label: "Share with student loan debt<i>ᵃ</i>", variable: "perc_stud_debt"},
  {label: "Median student loan debt<i>ᵃ</i>", variable: "med_stud_debt"},
  {label: "Share of student loan holders with student loan debt in collections<i>ᵃ ᵈ</i>", variable: "perc_stud_debt_collect_STUD"},    
  {label: "Median student loan debt in collections<i>ᵃ</i>", variable: "med_stud_debt_collect"},
  {label: "Median monthly student loan payment<i>ᵃ</i>", variable: "med_mon_pmt"},
  {label: "Share of people with credit records who have student loan debt in collections<i>ᵃ ᵉ</i>", variable: "perc_stud_debt_collect"},
  {label: "Nonwhite population share", variable: "perc_pop_nw"},
  {label: "Share without a bachelor’s degree", variable: "perc_no_bach"},
  {label: "Average household income", variable: "avg_income" }]


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
    .data(function(d){
      if (!Startquery) {
        return categoryData2
      } else if (Startquery["type"] === "student") {
        return categoryData2
      } else {
        return categoryData
      }
    })
  optionsCategory.enter()
    .append('option')
    .html(function(d) {
      return d.label          
    })
    .attr('value', function(d) {
      return d.variable
    })



// BEGIN FUNCTIONS!

  // On click of print
    d3.selectAll(".print-button")
      .on("click", function(){

        if (!Startquery && window.location.search === "") {
          updateQueryString(type,SELECTED_VARIABLE)  
        }

        window.open(window.location.search + "&print=true") 
      })  

  // CHANGE DATA SET on dropdown at header
  $( "#dropdown-header" ).selectmenu({
      open: function( event, ui ) {

      },
      close: function(event, ui){

      },
      create: function(event, ui){
        // type = "student"

      },
      change: function(event, d){

        table.selectAll('tbody').classed('selected', false);        
        table.select('tbody').classed('selected', true)
        
        BigData = changeData(d.item.value);
        type = d.item.value;
   

        var type_category = (type == "medical") ? categoryData : categoryData2;
        // update mobile categories        

        var optionsCategory = d3.select("#category-select").selectAll('option')
          .data(type_category)

        optionsCategory.enter()
          .append('option')
          .merge(optionsCategory)
          .html(function(d) {            
            return d.label
          })
          .attr('value', function(d) {
            return d.variable
          })        
        
        optionsCategory.exit().remove()

        $('#category-select').val(type_category[0].variable);
        $("#category-select").selectmenu("refresh")


        // DW note: this will need to get updated when we move to more than TWO variable sets. 
        // to be used when ready
        var type_variable = (type == "medical") ? "perc_debt_collect" : "perc_stud_debt";
        setVariable(type_variable)
        setVariable(type_variable,true)
        updateMap(type_variable)                    

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
        } else if (zoomCounty == true) {          

          countyQuery = d3.select("g.counties").selectAll("path.selected").datum().id;
          stateQuery = d3.select("path#" + selectedState.properties.abbr).datum().id;
          updateTable(d3.select("g.counties").selectAll("path.selected").datum(),type)
        } else if (zoomState == true) {
          stateQuery = d3.select("path#" + selectedState.properties.abbr).datum().id;
          updateTable(d3.select("path#" + selectedState.properties.abbr).datum(),type);
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

        } 

        updateQueryString(type,type_variable,stateQuery,countyQuery)
      }
    
    

    });

  function changeData(CATEGORY) {
    
    // DWCut fix to allow for more than 2 things!
    var BigData = (CATEGORY === "medical") ? OverallTransformData(us,county,state,countyData,stateData) : OverallTransformData(us,county2,state2,countyData,stateData)
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
        .datum(tmp_county.filter(function(o){ return o.id == d.id})[0])
    })  

    var statesD3 = d3.selectAll(".state-borders")
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
        var dropdownTop = $(".banner").height() + 143
        $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("top", dropdownTop + "px")
        $("ul#state-select-menu").css("width", dropdownWidth + "px")
        $("ul#state-select-menu").css("margin-left", "-137px")
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
          return;
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
        var dropdownTop = $(".banner").height() + 202
        $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("top", dropdownTop + "px")
        $("ul#county-select-menu").css("width", dropdownWidth + "px")
        $("ul#county-select-menu").css("margin-left", "-137px")
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
        d3.select(".group-label-ph2.County").text(selectedPlace)
        d3.select(".group-label-ph.County").text(selectedPlace)

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
        var dropdownTop = $(".banner").height() + 263
        $(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").css("top", dropdownTop + "px")
        $("ul#category-select-menu").css("width", dropdownWidth + "px")
        $("ul#category-select-menu").css("margin-left", "-137px")
        d3.select(".category-menu").select(".ui-icon")
          .classed("arrow-up", true)
      },
      close: function(event, ui) {
        d3.select(".category-menu").select(".ui-icon")
          .classed("arrow-up", false)
      },
      change: function(event, ui) {
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
  
  // var projection = d3.geoAlbersUsa()
  var path = d3.geoPath()//.projection(projection)
  // var states = topojson.feature(us, us.objects.states);
  // projection.fitSize([width, height], states);
  var translateHeight = (IS_MOBILE) ? height*.05 : height*.05
  var mapScale = (IS_MOBILE) ? width/930 : width/1010
  var g = svg.append("g")
    .attr("class", "map-g")
    .attr("transform", "translate(" + (-10) + "," + (translateHeight) + ")scale(" +mapScale + ")")

  g.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(tmp_county)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function (d) { return d.properties.abbr + d.id; })
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
      var level = (zoomState == true && previousState == d["properties"]["abbr"]) ? "county": "state";
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
        countyQuery = (level == "state") ? null : d.properties.id
        
        addTag(state, county, abbr)
        zoomMap(width, d, level)          
        updateBars(SELECTED_VARIABLE, d)
      }
      updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)
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
        d3.selectAll(".state-borders > path").classed("hide", true)
        d3.select(".state-borders > path#" + abbr).classed("hide", false)
        d3.select("#location").html(county + ", " + abbr )
        d3.selectAll("path.selected").moveToFront()
        d3.selectAll(".hover")
          .classed("hover", false)
          .classed("hoverNational", false)
        setZoom(false, true, true)
        updateBars(SELECTED_VARIABLE, d3.select(".counties > path.selected").datum())
      }else if (d3.select(".state-borders > path.selected").node() != undefined) { //IF A STATE IS SELECTED
        var state = d3.select(".state-borders > path.selected").datum().properties.state
        var abbr = d3.select(".state-borders > path.selected").datum().properties.abbr
        d3.selectAll(".state-borders > path").classed("hide", true)
        d3.select(".state-borders > path#" + abbr).classed("hide", false)
        d3.select("#location").html(state)
        d3.selectAll("path.selected").moveToFront()
        d3.selectAll(".hover")
        .classed("hover", false)
        .classed("hoverNational", false)
        setZoom(false, true, false)
        updateBars(SELECTED_VARIABLE, d3.select(".state-borders > path.selected").datum())
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
    .on('click', function(d) {

      // stateClick 1 is here

      d3.selectAll(".selectedNational").classed("selectedNational", false)
      var state = d.properties.state;
      // var county = d.properties.county;
      var abbr = d.properties.abbr;
      var level = "state"
      setZoom(false, true, false)
      // $(".state-borders").css("pointer-events", "none")
      // $(".counties").css("pointer-events", "all")
      addTag(state, null, abbr)        
      zoomMap(width, d, level)        
      console.log(SELECTED_VARIABLE)
          console.log(d)
      updateBars(SELECTED_VARIABLE, d)

      var stateQuery = d.properties.id;
      var countyQuery;
      updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)

    })
    .on('mouseover', function(d) {         

      if (zoomNational == true || zoomNational_St == true) {                 
        hoverLocation("", d.properties.abbr, "state");
        updateBars(SELECTED_VARIABLE, d) 
      }else {
        // $(".state-borders").css("pointer-events", "none")
        // $(".counties").css("pointer-events", "all")

      }
    })
    .on('mouseleave', function(d) {         

      if (zoomNational==true || zoomNational_St == true) {
        if (d3.select(".state-borders > path.selected").node() != undefined && zoomNational_St != true) {
          var state = d3.select(".state-borders > path.selected").datum().properties.state
          d3.select("#location").html(state)
          d3.selectAll("path.selected").moveToFront()
        }else if (zoomNational_St == true){ 
          d3.selectAll(".hover")
            .classed("hover", false)
            .classed("hoverNational", false)
          d3.selectAll("path.selected").moveToFront()
          var selected = (d3.select(".counties > path.selected").size() > 0) ? d3.select(".counties > path.selected").datum() : d3.select(".state-borders > path.selected").datum()
          var geography = (d3.select(".counties > path.selected").size() > 0) ? selected.properties["county"] + ", " + selected.properties["abbr"] : selected.properties["state"];
          d3.select('#location').html(geography)
          updateBars(SELECTED_VARIABLE, selected)
        }else { 
          d3.select('#location').html("National")
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
          d3.select("#location").html(state)
          d3.selectAll("path.selected").moveToFront()
        }else if (zoomNational_St == true){ 
          d3.selectAll(".hover")
            .classed("hover", false)
            .classed("hoverNational", false)
          d3.selectAll("path.selected").moveToFront()
          var selected = (d3.select(".counties > path.selected").size() > 0) ? d3.select(".counties > path.selected").datum() : d3.select(".state-borders > path.selected").datum()
          var geography = (d3.select(".counties > path.selected").size() > 0) ? selected.properties["county"] + ", " + selected.properties["abbr"] : selected.properties["state"];
          d3.select('#location').html(geography)
          updateBars(SELECTED_VARIABLE, selected)
        }else { 
          d3.select('#location').html("National")
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
    // .attr('transform', function() {
    //   return (IS_MOBILE) ? 'translate(' + (width- 68) + ',' + 10 + ')' : 'translate(' + (width- 55) + ',' + 20 + ')';
    // })
  legendPh.append("text")
    .text("All:")
    .attr("class", "legend-title")
    .attr("x", 12)
    .attr("y", 17)
  // legendPh.append("text")
  var keyWidthPh =   keyWidthPhMaster/8;
  var keyHeightPh =  15;
  for (i=0; i<=6; i++){
    if(i  < 5){  
      legendPh.append("rect")
        .attr("width",keyWidthPh)
        .attr("height",keyHeightPh)
        .attr("class","rect"+i)
        .attr("x",keyWidthPh*i + 50)
        .attr("y", 5)
        .style("fill", COLORRANGE[i])
      legendPh.append("text")
        .attr("y", 34)
        .attr("class","legend-labels-ph legend-labels-ph" + i)
        .attr("x",keyWidthPh*i + 55)
        .attr("text-anchor", "middle")
        .text(function(){
          var min = d3.min(BigData.tmp_county, function(d) { 
            if (d.properties[SELECTED_VARIABLE] == "n<50") {
                return 1000000000000
              } else {
                return d.properties[SELECTED_VARIABLE]
              }
          })
          var array = BREAKS[SELECTED_VARIABLE]
          return (i==0) ? formatNumber(min, "min") : formatNumber((array[i-1]))
        })
     }
    if(i==6){  
      legendPh.append("rect")
        .attr("width",keyWidthPh)
        .attr("height",keyHeightPh)
        .attr("class","rect"+i)
        .attr("x",keyWidthPh*i + 17)
        .attr("y", 5)
        .style("fill","#ADABAC")
      legendPh.append("text")
        .attr("y", 34)
        .attr("class","legend-labels-ph legend-labels-ph" + i)
        .attr("x",keyWidthPh*i + 45)
        .attr("text-anchor", "middle")
        .text("n/a")

     }
     if (i == 5) { 
      legendPh.append("text")
        .attr("y", 34)
        .attr("class","legend-labels-ph legend-labels-ph" + i)
        .attr("text-anchor", "end")
        .attr("x",keyWidthPh*i + 55 )
        .attr("text-anchor", "middle")
        .text(function(){
          var max = d3.max(BigData.tmp_county, function(d) { 
              if (d.properties[SELECTED_VARIABLE] == "n<50") {
                return -100
              } else {
                return d.properties[SELECTED_VARIABLE]
              }
          })
          return formatNumber(max,"max")
        })
      }
    }
 
  /*DESKTOP*/
  svg.append("rect")
    .attr("width", function() {       
      return (IS_MOBILE) ? 73: 57
    })
    .attr("class", "rect-div")
    .attr("height", 215)
    .style("fill", "#f5f5f5")
    .style("opacity", 0.8)
    .attr('transform', 'translate(' + (width- 54) + ',' + (-1) + ')')
  var legend = svg
    .append("g")
    .attr("class", "g-legend")
    .attr('transform', 'translate(' + (width- 55) + ',' + 20 + ')')
  legend.append("text")
    .text("All")
    .attr("class", " ftitle")
    .attr("x", 33)
    .attr("text-anchor", "end")
  legend.append("text")
  var keyWidth =   10;
  var keyHeight =  25;
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
          // DWCut this area appears to run a "min" function EVERY time 
        var min = d3.min(BigData.tmp_county, function(d) { 
            if (d.properties[SELECTED_VARIABLE] == "n<50") {
                return 1000000000000
              } else {
                return d.properties[SELECTED_VARIABLE]
              }
          })
          var array = BREAKS[SELECTED_VARIABLE]
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
              if (d.properties[SELECTED_VARIABLE] == "n<50") {
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
    d3.select("#location").html(function() { 
      return (geography=="county") ?  filteredData[0]["properties"]["county"] + ", " + filteredData[0]["properties"]["abbr"] : filteredData[0]["properties"]["state"] 
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
    }
  }

      // .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      // .attr("id", "state-borders")
      // .attr("d", path)

  /*ADD TABLE*/

    $("#table-div").empty()
    var columns = ["All", "White", "NonWhite"]
    var rowNumbers = [1,2,3]
    
    if (type) {
      var groups = variableList[type]["groups"]
      var rowData =  variableList[type]["variables"]
    }


    var table = d3.select("#table-div")
      .append("table")
        tbody = table.selectAll('tbody')
          .data(rowData)
          .enter().append("tbody")
          .attr("class", function(d, i) {
            return type + " group group-" + i
          })
          .on('click', function(d) { 
            d3.selectAll('tbody')
              .classed('selected', false)
            d3.select(this)
              .classed('selected', true)           
            d3.select(".rect-div")
              .attr("width", function() {
                return (IS_MOBILE) ? 73: legendWidth[d]
              })
              .attr('transform', 'translate(' + (width - legendWidth[d]) + ',' + (-1) + ')')
            // }
            setVariable(d)
            updateMap(d)

            var stateQuery;
            var countyQuery;

            // Add in the querystring
            if (d3.select("g.counties").selectAll("path.selected")._groups["0"].length !== 0) {
              countyQuery = d3.select("g.counties").selectAll("path.selected").datum().id;  
            }

            
            if (d3.select("g.state-borders").selectAll("path.selected")._groups[0].length !== 0) {
              stateQuery = d3.select("path#" + selectedState.properties.abbr).datum().id;  
            }

            updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)
          })
    
    table.selectAll("tbody").filter(function(d) { return d === typeVar}).classed('selected', true)
    
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
          .html(function() { 
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
              return ((us_data[rowVariable]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable]);
            }else if (i==1){
              return ((us_data[rowVariable_wh]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable_wh]);
            }else if (i==2) {
              return ((us_data[rowVariable_nw]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable_nw]);
            }
          })
      })
 
  /*END TABLE*/
  /*BAR CHARTS*/

  var groups = ["National", "State", "County"]
  var groups_ph = ["County", "State", "National"]
  var categories = ["All", "White", "Nonwhite"]
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
    }else if (isNaN(d[NONWHITE_ph]) == true && isNaN(d[WHITE_ph]) == false) {
      return Math.max(+d[WHITE_ph], +d[SELECTED_VARIABLE_ph])
    }else if (isNaN(d[WHITE_ph]) == true && isNaN(d[NONWHITE_ph]) == false) {
      return Math.max(+d[NONWHITE_ph], +d[SELECTED_VARIABLE_ph])
    }else {
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
  for (i=0; i<=groups_ph.length - 1; i++){
    var group = groups_ph[i]
    var category = categories[i]
    d3.select(".label-" + group )
      .append("svg")
      .attr("width", 200)
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
      .attr("width", 82)
      .attr("height", 130)
      .attr("class", "svg2")

    // barLabel.append("text")
    //   .text(function(d,i) {
    //     return group;
    //   })
    //   .attr("transform", "translate(" + 74 + "," + 20 + ")")
    //   .attr("text-anchor", "end")
    //   .attr("class", function() {
    //     return "group-label-ph " + group
    //   })
    barLabel.selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .append("text")
      .text(function(d,i) {
        return categories[i]
      })
      .attr("class", "category-labels-ph")
      .attr("transform", function(d,i) {
        return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i + 57) + ")" : "translate(" + 74 + "," + (40*i + 25) + ")";
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
        return (IS_PHONESM) ? "translate(" + 0 + "," + (20) + ")" : "translate(" + 0 + "," + 0 + ")";
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
      .data(categories)
      .enter()
      .append("g")
      .attr("class", function(d,i) {
        return "category-ph " + categories[i]
      })
      .attr("transform", function(d,i) {
        return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i) + ")" : "translate(" + 0 + "," + (40*i) + ")";
      })

    d3.selectAll(".bar-County, .bar-State, .label-County, .label-State")
      .style("display", "none")

    var rectG_ph = subBarPh.append("g")
      .attr("class", function(d) { 
        return "rect-g " + d})
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
        if (SELECTED_VARIABLE_ph !== "perc_pop_nw") {
          if (parentClass.search("All") > -1) { 
            return formatNumber(d[SELECTED_VARIABLE_ph])
          }else if (parentClass.search("Non") > -1) {
            return formatNumber(d[NONWHITE_ph])
          }else{
            return formatNumber(d[WHITE_ph])
          }
        } else {
          if (parentClass.search("All") > -1) {
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
      .text(function(d,i) { return d});
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
        if (SELECTED_VARIABLE_ph !== "perc_pop_nw") {
          if (parentClass.search("All") > -1) {      
            return x_ph(+d[SELECTED_VARIABLE_ph])
          }else if (parentClass.search("Non") > -1) {
            return x_ph(+d[NONWHITE_ph])
          }else{
            return x_ph(+d[WHITE_ph])
          }          
        } else {
          if (parentClass.search("All") > -1) {
            return x_ph(+d[SELECTED_VARIABLE_ph])
          }
          else {
            return 0;
          }
          
        }

      })
      .attr("fill", function(d) { 
        var parentClass = d3.select(this.parentNode).attr('class');
        if (parentClass.search("All") > -1) {
          return "#fdbf11"
        }else if (parentClass.search("Non") > -1) {
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
      d.national = +d.values[0][SELECTED_VARIABLE]
    })
    county_data.forEach(function(d) { 
      d.white = +d.values[0][WHITE];
    })
    county_data.forEach(function(d) { 
      d.nonwhite = +d.values[0][NONWHITE]
    })
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
        return "translate(" + ( (width/3.1 + 5) * i) + "," + (20) + ")";
      })
      .attr("id", function(d) { 
        return d
      })
      .attr("class", "bar-group")
    barG.append("text")
      .text(function(d) {
        return (d=="National") ? d : "";
      })
      .attr("class", function(d) {
        return "group-label-2 " + d
      })
    barG.append("text")
      .attr("class", "group-label-2")
      // .attr("transform", function(d,i) {
      //   // var width = (d3.select(".group-label." + d).node().getBoundingClientRect().width) + 5
      //   return "translate(" + width + "," + 0 + ")"
      // })

    var subBarG = barG.selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .attr("class", function(d) {
        return "category " + d
      })
      .attr("transform", function(d,i) {
        return (IS_MOBILE) ? "translate(" + ((barWidth + 2) * i ) + "," + 10 + ")" : "translate(" + (60 * i ) + "," + 10 + ")"
      })
    
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
      .attr("y", barHeight + 10)
      .attr("dy", ".71em")
      .attr("text-anchor", "start")
      .text(function(d) { return d});
    rectG.append("g")
      .attr("class", "x axis")
      .attr("transform", function(d,i) {
        return "translate(" + 0 +"," + barHeight+ ")"
      })
      .call(xAxis)

    //add bars
    rectG.selectAll("rect")
      .data([us_data])
      .enter()
      .append("rect")
      .attr("x", function(d) { 
        return d.abbr
      })
      .attr("class", "bar")
      .attr("fill", function(d) { 
        var parentClass = d3.select(this.parentNode).attr('class');
        if (parentClass.search("All") > -1) {
          return "#fdbf11"
        }else if (parentClass.search("Non") > -1) {
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
          if (parentClass.search("All") > -1) {
            return formatNumber(d[SELECTED_VARIABLE])
          }else if (parentClass.search("Non") > -1) {
            return formatNumber(d[NONWHITE])
          }else{
            return formatNumber(d[WHITE])
          }
        })
      })

  hidelimited(SELECTED_VARIABLE)

  // Dan NOTE this hides state and county off the bat, but we will need to update this at some point. 
  d3.selectAll("#State, #County").style("opacity", 0)  

  function updateMap(variable) {
    

    var min = d3.min(BigData.tmp_county, function(d) {
      return d.properties[variable]
    })
    var max = d3.max(BigData.tmp_county, function(d) { 
      return d.properties[variable]
    })

    var quantize = d3.scaleThreshold()
      .domain(BREAKS[variable])
      .range(["#cfe8f3", "#73bfe2", "#1696d2", "#0a4c6a", "#000000"])        
    d3.selectAll(".legend-labels")
      .each(function(d,i) {
        if (i != 6) {
        d3.select(this)
          .text(function(){
            var min = d3.min(BigData.tmp_county, function(d) {
              if (d.properties[variable] == "n<50") {
                return 10000000
              } else {
                return d.properties[variable]  
              }
              return d.properties[variable]
            })
            var max = d3.max(BigData.tmp_county, function(d) {
              if (d.properties[variable] == "n<50") {
                return 0
              } else {
                return d.properties[variable]  
              }              
            })
            var array = BREAKS[variable]
            
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
            var min = d3.min(BigData.tmp_county, function(d) {
              if (d.properties[variable] == "n<50") {
                return 10000000
              } else {
                return d.properties[variable]  
              }
              return d.properties[variable]
            })
            var max = d3.max(BigData.tmp_county, function(d) {
              if (d.properties[variable] == "n<50") {
                return 0
              } else {
                return d.properties[variable]  
              }              
            })
            var array = BREAKS[variable]
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
    d3.select(".counties").selectAll("path")
    .transition()
    .duration(800)
    .style("fill", function(d){
        return (isNaN(d.properties[variable]) == true) ? "#adabac" : quantize(d.properties[variable]);
    })
    var selected = (d3.select("path.selected").node() != null) ? (d3.select("path.selected").datum()) : undefined
    updateBars(variable, selected)

  }


  function updateBars(variable, selected) { 

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
    // d3.selectAll(".note-header").html("<b>Note:</b>")

    var WHITE_ph = variable + "_wh"
    var NONWHITE_ph = variable + "_nw"
    var data = BigData.county_data;

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

        if (isNaN(d[NONWHITE_ph]) == true && isNaN(d[WHITE_ph]) == true){
          xxxx = d[variable]
        }else if (isNaN(d[NONWHITE_ph]) == true && isNaN(d[WHITE_ph]) == false) {
          xxxx = Math.max(d[WHITE_ph], d[variable])
        }else if (isNaN(d[WHITE_ph] == true && isNaN(d[NONWHITE_ph])) == false) {
          xxxx = Math.max(d[NONWHITE_ph], d[variable])
        }else {
          xxxx = Math.max(d[WHITE_ph], d[NONWHITE_ph], d[variable])
        }

        if (isNaN(xxxx) == true) {         
          xxxx = 0  
        }      

        return xxxx
      })])

      var National = d3.select(".bar-group-ph.National").selectAll(".category-ph")
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
        })

      var State = d3.select(".bar-group-ph.State").selectAll(".category-ph")
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
        })
      if (selectedCountyPh != "") {
        var County = d3.select(".bar-group-ph.County").selectAll(".category-ph")
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
          })
      }

    
     hideBars(variable)

    }else {
      /*DESKTOP*/
    var data =  BigData.county_data;

    // var data = (zoomCounty == true) ? county_data : state_data;
    var x = d3.scaleBand()
      .rangeRound([0, barWidth])
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
            .html(function(d) { 
              return labelHTML(d,this,variable,NONWHITE,WHITE)              
            })
        })
      if ( (zoomNational == true) && selected == null) {         
        d3.selectAll("#State, #County").style("opacity", 0)
      }else if (zoomNational_St && selected == null) {
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
              .html(function(d) { 
                return labelHTML(d,this,variable,NONWHITE,WHITE)              
              })
          })
            if (countyID.slice(0,2) == state || countyIDHov.slice(0,2) == state) { 
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
                .html(function(d) { 
                  return labelHTML(d,this,variable,NONWHITE,WHITE)              
                })
              })
          }else {
            d3.selectAll("#County").style("opacity", 0)
            d3.selectAll("#National, #State").style("opacity", 1)
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
        d3.select("#location").html("National")
        setZoom(true,false, false)
        zoomMap(width, null, "national")
        createSearchArray("")

        var stateQuery;
        var countyQuery;

        updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)
      })

    if (county != undefined) { 

      var newTag = $("ul.tagit").append('<li id="county" class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable"></li>')
      $('li#county').insertBefore(".tagit-new").append('<span class="tagit-label">' + county + '</span>')
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
        d3.select("#location").html( state )
        d3.selectAll(".counties > path.selected")
          .classed("selected", false)
        updateBars(SELECTED_VARIABLE, filteredData[0])    


        updateTable(stateData[0],type)
        var stateQuery = stateData[0].id;
        var countyQuery;
        updateQueryString(type,SELECTED_VARIABLE,stateQuery,countyQuery)

      })
      
      updateBars(SELECTED_VARIABLE, filteredData[0])
    }
  }
  
  function updateTable(data,type) {   

    var columns = ["All", "White", "NonWhite"]    
    var rowNumbers = [1,2,3]    

    if (type) {
      var groups = variableList[type]["groups"]
      var rowData =  variableList[type]["variables"]

      // based on type, define the groups and rowdata
      var tbody = table.selectAll('tbody')
          .data(rowData)

      tbody.classed("medical",false)
      tbody.classed("student",false)  
      tbody.classed(type,true)

        // tbody.attr("class", function(d, i) {
        //     return type + " group group-" + i
        //   })

        tbody.enter().append("tbody")
          .attr("class", function(d, i) {
            return type + " new group group-" + i
          })
          // .merge(tbody)
          .on('click', function(d) {             
            d3.selectAll('tbody')
              .classed('selected', false)
            d3.select(this)
              .classed('selected', true)           
            d3.select(".rect-div")
              .attr("width", function() {
                return (IS_MOBILE) ? 73: legendWidth[d]
              })
              .attr('transform', 'translate(' + (width - legendWidth[d]) + ',' + (-1) + ')')
            // }
            setVariable(d)
            updateMap(d)
          })
    
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
            // .text(function(d,i) {
            //   if (i==0) {
            //     return ((us_data[rowVariable]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable]);
            //   }else if (i==1){
            //     return ((us_data[rowVariable_wh]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable_wh]);
            //   }else if (i==2) {
            //     return ((us_data[rowVariable_nw]) == undefined) ? "N/A" : formatNumber(us_data[rowVariable_nw]);
            //   }
            // })
        })
 
      // Remove things (EXIT) and remove the "new" headlines

      // create a means. (ABOVE) for passing through new data to the tables. 
    }

    var data = (zoomNational == true) ? data : data["properties"];
    d3.selectAll("p.note1, p.note2").style("opacity", 1)
    d3.selectAll(".cell-data")
      .each(function(d,i) { 
        var rowVariable = [rowData[i]],
            rowVariable_nw = rowVariable + "_nw";
            rowVariable_wh = rowVariable + "_wh";
        if ((data[rowVariable]) == "n<50" || (data[rowVariable_nw]) == "n<50" || (data[rowVariable_wh]) == "n<50") { 
          d3.select("p.note1").style("opacity", 1)
        }
        if ((data[rowVariable]) == "N/A" || (data[rowVariable_nw]) == "N/A" || (data[rowVariable_wh]) == "N/A") {
          d3.select("p.note2").style("opacity", 1)
        }
        d3.select(this).selectAll("td")
          .html(function(d,i) { 
            if (i==0) { 
              if (isNaN(data[rowVariable]) == true) {
                return (data[rowVariable] == "n<50") ? "n/a<sup><i>b</i></sup>" : "n/a<sup><i>c</i></sup>"
              }else {
                return formatNumber(data[rowVariable]);
              }
            }else if (i==1){ 
              if (isNaN(data[rowVariable_wh]) == true) {
                return (data[rowVariable_wh] == "n<50") ? "n/a<sup><i>b</i></sup>" : "n/a<sup><i>c</i></sup>"
              }else {
                return formatNumber(data[rowVariable_wh]);
              }
            }else if (i==2) {
              if (isNaN(data[rowVariable_nw]) == true) {
                return (data[rowVariable_nw] == "n<50") ? "n/a<sup><i>b</i></sup>" : "n/a<sup><i>c</i></sup>"
              }else {
                return formatNumber(data[rowVariable_nw]);
              }
            }
          })
      })
  }



  function zoomMap(width, d,zoomLevel) { 
    var x, y, k;
    d3.select(".state-borders").selectAll("path")
      .classed("hide", false)
      .classed("selectedNational", false)

    if (zoomLevel != "national") { 
      $('.zoomBtn').css("display", "block")
      $('.tagit-new > input').attr('placeholder', '')
      d3.select(".state-borders").selectAll("path:not(#" + d.properties.abbr+ ")")
        .classed("hide", true)
      d3.selectAll("path.hoverNational").classed("hoverNational", false)
      $(".state-borders").css("pointer-events", "none")
      $(".counties").css("pointer-events", "all")
      d3.selectAll("path").classed("selected", false)
      d3.select("path#" + d["properties"]["abbr"])
        .classed("selected", true)
        .moveToFront()
      d3.select("#location").html(d["properties"]["state"] )
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
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];
      g.transition()
        .duration(750)
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

      if (zoomLevel == "county") {
          setZoom(false, true, true)
          d3.select("#location").html(d["properties"]["county"] + ", " + d["properties"]["abbr"] )
          d3.selectAll("g.counties > path").classed("selected", false)
          d3.select("path#" + d["properties"]["abbr"] + d.id)
            .classed("selected", true)
            .moveToFront()
          // updateTable(data)
      }
    }else { 
      if (IS_MOBILE == true) {
        d3.selectAll(".hover").classed("hover", false)
      }
      //ZOOM OUT TO NATIONAL VIEW
      if (zoomNational_St == true) {
        updateBars(SELECTED_VARIABLE, null)

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
          .classed("active", centered && function(d) {return d === centered; });
      var translateHeight = height*.05,
          mapScale = (IS_MOBILE) ? width/930 : width/1010;

      g.transition()
          .duration(750)
          .attr("transform", "translate(" + (-10) + "," + (translateHeight) + ")scale(" + mapScale + ")")
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
                return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i) + ")" : "translate(" + 0 + "," + (40*i) + ")";
              })
          })
        d3.selectAll("g.bar-group-ph")
          .each(function(d,i) {
            d3.select(this)
              .attr("transform", function() {
                return (IS_PHONESM) ? "translate(" + 0 + "," + (20) + ")" : "translate(" + 0 + "," + 0 + ")";
              })
          })

        d3.selectAll(".label").selectAll(".category-labels-ph")
          .each(function(d,i) {
            d3.select(this)
            .attr("transform", function() {
              return (IS_PHONESM) ? "translate(" + 0 + "," + (52*i + 57) + ")" : "translate(" + 74 + "," + (40*i + 25) + ")";

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
            if (parentClass.search("All") > -1) {            
              return (isNaN(d[SELECTED_VARIABLE_ph]) != true) ? x_ph(d[SELECTED_VARIABLE_ph]) : 0
            }else if (parentClass.search("Non") > -1) {
              return (isNaN(d[NONWHITE_ph]) != true) ?  x_ph(d[NONWHITE_ph]) : 0
            }else{
              return (isNaN(d[WHITE_ph]) != true) ?  x_ph(d[WHITE_ph]) : 0
            }
          })
        d3.selectAll(".data-label-ph")
          .attr("x", function(d) { 
            var parentClass = $(this).closest(".rect-g").attr("class")
            if (parentClass.search("All") > -1) {
              return (isNaN(d[SELECTED_VARIABLE_ph]) != true) ? x_ph(d[SELECTED_VARIABLE_ph]) + 5 : 0
            }else if (parentClass.search("Non") > -1) {
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
        d3.selectAll(".g-text > text")
        .attr("y", barHeight + 10)
        d3.selectAll(".x.axis")
        .attr("transform", function(d,i) {
          return "translate(" + 0 +"," + barHeight+ ")"
        })
        .call(xAxis)
        rectG.selectAll(".bar")
          .attr("width", x.bandwidth())
          .attr("y", function(d) { 
            var parentClass = d3.select(this.parentNode).attr('class');
            if (parentClass.search("All") > -1) { 
              return (isNaN(d[SELECTED_VARIABLE]) != true) ? y(d[SELECTED_VARIABLE]) : barHeight;
            }else if (parentClass.search("Non") > -1) { 
              return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) : barHeight;
            }else {
              return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) : barHeight;
            }
          })
          .attr("height", function(d) { 
            var parentClass = d3.select(this.parentNode).attr('class');
            if (parentClass.search("All") > -1) { 
              return (isNaN(d[SELECTED_VARIABLE]) != true) ? barHeight - y(d[SELECTED_VARIABLE]) : 0;
            }else if (parentClass.search("Non") > -1){ 
              return (isNaN(d[NONWHITE]) != true) ? barHeight - y(d[NONWHITE]) : 0;
            }else {
              return (isNaN(d[WHITE]) != true) ? barHeight - y(d[WHITE]) : 0;
            }
          })
        d3.selectAll(".bar-text")
          .attr("y", function(d) {
            var parentClass = d3.select(this.parentNode).attr('class');
            if (parentClass.search("All") > -1) {
              return (isNaN(d[SELECTED_VARIABLE]) != true) ? y(d[SELECTED_VARIABLE]) - 16 : barHeight -8;
            }else if (parentClass.search("Non") > -1) {
              return (isNaN(d[NONWHITE]) != true) ? y(d[NONWHITE]) - 16 : barHeight - 8;
            }else{
              return (isNaN(d[WHITE]) != true) ? y(d[WHITE]) - 16 : barHeight - 8;
            }
          })
        d3.selectAll(".data-label")
          .attr("y", function(d) {
            var parentClass = d3.select(this.parentNode).attr('class');
            if (parentClass.search("All") > -1) {
              return (isNaN(d[SELECTED_VARIABLE]) != true) ? y(d[SELECTED_VARIABLE]) - 16 : barHeight -8;
            }else if (parentClass.search("Non") > -1) {
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
        var translateHeight = (IS_MOBILE) ? height*.05 : height*.1,
            mapScale = (IS_MOBILE) ? width/930 : width/1010;
        svg.select(".map-g")
          .attr("transform", "translate(" + (-10) + "," + (translateHeight) + ")scale(" + mapScale + ")")

        //  .attr("transform", "scale(" + width/1060 + ")");
        d3.selectAll(".bar-group")
          .each(function(d,i) {
            d3.select(this)
              .attr("transform", function() { 
                return "translate(" + ( (width/3.1 + 5) * i) + "," + (20) + ")";
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
  $('#dropdown-header').val(type)
  $('#dropdown-header').selectmenu("refresh")

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

        // updateBars(typeVar, filteredData[0].properties.county)
        d3.select(".group-label-ph2.County").text(filteredData[0].properties.county)
        d3.select(".group-label-ph.County").text(filteredData[0].properties.county)      
        county = filteredData[0].properties.county;
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


    $('#category-select').val(Startquery["variable"]);
    $("#category-select").selectmenu("refresh")

  } else if (Startquery["print"] === "true") {
    d3.select("#location").html(printNameFinal)    
  }
};
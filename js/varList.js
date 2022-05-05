//* "variable" name of column in csv - these need to be the same for state and county csv
//* "breaks" someone went and got the Jenks breaks ahead of time
//* "legendWidth" eyeball it I guess and put it in here
//* "version" ? don't think this gets used. Maybe I'll make it 2 for fun!
//* "columns" these are how he labels his bar chart instead of using key value pairs with the data


var variableListMaster = {
	"medical":[
		{
			"variable":"medcoll",
			"desktopLabel":"Share with medical debt in collections",
			"mobileLabel":"Share with medical debt in collections",
			"breaks":[0.09, 0.16, 0.23, 0.31],
			"legendWidth": 58,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"medcollpos_p50",
			"desktopLabel":"Median medical debt in collections",
			"mobileLabel":"Median medical debt in collections",
			"breaks":[602, 850, 1119, 1458],
			"legendWidth": 70,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"nohealthinsurance",
			"desktopLabel":"Share without health insurance coverage",
			"mobileLabel":"Share without health insurance coverage",
			"breaks":[0.1, 0.15, 0.22, 0.33],
			"legendWidth": 60,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel":"Share of people of color",
			"breaks":[ 0.14, 0.29, 0.48, 0.68],
			"legendWidth": 63,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"household_income_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[58805, 72589, 91454, 120877],
			"legendWidth": 89,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		}
	],
	"student":[
		{
			"variable":"stdcollofstdtot",
			"desktopLabel":"Share of student loan holders with student loan debt in default",
			"mobileLabel": "Share of student loan holders with student loan debt in default",
			"breaks":[0.06, 0.12, 0.18, 0.31],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdcollpos_p50",
			"desktopLabel":"Median student loan debt in default",
			"mobileLabel": "Median student loan debt in default",
			"breaks":[9334, 11487, 13564, 16742],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdtot",
			"desktopLabel":"Share with student loan debt",
			"mobileLabel": "Share with student loan debt",
			"breaks":[0.09, 0.13, 0.16, 0.19],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdtotpos_p50",
			"desktopLabel":"Median student loan debt",
			"mobileLabel": "Median student loan debt",
			"breaks":[14721, 17774, 20668, 24385],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdmonthpos_p50",
			"desktopLabel":"Median monthly student loan payment",
			"mobileLabel": "Median monthly student loan payment",
			"breaks":[126, 147, 165, 187],
			"legendWidth":70,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"educ_ltBA",
			"desktopLabel":"Share without a bachelor’s degree",
			"mobileLabel": "Share without a bachelor’s degree",
			"breaks":[0.55, 0.67, 0.76, 0.83],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel": "Share of people of color",
			"breaks":[0.14, 0.29, 0.48, 0.68],
			"legendWidth":63,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"household_income_avg" ,
			"desktopLabel":"Average household income",
			"mobileLabel": "Average household income",
			"breaks":[58805, 72589, 91454, 120877],
			"legendWidth":89,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		}
	],
	"auto":[
		{
			"variable":"autoretdelrate",
			"desktopLabel":"Auto/retail loan delinquency rate",
			"mobileLabel":"Auto/retail loan delinquency rate",
			"breaks":[0.02, 0.04, 0.06, 0.10],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"delinquency_by_credit",
			"desktopLabel":"Auto/retail loan delinquency rate by credit score<sup><i>c</i></sup>",
			"mobileLabel":"Auto/retail loan delinquency rate by credit score<sup><i>c</i></sup>",
			"breaks":[0.13, 0.17, 0.21, 0.26],
			"legendWidth":65,
			"version":"v3",
			"columns":["Subprime","Near prime","Prime"], //guessing these use _wh and _nw in the data, and should just follow the sequence
			"nondebtfirst": ""
		},
		{
			"variable":"autoopen",
			"desktopLabel":"Share with auto loans",
			"mobileLabel":"Share with auto loans",
			"breaks":[0.23, 0.29, 0.33, 0.38],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"autoretopen",
			"desktopLabel":"Share with auto/retail loan debt",
			"mobileLabel":"Share with auto/retail loan debt",
			"breaks":[0.29, 0.35, 0.39, 0.44],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"poprural",
			"desktopLabel":"Share of people in rural areas",
			"mobileLabel":"Share of people in rural areas",
			"breaks":[0.21, 0.43, 0.64, 0.86],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel":"Share of people of color",
			"breaks":[0.14, 0.29, 0.48, 0.68],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"household_income_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[58805, 72589, 91454, 120877],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		}
	],
	"overall":[
		{
			"variable":"totcoll",
			"desktopLabel":"Share with any debt in collections",
			"mobileLabel":"Share with any debt in collections",
			"breaks":[0.2, 0.28, 0.36, 0.46],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"totcollpos_p50",
			"desktopLabel":"Median debt in collections",
			"mobileLabel":"Median debt in collections",
			"breaks":[1425, 1809, 2211, 2810],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"medcoll",
			"desktopLabel":"Share with medical debt in collections",
			"mobileLabel":"Share with medical debt in collections",
			"breaks":[0.09,0.16,0.23,0.31],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdcollofstdtot",
			"desktopLabel":"Share of student loan holders with student loan debt in default",
			"mobileLabel":"Share of student loan holders with student loan debt in default",
			"breaks":[0.06,0.12,0.18,0.31],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"autoretdelrate",
			"desktopLabel":"Auto/retail loan delinquency rate",
			"mobileLabel":"Auto/retail loan delinquency rate",
			"breaks":[0.02,0.04,0.06,0.1],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"carddelrate",
			"desktopLabel":"Credit card debt delinquency rate",
			"mobileLabel":"Credit card debt delinquency rate",
			"breaks":[0.02,0.03,0.05,0.08],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"carddelpos_p50",
			"desktopLabel":"Median credit card delinquent debt",
			"mobileLabel":"Median credit card delinquent debt",
			"breaks":[510, 647, 814, 1084],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel":"Share of people of color",
			"breaks":[0.14,0.29,0.48,0.68],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"household_income_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[58805, 72589, 91454, 120877],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		}
	],
	"meta":{
		"default":"overall",
		"dataSets":{
			"medical":{
				"county":"county1",
				"state":"state1",
				"caption": "Medical Debt",
				"publishDate": "",
				"specialNotes":[]
			},
			"student":{
				"county":"county2",
				"state":"state2",
				"caption": "Student Loan Debt",
				"publishDate": "",
				"specialNotes":[
					// "<p class='note3 temp'><sup><i>d</i></sup> This variable was added May 16, 2018.</p>",
					// "<p class='note4 temp'><sup><i>e</i></sup> This variable was relabeled May 16, 2018.</p>"
				]
			},
			"auto":{
				"county":"county3",
				"state":"state3",
				"caption": "Auto Loan Debt",
				"publishDate": "",
				"specialNotes":[
					"<p class='note3 temp'><sup><i>c</i></sup> The VantageScore credit score ranges from 300 to 850. Subprime scores range from 300 to 600, near-prime from 601 to 660, and prime from 661 to 850</p>"
				]
			},
			"overall":{
				"county":"county4",
				"caption": "Debt Delinquency",
				"state":"state4",
				"publishDate": "",
				"specialNotes":[]
			},
		}
	}
};

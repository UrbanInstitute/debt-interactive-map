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
			"breaks":[0.03, 0.06, 0.10, 0.15],
			"legendWidth": 58,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"medcollpos_p50",
			"desktopLabel":"Median medical debt in collections",
			"mobileLabel":"Median medical debt in collections",
			"breaks":[1281, 1586, 1985, 2735],
			"legendWidth": 70,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"nohealthinsurance",
			"desktopLabel":"Share without health insurance coverage",
			"mobileLabel":"Share without health insurance coverage",
			"breaks":[0.06, 0.10, 0.15, 0.22],
			"legendWidth": 60,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel":"Share of people of color",
			"breaks":[ 0.15, 0.31, 0.48, 0.68],
			"legendWidth": 63,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"household_income_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[69989, 86127, 107567, 142499],
			"legendWidth": 89,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		}
	],
	"student":[
		{
			"variable":"stdtot",
			"desktopLabel":"Share with student loan debt",
			"mobileLabel": "Share with student loan debt",
			"breaks":[0.09, 0.12, 0.15, 0.18],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdtotpos_p50",
			"desktopLabel":"Median student loan debt",
			"mobileLabel": "Median student loan debt",
			"breaks":[15288, 18326, 21149, 24667],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdcollofstdtot",
			"desktopLabel":"Share of student loan holders with student loan debt in default",
			"mobileLabel": "Share of student loan holders with student loan debt in default",
			"breaks":[0.006, 0.015, 0.026, 0.047],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdcollpos_p50",
			"desktopLabel":"Median student loan debt in default",
			"mobileLabel": "Median student loan debt in default",
			"breaks":[2566, 4026, 5924, 9120],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		
		{
			"variable":"stdmonthpos_p50",
			"desktopLabel":"Median monthly student loan payment",
			"mobileLabel": "Median monthly student loan payment",
			"breaks":[125, 146, 166, 189],
			"legendWidth":70,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"educ_ltBA",
			"desktopLabel":"Share without a bachelor’s degree",
			"mobileLabel": "Share without a bachelor’s degree",
			"breaks":[0.53, 0.66, 0.75, 0.82],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel": "Share of people of color",
			"breaks":[0.15, 0.31, 0.48, 0.68],
			"legendWidth":63,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"household_income_avg" ,
			"desktopLabel":"Average household income",
			"mobileLabel": "Average household income",
			"breaks":[69989, 86127, 107567, 142499],
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
			"breaks":[0.03, 0.05, 0.08, 0.11],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"delinquency_by_credit",
			"desktopLabel":"Auto/retail loan delinquency rate by credit score<sup><i>d</i></sup>",
			"mobileLabel":"Auto/retail loan delinquency rate by credit score<sup><i>d</i></sup>",
			"breaks":[0.19, 0.23, 0.28, 0.33],
			"legendWidth":90,
			"version":"v3",
			"columns":["Subprime","Near prime","Prime"], //guessing these use _wh and _nw in the data, and should just follow the sequence
			"nondebtfirst": ""
		},
		{
			"variable":"autoopen",
			"desktopLabel":"Share with auto loans",
			"mobileLabel":"Share with auto loans",
			"breaks":[0.22, 0.28, 0.32, 0.38],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"autoretopen",
			"desktopLabel":"Share with auto/retail loan debt",
			"mobileLabel":"Share with auto/retail loan debt",
			"breaks":[0.29, 0.35, 0.40, 0.44],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"poprural",
			"desktopLabel":"Share of people in rural areas",
			"mobileLabel":"Share of people in rural areas",
			"breaks":[0.20, 0.41, 0.61, 0.85],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel":"Share of people of color",
			"breaks":[0.15, 0.31, 0.48, 0.68],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"household_income_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[69989, 86127, 107567, 142499],
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
			"breaks":[0.15, 0.21, 0.28, 0.37],
			"legendWidth":60,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"totcollpos_p50",
			"desktopLabel":"Median debt in collections",
			"mobileLabel":"Median debt in collections",
			"breaks":[1658, 2036, 2442, 3177],
			"legendWidth":75,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"medcoll",
			"desktopLabel":"Share with medical debt in collections",
			"mobileLabel":"Share with medical debt in collections",
			"breaks":[0.03,0.06,0.10,0.15],
			"legendWidth":60,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdcollofstdtot",
			"desktopLabel":"Share of student loan holders with student loan debt in default",
			"mobileLabel":"Share of student loan holders with student loan debt in default",
			"breaks":[0.006,0.014,0.026,0.046],
			"legendWidth":60,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"autoretdelrate",
			"desktopLabel":"Auto/retail loan delinquency rate",
			"mobileLabel":"Auto/retail loan delinquency rate",
			"breaks":[0.03, 0.05 ,0.08, 0.11],
			"legendWidth":60,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"carddelrate",
			"desktopLabel":"Credit card debt delinquency rate",
			"mobileLabel":"Credit card debt delinquency rate",
			"breaks":[0.04,0.06,0.08,0.12],
			"legendWidth":60,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"carddelpos_p50",
			"desktopLabel":"Median credit card delinquent debt",
			"mobileLabel":"Median credit card delinquent debt",
			"breaks":[545, 653, 777, 1015],
			"legendWidth":70,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "end-debt-info"
		},
		{
			"variable":"poc",
			"desktopLabel":"Share of people of color",
			"mobileLabel":"Share of people of color",
			"breaks":[0.15,0.31,0.48,0.68],
			"legendWidth":60,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": "begin-non-debt-info"
		},
		{
			"variable":"household_income_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[69989, 86127, 107567, 142499],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		}
	],
	"youth":[
		{
			"variable":"totcoll",
			"desktopLabel":"Share of young adults with any debt in collections",
			"mobileLabel":"Share of young adults with any debt in collections",
			"breaks":[0.10, 0.13, 0.16, 0.20],
			"legendWidth":60,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"totcollpos_p50",
			"desktopLabel":"Median debt in collections for young adults",
			"mobileLabel": "Median debt in collections for young adults",
			"breaks":[1081, 1256, 1439, 1601],
			"legendWidth":75,
			"version":"v3",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"medcoll",
			"desktopLabel":"Share of young adults with medical debt in collections",
			"mobileLabel": "Share of young adults with medical debt in collections",
			"breaks":[0.01, 0.02, 0.04, 0.06],
			"legendWidth":60,
			"version":"v3",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"stdcollofstdtot",
			"desktopLabel":"Share of young adult student loan holders with student loan debt in default",
			"mobileLabel": "Share of young adult student loan holders with student loan debt in default",
			"breaks":[0.005, 0.009, 0.013, 0.022],
			"legendWidth":50,
			"version":"v3",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"autoretdelrate",
			"desktopLabel":"Auto/retail loan delinquency rate among young adults",
			"mobileLabel": "Auto/retail loan delinquency rate among young adults",
			"breaks":[0.05, 0.07, 0.08, 0.11],
			"legendWidth":60,
			"version":"v3",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"carddelrate",
			"desktopLabel":"Credit card debt delinquency rate among young adults",
			"mobileLabel": "Credit card debt delinquency rate among young adults",
			"breaks":[0.05, 0.06, 0.07, 0.09],
			"legendWidth":50,
			"version":"v3",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": ""
		},
		{
			"variable":"carddelpos_p50",
			"desktopLabel":"Median credit card delinquent debt among young adults",
			"mobileLabel": "Median credit card delinquent debt among young adults",
			"breaks":[336, 376, 419, 449],
			"legendWidth":65,
			"version":"v3",
			"columns":["All", "White communities", "Communities of color"],
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
				"caption-extra": "",
				"publishDate": "",
				"specialNotes":[
					"<p class='note4 temp'><sup><i>d</i></sup> Not available because American Community Survey geographic data for Connecticut do not align with credit bureau county boundaries.</p>"
				]
			},
			"student":{
				"county":"county2",
				"state":"state2",
				"caption": "Student Loan Debt",
				"caption-extra": "",
				"publishDate": "",
				"specialNotes":[
					// "<p class='note3 temp'><sup><i>d</i></sup> This variable was added May 16, 2018.</p>",
					// "<p class='note4 temp'><sup><i>e</i></sup> This variable was relabeled May 16, 2018.</p>"
					"<p class='note4 temp'><sup><i>d</i></sup> Not available because American Community Survey geographic data for Connecticut do not align with credit bureau county boundaries.</p>"
				]
			},
			"auto":{
				"county":"county3",
				"state":"state3",
				"caption": "Auto and Retail Loan Debt",
				"caption-extra": "",
				"publishDate": "",
				"specialNotes":[
					"<p class='note3 temp'><sup><i>c</i></sup> The VantageScore credit score ranges from 300 to 850. Subprime scores range from 300 to 600, near prime from 601 to 660, and prime from 661 to 850.</p>",
					"<p class='note4 temp'><sup><i>d</i></sup> Not available because American Community Survey geographic data for Connecticut do not align with credit bureau county boundaries.</p>"
				]
			},
			"overall":{
				"county":"county4",
				"caption": "Debt Delinquency",
				"caption-extra": "",
				"state":"state4",
				"publishDate": "",
				"specialNotes":[
					"<p class='note3 temp'><sup><i>c</i></sup> County-level data are not available for debt carried by young adults.</p>",
					"<p class='note4 temp'><sup><i>d</i></sup> Not available because American Community Survey geographic data for Connecticut do not align with credit bureau county boundaries.</p>"
				]
			},
			"youth":{
				"county":"",
				"caption": "Debt Delinquency",
				"caption-extra": "for Young Adults",
				"state":"state5",
				"publishDate": "",
				"specialNotes":[
					"<p class='note3 temp'><sup><i>c</i></sup> County-level data are not available for debt carried by young adults.</p>",
					"<p class='note4 temp'><sup><i>d</i></sup> Not available because American Community Survey geographic data for Connecticut do not align with credit bureau county boundaries.</p>"
				]
			},
		}
	}
};

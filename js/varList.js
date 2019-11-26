//* "variable" name of column in csv - these need to be the same for state and county csv
//* "breaks" someone went and got the Jenks breaks ahead of time
//* "legendWidth" eyeball it I guess and put it in here
//* "version" ? don't think this gets used. Maybe I'll make it 2 for fun!
//* "columns" these are how he labels his bar chart instead of using key value pairs with the data 
//* TODO - waiting for answer on jenks breaks. leaving old ones in
//* TODO - waiting for answer on notes. leaving old ones in


var variableListMaster = {
	"medical":[
		{
			"variable":"perc_debt_med",
			"desktopLabel":"Share with medical debt in collections",
			"mobileLabel":"Share with medical debt in collections",
			"breaks":[0.09,0.16,0.23,0.32],
			"legendWidth": 58,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"med_debt_med",
			"desktopLabel":"Median medical debt in collections",
			"mobileLabel":"Median medical debt in collections",
			"breaks":[540,778,1031,1376],
			"legendWidth": 70,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"perc_pop_no_ins",
			"desktopLabel":"Share without health insurance coverage",
			"mobileLabel":"Share without health insurance coverage",
			"breaks":[0.07,0.11,0.16,0.25],
			"legendWidth": 60,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": true
		},
		{
			"variable":"perc_pop_nw",
			"desktopLabel":"Nonwhite population share",
			"mobileLabel":"Nonwhite population share",
			"breaks":[0.13,0.28,0.47,0.68],
			"legendWidth": 63,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"avg_income",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[55898,68416,84677,111775],
			"legendWidth": 89,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		}		
	],
	"student":[
		{
			"variable":"perc_stud_debt_collect_STUD",
			"desktopLabel":"Share of student loan holders with student loan debt in default",
			"mobileLabel": "Share of student loan holders with student loan debt in default",
			"breaks":[0.07,0.14,0.21,0.34],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"med_stud_debt_collect",
			"desktopLabel":"Median student loan debt in default",
			"mobileLabel": "Median student loan debt in default",
			"breaks":[7327,9286,11271,13907],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"perc_stud_debt",
			"desktopLabel":"Share with student loan debt",
			"mobileLabel": "Share with student loan debt",
			"breaks":[0.09,0.12,0.15,0.19],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"med_stud_debt",
			"desktopLabel":"Median student loan debt",
			"mobileLabel": "Median student loan debt",
			"breaks":[13732,16512,19170,22399],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"med_mon_pmt",
			"desktopLabel":"Median monthly student loan payment",
			"mobileLabel": "Median monthly student loan payment",
			"breaks":[138,161,183,209],
			"legendWidth":70,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"perc_no_bach",
			"desktopLabel":"Share without a bachelor’s degree",
			"mobileLabel": "Share without a bachelor’s degree",
			"breaks":[0.58,0.70,0.78,0.84],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": true
		},
		{
			"variable":"perc_pop_nw",
			"desktopLabel":"Nonwhite population share",
			"mobileLabel": "Nonwhite population share",
			"breaks":[0.13,0.28,0.47,0.68],
			"legendWidth":63,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"avg_income" ,
			"desktopLabel":"Average household income",
			"mobileLabel": "Average household income",
			"breaks":[55899,68417,84678,111775],
			"legendWidth":89,
			"version":"v1",
			"columns":["All", "White communities", "Communities of color"],
			"nondebtfirst": false
		}
	],
	"auto":[
		{
			"variable":"autoretdelrate",
			"desktopLabel":"Auto/retail loan delinquency rate",
			"mobileLabel":"Auto/retail loan delinquency rate",
			"breaks":[0.01, 0.03, 0.05, 0.09],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"autoretdelrate_sub",
			"desktopLabel":"Auto/retail loan delinquency rate by credit score<sup><i>c</i></sup>",
			"mobileLabel":"Auto/retail loan delinquency rate by credit score<sup><i>c</i></sup>",
			"breaks":[0.10,0.16,0.21,0.29],
			"legendWidth":65,
			"version":"v3",
			"columns":["Subprime","Near prime","Prime"],
			"nondebtfirst": false
		},
		{
			"variable":"autoopen_pct",
			"desktopLabel":"Share with auto loans",
			"mobileLabel":"Share with auto loans",
			"breaks":[0.22,0.28,0.32,0.37],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"autoretopen_pct",
			"desktopLabel":"Share with auto or retail loans",
			"mobileLabel":"Share with auto or retail loans",
			"breaks":[0.30,0.35,0.39,0.44],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"poprural_pct",
			"desktopLabel":"Rural population share",
			"mobileLabel":"Rural population share",
			"breaks":[0.2,0.42,0.63,0.86],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": true
		},
		{
			"variable":"popnonwhite_pct",
			"desktopLabel":"Nonwhite population share",
			"mobileLabel":"Nonwhite population share",
			"breaks":[0.13,0.28,0.47,0.68],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"HHinc_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[55898,68416,84677,111775],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		}
	],
	"overall":[
		{
			"variable":"pct_debt_collections",
			"desktopLabel":"Share with any debt in collections",
			"mobileLabel":"Share with any debt in collections",
			"breaks":[0.20,0.29,0.37,0.47],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"median_debt_in_collections",
			"desktopLabel":"Median debt in collections",
			"mobileLabel":"Median debt in collections",
			"breaks":[1333,1716,2115,2754],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"pct_w_medical_debt_in_collections",
			"desktopLabel":"Share with medical debt in collections",
			"mobileLabel":"Share with medical debt in collections",
			"breaks":[0.09,0.16,0.23,0.32],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"pct_student_holders_in_default",
			"desktopLabel":"Share of student loan holders with student loan debt in default",
			"mobileLabel":"Share of student loan holders with student loan debt in default",
			"breaks":[0.07,0.14,0.21,0.34],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"auto_retail_loan_delinquency_rate",
			"desktopLabel":"Auto/retail loan delinquency rate",
			"mobileLabel":"Auto/retail loan delinquency rate",
			"breaks":[0.01,0.03,0.05,0.09],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"credit_card_debt_delinquency_rate",
			"desktopLabel":"Credit card debt delinquency rate",
			"mobileLabel":"Credit card debt delinquency rate",
			"breaks":[0.02,0.04,0.06,0.10],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"median_credit_card_delinquent_debt",
			"desktopLabel":"Median credit card delinquent debt",
			"mobileLabel":"Median credit card delinquent debt",
			"breaks":[560,710,881,1251],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		},
		{
			"variable":"pct_poc",
			"desktopLabel":"Nonwhite population share",
			"mobileLabel":"Nonwhite population share",
			"breaks":[0.13,0.28,0.47,0.68],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": true
		},
		{
			"variable":"avg_household_income",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[55898,68416,84677,111775],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White communities","Communities of color"],
			"nondebtfirst": false
		}
	],
	"meta":{
		"default":"auto",
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
					"<p class='note3 temp'><sup><i>c</i></sup> The VantageScore credit score ranges from 300 to 850. Subprime scores range from 300 to 600, near-prime from 601 to 660, and prime from 661to 850</p>"
				]
			},			
			"overall":{
				"county":"county4",
				"caption": "Overall Delinquent Debt",
				"state":"state4",
				"publishDate": "",
				"specialNotes":[]
			},
		}
	}
};
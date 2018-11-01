var variableListMaster = {
	"medical":[
		{
			"variable":"perc_debt_collect",
			"desktopLabel":"Share with any debt in collections<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel":"Share with any debt in collections<i>ᵃ</i>",
			"breaks":[0.22, .31, .39, .49],
			"legendWidth": 60,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"med_debt_collect",
			"desktopLabel":"Median debt in collections<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel":"Median debt in collections<i>ᵃ</i>",
			"breaks":[1200, 1500, 1800, 2300],
			"legendWidth": 73,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"perc_debt_med",
			"desktopLabel":"Share with medical debt in collections<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel":"Share with medical debt in collections<i>ᵃ</i>",
			"breaks":[.11,.18,.26,.34],
			"legendWidth": 58,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"med_debt_med",
			"desktopLabel":"Median medical debt in collections<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel":"Median medical debt in collections<i>ᵃ</i>",
			"breaks":[500,700,950,1250],
			"legendWidth": 70,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"perc_pop_nw",
			"desktopLabel":"Nonwhite population share",
			"mobileLabel":"Nonwhite population share",
			"breaks":[.13,.28,.46,.67],
			"legendWidth": 63,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"perc_pop_no_ins",
			"desktopLabel":"Share without health insurance coverage",
			"mobileLabel":"Share without health insurance coverage",
			"breaks":[.08,.13,.18,.26],
			"legendWidth": 60,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"avg_income",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[52650,63850,77900,101050],
			"legendWidth": 89,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		}		
	],
	"student":[
		{
			"variable":"perc_stud_debt",
			"desktopLabel":"Share with student loan debt<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel": "Share with student loan debt<i>ᵃ</i>",
			"breaks":[0.10,0.13,0.16,0.20],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"med_stud_debt",
			"desktopLabel":"Median student loan debt<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel": "Median student loan debt<i>ᵃ</i>",
			"breaks":[12550,15050,17450,20350],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"perc_stud_debt_collect_STUD",
			"desktopLabel":"Share of student loan holders with student loan debt in collections<span class=\"annotation\"><sup>a</sup> <sup>d</sup></span>",
			"mobileLabel": "Share of student loan holders with student loan debt in collections<i>ᵃ ᵈ</i>",
			"breaks":[0.07,0.13,0.2,0.3],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"med_stud_debt_collect",
			"desktopLabel":"Median student loan debt in collections<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel": "Median student loan debt in collections<i>ᵃ</i>",
			"breaks":[6150,7550,9000,10700],
			"legendWidth":89,
			"version":"v2",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"med_mon_pmt",
			"desktopLabel":"Median monthly student loan payment<span class=\"annotation\"><sup>a</sup></span>",
			"mobileLabel": "Median monthly student loan payment<i>ᵃ</i>",
			"breaks":[135,155,175,195],
			"legendWidth":70,
			"version":"v2",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"perc_stud_debt_collect",
			"desktopLabel":"Share of people with credit records who have student loan debt in collections<span class=\"annotation\"><sup>a</sup> <sup>e</sup></span>",
			"mobileLabel": "Share of people with credit records who have student loan debt in collections<i>ᵃ ᵉ</i>",
			"breaks":[0.01,0.02,0.03,0.06],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"perc_pop_nw",
			"desktopLabel":"Nonwhite population share",
			"mobileLabel": "Nonwhite population share",
			"breaks":[.13,.28,.46,.67],
			"legendWidth":63,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"perc_no_bach",
			"desktopLabel":"Share without a bachelor’s degree",
			"mobileLabel": "Share without a bachelor’s degree",
			"breaks":[0.59,0.71,0.79,0.85],
			"legendWidth":60,
			"version":"v2",
			"columns":["All", "White", "Nonwhite"]
		},
		{
			"variable":"avg_income" ,
			"desktopLabel":"Average household income",
			"mobileLabel": "Average household income",
			"breaks":[52650,63850,77900,101050],
			"legendWidth":89,
			"version":"v1",
			"columns":["All", "White", "Nonwhite"]
		}
	],
	"auto":[
		{
			"variable":"autoopen_pct",
			"desktopLabel":"Share with auto debt",
			"mobileLabel":"Share with auto debt",
			"breaks":[0.17,0.26,0.31,0.37],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"autoretopen_pct",
			"desktopLabel":"Share with auto or retail debt",
			"mobileLabel":"Share with auto or retail debt",
			"breaks":[0.23,0.31,0.36,0.42],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"autoretdelrate",
			"desktopLabel":"Auto/retail debt delinquency rate",
			"mobileLabel":"Auto/retail debt delinquency rate",
			"breaks":[0.02,0.05,0.08,0.13],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"autoretdelrate_sub",
			"desktopLabel":"Auto/retail debt delinquency rate by credit score",
			"mobileLabel":"Auto/retail debt delinquency rate by credit score",
			"breaks":[0.07,0.12,0.17,0.24],
			"legendWidth":65,
			"version":"v3",
			"columns":["Subprime","Near prime","Prime"]
		},
		{
			"variable":"popnonwhite_pct",
			"desktopLabel":"Nonwhite population share",
			"mobileLabel":"Nonwhite population share",
			"breaks":[0.13,0.28,0.46,0.67],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"poprural_pct",
			"desktopLabel":"Rural population share",
			"mobileLabel":"Rural population share",
			"breaks":[0.21,0.43,0.63,0.86],
			"legendWidth":65,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"HHinc_avg",
			"desktopLabel":"Average household income",
			"mobileLabel":"Average household income",
			"breaks":[54638,67154,84014,110245],
			"legendWidth":90,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		}
	],
	"meta":{
		"default":"auto",
		"dataSets":{
			"medical":{
				"county":"county1",
				"state":"state1",
				"publishDate": "December 6, 2017",
				"specialNotes":[]
			},
			"student":{
				"county":"county2",
				"state":"state2",
				"publishDate": "May 16, 2018",
				"specialNotes":[
					"<p class='note3 temp'><sup><i>d</i></sup> This variable was added May 16, 2018.</p>",
					"<p class='note4 temp'><sup><i>e</i></sup> This variable was relabeled on May 16, 2018.</p>"
				]
			},
			"auto":{
				"county":"county3",
				"state":"state3",
				"publishDate": "November XX, 2018",
				"specialNotes":[
					"<p class='note3 temp'><sup><i>d</i></sup> The VantageScore credit score ranges from 300 to 850. Subprime scores range from 300 to 600, near-prime from 601 to 660, and prime from 600 to 850.</p>"
				]
			}
		}
	}
};
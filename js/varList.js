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
			"desktopLabel":"autoopen_pct",
			"mobileLabel":"autoopen_pct",
			"breaks":[0,1,5,5000],
			"legendWidth":50,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"autoretopen_pct",
			"desktopLabel":"autoretopen_pct",
			"mobileLabel":"autoretopen_pct",
			"breaks":[0,1,5,5000],
			"legendWidth":50,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"autoretdelrate",
			"desktopLabel":"autoretdelrate",
			"mobileLabel":"autoretdelrate",
			"breaks":[0,1,5,5000],
			"legendWidth":50,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"autoretdelrate_sub",
			"desktopLabel":"autoretdelrate_sub",
			"mobileLabel":"autoretdelrate_sub",
			"breaks":[0,1,5,5000],
			"legendWidth":50,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"popnonwhite_pct",
			"desktopLabel":"popnonwhite_pct",
			"mobileLabel":"popnonwhite_pct",
			"breaks":[0,1,5,5000],
			"legendWidth":50,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"poprural_pct",
			"desktopLabel":"poprural_pct",
			"mobileLabel":"poprural_pct",
			"breaks":[0,1,5,5000],
			"legendWidth":50,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		},
		{
			"variable":"HHinc_avg",
			"desktopLabel":"HHinc_avg",
			"mobileLabel":"HHinc_avg",
			"breaks":[0,1,5,5000],
			"legendWidth":50,
			"version":"v3",
			"columns":["All","White","Nonwhite"]
		}
	],
	"meta":{
		"default":"auto",
		"dataSets":{
			"medical":{
				"county":"county1",
				"state":"state1"
			},
			"student":{
				"county":"county2",
				"state":"state2"
			},
			"auto":{
				"county":"county3",
				"state":"state3"
			}
		}
	}
};
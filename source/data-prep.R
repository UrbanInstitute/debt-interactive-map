# libraries required to prepare the data for publication
library(tidyverse)
library(readxl)
library(BAMMtools)
library(janitor)

#### functions ####

# cleanColnames() renames the column names from the researchers. There's usually a variable that reflects the average value for all the population for a given category -i.e., median student debt,- and another two for communities of color and white population. The latter can be identified because they include at the end _com_col or _nw, _white or _wnh (all of these might change with new updates, if researchers aren't consistent). This function unifies all to _com_col and _white.

# the only category that is not broken down by racial composition is autoretdelr, which includes delinquency by credit category: subprime, near prime, prime. cleanColnames() renames it as delinquency_by_credit. delinquency_by_credit refers to the subprime variable, delinquency_by_credit_near to near prime, and delinquency_by_credit_pr to prime. Because of how the javascript code is built, the name for the subrpime category can't be delinquency_by_credit_sub
cleanColNames <- function(df) {
  temp <- df %>%
    clean_names() %>% 
    rename_with(~str_replace(., '_pct_all', '')) %>%
    rename_with(~str_replace(., '_pct', '')) %>%
    rename_with(~str_replace(., '_all', '')) %>%

    rename_with(~str_replace(., 'auto_retail_loan_delinquency_rate_by_credit_score','delinquency_by_credit')) %>% 
    rename_with(~str_replace(., 'auto_retail_loan_delinquency_rate', 'autoretdelrate')) %>%
    rename_with(~str_replace(., 'auto_loans', 'autoopen')) %>%
    rename_with(~str_replace(., 'auto_retail_loan_debt', 'autoretopen')) %>%

    rename_with(~str_replace(., 'share_with_medical_debt_in_collections', 'medcoll')) %>%  
    rename_with(~str_replace(., 'median_medical_debt_in_collections', 'medcollpos_p50')) %>%
    rename_with(~str_replace(., 'share_without_health_insurance_coverage', 'nohealthinsurance')) %>%
      
    rename_with(~str_replace(., 'share_with_student_loan_debt', 'stdtot')) %>%
    rename_with(~str_replace(., 'median_student_loan_debt', 'stdtotpos_p50')) %>%
    rename_with(~str_replace(., 'student_loan_delinquency_rate_60+', 'stddelderogofstdtot')) %>%
    rename_with(~str_replace(., 'median_student_loan_deliquent_debt', 'stddelderogpos_p50')) %>%
    rename_with(~str_replace(., 'median_monthly_student_loan_payment', 'stdmonthpos_p50')) %>% 
    rename_with(~str_replace(., 'share_without_a_bachelors_degree', 'educ_ltBA')) %>%
    
    rename_with(~str_replace(., 'median_debt_in_collections', 'totcollpos_p50')) %>%
    rename_with(~str_replace(., 'any_debt_in_collections', 'totcoll')) %>%
    rename_with(~str_replace(., 'median_credit_card_delinquent_debt', 'carddelpos_p50')) %>%
    rename_with(~str_replace(., 'credit_card_debt_delinquency_rate', 'carddelrate')) %>%
    
    rename_with(~str_replace(., 'share_of_', '')) %>%
    rename_with(~str_replace(., 'share_with_', '')) %>%
    rename_with(~str_replace(., '_subprime', '')) %>%
    rename_with(~str_replace(., '_sub', '')) %>%
    rename_with(~str_replace(., '_near_prime', '_near')) %>%
    rename_with(~str_replace(., '_prime', '_pr')) %>%
    rename_with(~str_replace(., 'county_name', 'county')) %>%
    rename_with(~str_replace(., 'state_name', 'state')) %>%
    rename_with(~str_replace(., 'HHinc', 'household_income')) %>%
    rename_with(~str_replace(., 'nw', 'com_col')) %>%
    rename_with(~str_replace(., 'wnh', 'white')) %>% 
    rename_with(~str_replace(., 'comm_of_color', 'com_col')) %>% 
    rename_with(~str_replace(., 'white_comm', 'white')) %>% 
    
    rename_with(~str_replace(., 'average_household_income', 'household_income_avg')) %>%
    rename_with(~str_replace(., 'people_of_color', 'poc')) %>%
    rename_with(~str_replace(., 'people_in_rural_areas_white', 'poprural'))
      
}

# (For the county data) countyOrder() includes the states' name abbreviations, removes the state name from the county name and gives an id to the states, that it will be used later in the JS code.
countyOrder <- function(df) {
  temp <- df %>%
    mutate(
      county_name = gsub(",.*", "", county),
      id = county_fips,
      state_id = substr(county_fips, 1, 2)
    ) %>%
    select(-county) %>% 
    left_join(statesAbbr, by = c("state")) %>%
    select(county = county_name, id, county_fips, abbr, state, state_id, everything()) %>%
    select(-county_fips)
}

# (For the US data). natOrder() does some basic tweaks and reorders of columns.
natOrder <- function(df) {
  temp <- df %>%
    mutate(
      state = 'USA',
      abbr = NA
    ) %>%
    rename_with(~str_replace(., 'usa', 'id')) %>%
    select(id, state, abbr, everything())
}

getBreaks <- function(df) {
  print(getJenksBreaks(as.numeric(x), 6))
}

# CSV file including state abbreviations that will be used with the county data
statesAbbr <- read_csv("data-in/states_abbr_names.csv")

# cleaning starts here

#### auto ####

# auto county data
autoCounty <- read_xlsx("data-in/oct2026/dia_lbls_all_autoretail_county_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  # mutate(
  #   state_name = case_when(
  #     state_name == "District Of Columbia" ~ "District of Columbia",
  #     TRUE ~ state_name
  #   )
  # ) %>%
  cleanColNames() %>% 
  countyOrder()

# auto state + national
autoNational <- read_xlsx("data-in/oct2026/dia_lbls_all_autoretail_usa_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  natOrder()

autoState <- read_xlsx("data-in/oct2026/dia_lbls_all_autoretail_state_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'state_fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abbreviation', 'abbr'))

autoNationalState <- autoNational %>%
  rbind(autoState)

write.csv(autoCounty, "data-out/oct_2026_out/county_auto.csv", row.names = FALSE)
write.csv(autoNationalState, "data-out/oct_2026_out/state_national_auto.csv", row.names = FALSE)

#### medical ####

#county
medCounty <- read_xlsx("data-in/oct2026/dia_lbls_all_medical_county_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  # mutate(
  #   state_name = case_when(
  #     state_name == "District Of Columbia" ~ "District of Columbia",
  #     TRUE ~ state_name
  #   )
  # ) %>%
  cleanColNames() %>% 
  countyOrder()

# medical state + national
medNational <- read_xlsx("data-in/oct2026/dia_lbls_all_medical_usa_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  # mutate(
  #   state = 'USA',
  #   abbr = NA
  # ) %>%
  cleanColNames() %>%
  natOrder()

medState <- read_xlsx("data-in/oct2026/dia_lbls_all_medical_state_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'state_fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abbreviation', 'abbr'))

# namesCounty <- names(medCounty)
# namesState <- names(medState)
# namesNat <- names(medNational)

medNationalState <- medNational %>%
  rbind(medState)

write.csv(medCounty, "data-out/oct_2026_out/county_medical.csv", row.names = FALSE)
write.csv(medNationalState, "data-out/oct_2026_out/state_national_medical.csv", row.names = FALSE)


#### delinquency ####

# overall county
overallCounty <- read_xlsx("data-in/oct2026/dia_lbls_all_overall_county_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  # mutate(
  #   state_name = case_when(
  #     state_name == "District Of Columbia" ~ "District of Columbia",
  #     TRUE ~ state_name
  #   )
  # ) %>%
  cleanColNames() %>% 
  countyOrder()


# overall state + national
overallNational <- read_xlsx("data-in/oct2026/dia_lbls_all_overall_usa_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  natOrder()

overallState <- read_xlsx("data-in/oct2026/dia_lbls_all_overall_state_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'state_fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abbreviation', 'abbr'))

overallNationalState <- overallNational %>%
  rbind(overallState)

write.csv(overallCounty, "data-out/oct_2026_out/county_overall.csv", row.names = FALSE)
write.csv(overallNationalState, "data-out/oct_2026_out/state_national_overall.csv", row.names = FALSE)


#### student ####

# county
studentCounty <- read_xlsx("data-in/oct2026/dia_lbls_all_student_county_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  # mutate(
  #   state_name = case_when(
  #     state_name == "District Of Columbia" ~ "District of Columbia",
  #     TRUE ~ state_name
  #   )
  # ) %>%
  cleanColNames() %>% 
  countyOrder()


# students state + national
studentNational <- read_xlsx("data-in/oct2026/dia_lbls_all_student_usa_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  natOrder()

studentState <- read_xlsx("data-in/oct2026/dia_lbls_all_student_state_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'state_fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abbreviation', 'abbr'))

studentNationalState <- studentNational %>%
  rbind(studentState)

write.csv(studentCounty, "data-out/oct_2026_out/county_student.csv", row.names = FALSE)
write.csv(studentNationalState, "data-out/oct_2026_out/state_national_student.csv", row.names = FALSE)


#### youth ####

# state + national only
youthNational <- read_xlsx("data-in/oct2026/dia_lbls_young_overall_usa_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  natOrder()

youthState <- read_xlsx("data-in/oct2026/dia_lbls_young_overall_state_2026_7Oct2026.xlsx", col_types=c("fips"="text")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'state_fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abbreviation', 'abbr'))

youthNationalState <- youthNational %>%
  rbind(youthState)

write.csv(youthNationalState, "data-out/oct_2026_out/state_national_youth.csv", row.names = FALSE)



#### breaks ####

selectNames <- function(df) {
  temp <- df %>%
    select(-c(1:5)) %>%
    names()
  temp <- temp[!grepl("com_col|white|near|_pr", temp)]
  
  return(temp)
}

medicalNames <- selectNames(medCounty)
studentNames <- selectNames(studentCounty)
autoNames <- selectNames(autoCounty)
overallNames <- selectNames(overallCounty)
youthNames <- selectNames(youthNationalState)

youthTotColl <- c("totcoll")

lapply(medCounty[medicalNames], function(x) {
  print(getJenksBreaks(as.numeric(x), 6))
})

lapply(studentCounty[studentNames], function(x) {
  print(getJenksBreaks(as.numeric(x), 6))
})

lapply(autoCounty[autoNames], function(x) {
  print(getJenksBreaks(as.numeric(x), 6))
})

lapply(overallCounty[overallNames], function(x) {
  print(getJenksBreaks(as.numeric(x), 6))
})

lapply(youthNationalState[youthTotColl], function(x) {
  print(getJenksBreaks(as.numeric(x), 6))
})

lapply(youthNationalState[youthNames], function(x) {
	print(getJenksBreaks(as.numeric(x), 6))
})



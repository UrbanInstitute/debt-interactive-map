# libraries required to prepare the data for publication
library(tidyverse)
library(readxl)
library(BAMMtools)

#### functions ####

# cleanColnames() renames the column names from the researchers. There's usually a variable that reflects the average value for all the population for a given category -i.e., median student debt,- and another two for communities of color and white population. The latter can be idenfied because they include at the end _com_col or _nw, _white or _wnh (all of these might change with new updates, if researchers aren't consistent). This function unifies all to _com_col and _white.

# the only category that is not broken down by racial composition is autoretdelr, which includes delinquency by credit category: subprime, near prime, prime. cleanColnames() renames it as delinquency_by_credit. delinquency_by_credit refers to the subprime variable, delinquency_by_credit_near to near prime, and delinquency_by_pr to prime. Because of how the javascript code is built, the name for the subrpime category can't be delinquency_by_credit_sub
cleanColNames <- function(df) {
  temp <- df %>%
    rename_with(~str_replace(., '_pct_all', '')) %>%
    rename_with(~str_replace(., '_pct', '')) %>%
    rename_with(~str_replace(., '_all', '')) %>%
    rename_with(~str_replace(., 'autoretdelr_', 'delinquency_by_credit_')) %>%
    rename_with(~str_replace(., '_sub', '')) %>%
    rename_with(~str_replace(., 'county_name', 'county')) %>%
    rename_with(~str_replace(., 'state_name', 'state')) %>%
    rename_with(~str_replace(., 'county_name', 'county')) %>%
    rename_with(~str_replace(., 'HHinc', 'household_income')) %>%
    rename_with(~str_replace(., 'nw', 'com_col')) %>%
    rename_with(~str_replace(., 'wnh', 'white'))
}

# (For the county data) countyOrder() includes the states' name abbreviations, removes the state name from the county name and gives an id to the states, that it will be used later in the JS code.
countyOrder <- function(df) {
  temp <- df %>%
    mutate(
      county_name = gsub(",.*", "", county_name),
      id = fips,
      state_id = substr(fips, 1, 2)
    ) %>%
    left_join(statesAbbr, by = c("state_name" = "state")) %>%
    select(county_name, id, fips, abbr, state_name, state_id, everything()) %>%
    select(-fips)
}

# (For the US data). natOrder() does some basic tweaks and reorders of columns.
natOrder <- function(df) {
  temp <- df %>%
    mutate(
      state = 'USA',
      abbr = NA
    ) %>%
    rename_with(~str_replace(., 'fips', 'id')) %>%
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
autoCounty <- read.csv("data-in/july2024/dia_vars_all_autoretail_county_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  mutate(
    state_name = case_when(
      state_name == "District Of Columbia" ~ "District of Columbia",
      TRUE ~ state_name
    )
  ) %>%
  countyOrder() %>%
  cleanColNames()

# auto state + national
autoNational <- read.csv("data-in/july2024/dia_vars_all_autoretail_usa_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  natOrder()

autoState <- read.csv("data-in/july2024/dia_vars_all_autoretail_state_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abb', 'abbr'))

autoNationalState <- autoNational %>%
  rbind(autoState)

write.csv(autoCounty, "data-out/county_auto.csv", row.names = FALSE)
write.csv(autoNationalState, "data-out/state_national_auto.csv", row.names = FALSE)

#### medical ####

#county
medCounty <- read.csv("data-in/july2024/dia_vars_all_medical_county_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  mutate(
    state_name = case_when(
      state_name == "District Of Columbia" ~ "District of Columbia",
      TRUE ~ state_name
    )
  ) %>%
  countyOrder() %>%
  cleanColNames()

# countyOrder() %>%
# cleanColNames()

# medical state + national
medNational <- read.csv("data-in/july2024/dia_vars_all_medical_usa_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  # mutate(
  #   state = 'USA',
  #   abbr = NA
  # ) %>%
  # rename_with(~str_replace(., 'NAME', 'county')) %>%
  # rename_with(~str_replace(., 'GEOID', 'id')) %>%
  # rename_with(~str_replace(., 'state_name', 'state')) %>%
  # rename_with(~str_replace(., 'Share with Medical Debt in Collections, Communities of Color', 'medcoll_com_col')) %>%
  # rename_with(~str_replace(., 'Share with Medical Debt in Collections, Majority White Communities', 'medcoll_white')) %>%
  # rename_with(~str_replace(., 'Share with Medical Debt in Collections', 'medcoll')) %>%
  # rename_with(~str_replace(., fixed('% population without health insurance, 2019 (ACS)'), 'nohealthinsurance')) %>%
  # rename_with(~str_replace(., fixed('% white, non-Hispanic population without health insurance, 2019 (ACS)'), 'nohealthinsurance_white')) %>%
  # rename_with(~str_replace(., fixed('% non-white population without health insurance, 2019 (ACS)'), 'nohealthinsurance_com_col')) %>%
  # rename_with(~str_replace(., 'Median Medical Debt in Collections, All', 'medcollpos_p50')) %>%
  # rename_with(~str_replace(., 'Median Medical Debt in Collections, Communities of Color', 'medcollpos_p50_com_col')) %>%
  # rename_with(~str_replace(., 'Median Medical Debt in Collections, Majority White Communities', 'medcollpos_p50_white')) %>%
  # rename_with(~str_replace(., 'poc_pct', 'poc')) %>%
  # rename_with(~str_replace(., fixed('Average household income, 2019 (ACS)'), 'household_income_avg')) %>%
  # rename_with(~str_replace(., fixed('Average non-white household income, 2019 (ACS)'), 'household_income_avg_com_col')) %>%
  # rename_with(~str_replace(., fixed('Average white, non-Hispanic household income, 2019 (ACS)'), 'household_income_avg_white')) %>%
  # select(id, state, abbr, everything())
  cleanColNames() %>%
  natOrder()

medState <- read.csv("data-in/july2024/dia_vars_all_medical_state_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  # rename_with(~str_replace(., 'state', 'abbr')) %>%
  # rename_with(~str_replace(., 'NAME', 'county')) %>%
  # rename_with(~str_replace(., 'GEOID', 'id')) %>%
  # rename_with(~str_replace(., 'abbr_name', 'state')) %>%
  # rename_with(~str_replace(., 'Share with Medical Debt in Collections, Communities of Color', 'medcoll_com_col')) %>%
  # rename_with(~str_replace(., 'Share with Medical Debt in Collections, Majority White Communities', 'medcoll_white')) %>%
  # rename_with(~str_replace(., 'Share with Medical Debt in Collections', 'medcoll')) %>%
  # rename_with(~str_replace(., fixed('% population without health insurance, 2019 (ACS)'), 'nohealthinsurance')) %>%
  # rename_with(~str_replace(., fixed('% white, non-Hispanic population without health insurance, 2019 (ACS)'), 'nohealthinsurance_white')) %>%
  # rename_with(~str_replace(., fixed('% non-white population without health insurance, 2019 (ACS)'), 'nohealthinsurance_com_col')) %>%
  # rename_with(~str_replace(., 'Median Medical Debt in Collections, All', 'medcollpos_p50')) %>%
  # rename_with(~str_replace(., 'Median Medical Debt in Collections, Communities of Color', 'medcollpos_p50_com_col')) %>%
  # rename_with(~str_replace(., 'Median Medical Debt in Collections, Majority White Communities', 'medcollpos_p50_white')) %>%
  # rename_with(~str_replace(., 'poc_pct', 'poc')) %>%
  # rename_with(~str_replace(., fixed('Average household income, 2019 (ACS)'), 'household_income_avg')) %>%
  # rename_with(~str_replace(., fixed('Average non-white household income, 2019 (ACS)'), 'household_income_avg_com_col')) %>%
  # rename_with(~str_replace(., fixed('Average white, non-Hispanic household income, 2019 (ACS)'), 'household_income_avg_white')) %>%
  # rename_with(~str_replace(., 'fips', 'id'))
  cleanColNames() %>%
  rename_with(~str_replace(., 'fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abb', 'abbr'))

# namesCounty <- names(medCounty)
# namesState <- names(medState)
# namesNat <- names(medNational)

medNationalState <- medNational %>%
  rbind(medState)

write.csv(medCounty, "data-out/county_medical.csv", row.names = FALSE)
write.csv(medNationalState, "data-out/state_national_medical.csv", row.names = FALSE)


#### delinquency ####

# overall county
overallCounty <- read.csv("data-in/july2024/dia_vars_all_overall_county_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  mutate(
    state_name = case_when(
      state_name == "District Of Columbia" ~ "District of Columbia",
      TRUE ~ state_name
    )
  ) %>%
  countyOrder() %>%
  cleanColNames()

# overall state + national
overallNational <- read.csv("data-in/july2024/dia_vars_all_overall_usa_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  natOrder()

overallState <- read.csv("data-in/july2024/dia_vars_all_overall_state_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abb', 'abbr'))

overallNationalState <- overallNational %>%
  rbind(overallState)

write.csv(overallCounty, "data-out/county_overall.csv", row.names = FALSE)
write.csv(overallNationalState, "data-out/state_national_overall.csv", row.names = FALSE)


#### student ####

# county
studentCounty <- read.csv("data-in/july2024/dia_vars_all_student_county_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  mutate(
    state_name = case_when(
      state_name == "District Of Columbia" ~ "District of Columbia",
      TRUE ~ state_name
    )
  ) %>%
  countyOrder() %>%
  cleanColNames()

# students state + national
studentNational <- read.csv("data-in/july2024/dia_vars_all_student_usa_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  natOrder()

studentState <- read.csv("data-in/july2024/dia_vars_all_student_state_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abb', 'abbr'))

studentNationalState <- studentNational %>%
  rbind(studentState)

write.csv(studentCounty, "data-out/county_student.csv", row.names = FALSE)
write.csv(studentNationalState, "data-out/state_national_student.csv", row.names = FALSE)


#### youth ####

# state + national only
youthNational <- read.csv("data-in/july2024/dia_vars_young_overall_usa_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  natOrder()

youthState <- read.csv("data-in/july2024/dia_vars_young_overall_state_2023_1Jul2024.csv", colClasses=c("fips"="character")) %>%
  cleanColNames() %>%
  rename_with(~str_replace(., 'fips', 'id')) %>%
  rename_with(~str_replace(., 'state_abb', 'abbr'))

youthNationalState <- youthNational %>%
  rbind(youthState)

write.csv(youthNationalState, "data-out/state_national_youth.csv", row.names = FALSE)



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

lapply(youthNationalState[youthNames], function(x) {
  print(getJenksBreaks(as.numeric(x), 6))
})

lapply(youthNationalState[youthTotColl], function(x) {
  print(getJenksBreaks(as.numeric(x), 6))
})



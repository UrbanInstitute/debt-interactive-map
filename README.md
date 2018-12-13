README.md

Two bugs to beware of...

- Make sure all state fips codes and state names/abbrev. match. Previously these have been mismatched (at the border of states, due to being off one row in copy/pasting) 

| County | State | Incorrect State Code |
| ---- | ---- | ---- |
| Beaver County | Utah | TX |
| Addison County | Vermont | UT |
| Accomack County | Virginia | VT |
| Adams County | Washington | VA |
| Barbour County | West Virginia | WA |
| Adams County | Wisconsin | WV |
| Albany County | Wyoming | WI |

- In the data, make sure all county fips codes have a leading 0 if state fips is < 10. (i.e. early states in the alphabet.) 

- Make sure all links have been changed from staging to prod. 
# siasky-tools

[![Add to Homescreen](https://img.shields.io/badge/Skynet-Add%20To%20Homescreen-00c65e?logo=skynet&labelColor=0d0d0d)](https://homescreen.hns.siasky.net/#/skylink/AQBNycvxoU1Mwey_12VjAFLWcHUZtG7rRI79ekpIMsVoWQ)

An overview of skynet servers.

### Hotkey Shortcuts

#### Group By Column:

<kbd>shift</kbd><kbd>G</kbd><kbd>R</kbd> Group By Region <br/><br/>
<kbd>shift</kbd><kbd>G</kbd><kbd>C</kbd> Group By Commit <br/><br/>
<kbd>shift</kbd><kbd>G</kbd><kbd>A</kbd> Group By Active <br/><br/>
<kbd>shift</kbd><kbd>G</kbd><kbd>P</kbd> Group By Production

#### Hide Columns:

<kbd>shift</kbd><kbd>H</kbd><kbd>P</kbd> Hide Performance Column Group <br/><br/>
<kbd>shift</kbd><kbd>H</kbd><kbd>R</kbd> Hide Region <br/><br/>
<kbd>shift</kbd><kbd>H</kbd><kbd>C</kbd> Hide Commit <br/><br/>
<kbd>shift</kbd><kbd>H</kbd><kbd>A</kbd> Hide Active <br/><br/>
<kbd>shift</kbd><kbd>H</kbd><kbd>S</kbd> Hide Storage <br/><br/>
<kbd>shift</kbd><kbd>H</kbd><kbd>I</kbd> Hide IP

#### Views:

<kbd>shift</kbd><kbd>V</kbd><kbd>F</kbd> Show All Rows <br/><br/>
<kbd>shift</kbd><kbd>V</kbd><kbd>W</kbd> Show Non-healthy Wallets <br/><br/>
<kbd>shift</kbd><kbd>V</kbd><kbd>A</kbd> Show Non-up Accounts <br/><br/>
<kbd>shift</kbd><kbd>V</kbd><kbd>L</kbd><kbd>A</kbd> Show Low Allowance <br/><br/>
<kbd>shift</kbd><kbd>V</kbd><kbd>H</kbd><kbd>C</kbd> Show High Contract Data > 100TB <br/><br/>
<kbd>shift</kbd><kbd>V</kbd><kbd>H</kbd><kbd>R</kbd> Show High Repair Data > 1TB <br/><br/>


## Constants

#### Column List (columnlist.js)

Contains two constants: columnGroupList and columnList. 
- ColumnGroupList is an object of the column groups with array of children columns. 
- ColumnList is array of column objects, each containing header (display string), accessor and description keys.

#### General Constants (consts.js)

Contains five constants: thresholds, msAccessors, totalColumns, region and subregion.

- Thresholds is an object with keys corresponding to column accessors. Each key-value is an array of objects with value, color and comparator keys. This object represents a condition for setting text to the specified color. 'gt' is greater than, 'lt' is less than, 'eq' is equals, and 'includes' is str.includes().
- msAccessors is a set of column accessors that require the 'ms' unit to be appended to the column value.
- totalColumns is a set of column accessors that are totaled in the table 'Totals' row.
- region and subregion are objects that map the server names to Load Balancer Zones.

#### Server Data (serverData.js)

Contains initialServerData constant representing a serverData object with empty key-values.

#### Server List (serverList.js)

Contains the servers constant. Servers is an object where each key represents the server domain. These keys populate the tabs in the UI. Each key maps to an array of server objects, each containing at least name and displayName keys and may contain ip and last_announce keys.

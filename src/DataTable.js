import React, { useState, useEffect, useCallback } from "react";
import { columnList, columnGroupsList } from "./constants/columnList";
import servers from "./constants/serverList.json";
import {
  region,
  subRegion,
  msAccessors,
  totalColumns,
} from "./constants/consts";
import { EyeOffIcon, RefreshIcon } from "@heroicons/react/solid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useHotkeys } from "react-hotkeys-hook";
import { useWindowSize } from "./services/windowSize";
import {
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableSortLabel,
} from "@mui/material";
import {
  StickyTableCell,
  StyledTableCell,
  StyledTableRow,
  useStyles,
} from "./styles/styles";
import { getStyle } from "./services/cellColor";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Check from "@mui/icons-material/Check";
import { getComparator } from "./services/columnSort";
import { fetchHealthCheck, fetchStats } from "./services/getServerData";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {initialServerData} from "./constants/serverData";

const domainTabs = ["All"].concat(Object.keys(servers));
const tabsLengths = [0].concat(
  Object.keys(servers).map((key) => servers[key].length)
);
const columnGroups = [
  { header: "General", numCols: 8, hide: false, id: 'general'},
  { header: "Performance", numCols: 10, hide: true, id: "performance" },
  { header: "", numCols: 1, hide: false },
  { header: "Renter Stats", numCols: 10, hide: true, id: "renter_stats" },
];

const theme = createTheme({
  palette: {
    primary: {
      light: "#33D17E",
      main: "#00c65e",
    },
  },
});

function DataTable() {
  /*
    tabIndex -> index of current tab view
    order -> 'desc' or 'asc' order for selected column
    orderBy -> column accessor to order table by
    hiddenCols -> set of columns to hide
    menuAnchor -> anchor element for the menu
    initLoading -> initial loading state
    serverData -> array of server data objects to populate table
    startIndex -> start index for slicing server data based on domain
    stopIndex -> stop index for slicing server data based on domain
    hiddenRows -> set of rows to hide
    height -> current window height
    open -> drives whether or not to open menu
    classes -> styles for material table
     */
  const [tabIndex, setTabIndex] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("region");
  const [hiddenCols, setHiddenCols] = useState(new Set([]));
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [initLoading, setInitLoading] = useState(true);
  const [serverData, setServerData] = useState();
  const [startIndex, setStartIndex] = useState(0);
  const [stopIndex, setStopIndex] = useState();
  const [hiddenRows, setHiddenRows] = useState(new Set([]));
  const height = useWindowSize();
  const open = Boolean(menuAnchor);
  const classes = useStyles();

  //Define Hotkeys
  // Group by ID
  useHotkeys("shift+g+r", () => handleRequestSort("region"));
  useHotkeys("shift+g+c", () => handleRequestSort("commit"));
  useHotkeys("shift+g+a", () => handleRequestSort("active"));
  useHotkeys("shift+g+p", () => handleRequestSort("prod"));

  // Hide Columns
  useHotkeys("shift+h+r", (event) => handleShowClick(event, "region"));
  useHotkeys("shift+h+c", (event) => handleShowClick(event, "commit"));
  useHotkeys("shift+h+a", (event) => handleShowClick(event, "active"));
  useHotkeys("shift+h+p", (event) => handleShowClick(event, "performance")); // Hide performance
  useHotkeys("shift+h+s", (event) => handleShowClick(event, "storage")); // Hide "storage"
  useHotkeys("shift+h+i", (event) => handleShowClick(event, "ip"));

  // Views
  useHotkeys("shift+v+w", () => updateHiddenRows("wallet", "high", "eq")); // Review non-healthy wallets
  useHotkeys("shift+v+a", () => updateHiddenRows("accounts", "healthy", "neq")); // Review non-up accounts
  useHotkeys("shift+v+f", () => showAllRows()); // Disable all Hidden & Filters
  useHotkeys("shift+v+l+a", () => updateHiddenRows("allowance", "low", "eq")); //low allowance
  useHotkeys("shift+v+h+c", () => updateHiddenRows("contracts", 100, "gt")); //high contract data > 100TB
  useHotkeys("shift+v+h+r", () => updateHiddenRows("repair", 1, "gt")); //high repair data > 1TB

  //hide rows that do not fit the given filtering criteria
  const updateHiddenRows = (accessor, value, comparator) => {
    let updatedSet = new Set([]);
    serverData.forEach((item) => {
      if (comparator === "gt" && item[accessor] < value) {
        updatedSet.add(item.name);
      } else if (comparator === "lt" && item[accessor] > value) {
        updatedSet.add(item.name);
      } else if (comparator === "eq" && item[accessor] !== value) {
        updatedSet.add(item.name);
      } else if (comparator === "neq" && item[accessor] === value) {
        updatedSet.add(item.name);
      }
    });
    setHiddenRows(updatedSet);
  };

  //show all rows, sets hidden rows to empty set
  const showAllRows = () => {
    setHiddenRows(new Set([]));
  };

  //sort table based on given property (column)
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  //handle toggling of visibility of a given column with accessor id
  const handleShowClick = (event, id) => {
    if (hiddenCols.has(id)) {
      let hiddenColumns = Array.from(hiddenCols);
      const i = hiddenColumns.indexOf(id);
      hiddenColumns.splice(i, 1);
      if (id === "performance" || id === "renter_stats") {
        columnGroupsList[id].children.forEach((item) => {
          const j = hiddenColumns.indexOf(item);
          hiddenColumns.splice(j, 1);
        });
      }
      setHiddenCols(new Set(hiddenColumns));
    } else {
      event.preventDefault();
      event.stopPropagation();
      let hiddenColumns = Array.from(hiddenCols);
      hiddenColumns.push(id);
      if (id === "performance" || id === "renter_stats") {
        hiddenColumns = hiddenColumns.concat(columnGroupsList[id].children);
      }
      setHiddenCols(new Set(hiddenColumns));
    }
  };
  //show menu
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  //hide menu
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  //change tab to given tab index, newValue
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (newValue === 0) {
      setStartIndex(0);
      setStopIndex(serverData.length);
    } else {
      const sumStart = tabsLengths
        .slice(0, newValue)
        .reduce((a, b) => a + b, 0);
      const sumEnd = sumStart + tabsLengths[newValue];
      setStartIndex(sumStart);
      setStopIndex(sumEnd);
    }
  };

  useEffect(() => {
    const server2d = Object.values(servers);
    const server1d = [].concat(...server2d);
    setStopIndex(server1d.length);
    let serverDisplayData = [];
    server1d.forEach((item) => {
      let serverData = {...initialServerData};
      serverData.name = item.displayName ? item.displayName : item.name;
      serverData.ip = item.ip;
      if (item.displayName) {
        const serverInfo = item.displayName.split("-");
        if (serverInfo[0]==='us') {
          serverData.region = `${region[serverInfo[0]]} ${subRegion[serverInfo[1]]}`;
        } else {
          serverData.region = region[serverInfo[0]];
        }
        serverData.production = "✔️";
      }
      serverDisplayData.push(serverData);
    });
    setServerData(serverDisplayData);
    setInitLoading(false);
    server1d.forEach((item, index) => {
      updateFunction(item.name, index, serverDisplayData);
    });
  }, []);

  //callback for fetchin server data
  const updateFunction = useCallback((domain, index, serverData) => {
    fetchHealthCheck(domain, index, serverData, setServerData);
    fetchStats(domain, index, serverData, setServerData);
  }, []);

  //populate column total values
  const getColumnTotal = (col, sd) => {
    const visibleServers = sd.slice(startIndex, stopIndex);
    if (col === "active") {
      let count = 0;
      visibleServers.forEach((item) => {
        if (item.active === "Yes") {
          count += 1;
        }
      });
      return String(Math.round((count / visibleServers.length) * 100)) + "%";
    } else if (col === "accounts") {
      let count = 0;
      visibleServers.forEach((item) => {
        if (item.accounts === "healthy") {
          count += 1;
        }
      });
      return String(Math.round((count / visibleServers.length) * 100)) + "%";
    } else if (totalColumns.has(col)) {
      let sum = 0;
      visibleServers.forEach((item) => {
        if (item[col] !== "") {
          sum += parseFloat(item[col].replace(/,/g, ""));
        }
      });
      return Math.round(sum);
    }
  };

  //handles refresh of new data
  const handleRefresh = () => {
    const server2d = Object.values(servers);
    const server1d = [].concat(...server2d);
    let serverDisplayData = [...serverData];
    console.log(serverDisplayData);
    server1d.forEach((item, index) => {
      updateFunction(item.name , index, serverDisplayData);
    });
  }
  //returns number of columns to span for the column groups
  const getColumnSpan = (columnGroup) => {
    if (columnGroup.header==='') {
      return hiddenCols.has('health_scan_time') ? 0 : 1;
    }
    const children = columnGroupsList[columnGroup.id].children;
    const shownChildren = children.filter(item => !hiddenCols.has(item));
    return shownChildren.length
  }

  return (
    <div>
      <div style={{ height: "50px" }}>
        <div className={"flex flex-row justify-between"}>
          <ThemeProvider theme={theme}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              {domainTabs.map((item, index) => (
                <Tab label={item} value={index} />
              ))}
            </Tabs>
          </ThemeProvider>
          <div className={'flex flex-row mt-2 items-center'}>
            <button onClick={handleRefresh} className={'flex mr-4 p-1 rounded-full hover:bg-palette-100'}>
              <RefreshIcon className={'h-6'}/>
            </button>
            <button
                className={"bg-primary rounded-full mr-2 py-1 px-6"}
                id={"filter_list"}
                onClick={handleMenuClick}
            >
              Column Selection
            </button>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={menuAnchor}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            className={"mt-4"}
          >
            {Object.keys(columnGroupsList)
              .slice(1)
              .map((col) => (
                <MenuItem
                  onClick={(event) => handleShowClick(event, col)}
                  key={col}
                >
                  {hiddenCols.has(col) ? (
                    <ListItemText inset>
                      {columnGroupsList[col].columnGroup}
                    </ListItemText>
                  ) : (
                    <>
                      <ListItemIcon>
                        <Check />
                      </ListItemIcon>
                      {columnGroupsList[col].columnGroup}
                    </>
                  )}
                </MenuItem>
              ))}
            {columnList.slice(1).map((column) => (
              <MenuItem
                onClick={(event) => handleShowClick(event, column.accessor)}
                key={column.accessor}
              >
                {hiddenCols.has(column.accessor) ? (
                  <ListItemText inset>{column.header}</ListItemText>
                ) : (
                  <>
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    {column.header}
                  </>
                )}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <TableContainer style={{ maxHeight: height - 50 }}>
        <Table stickyHeader aria-label="sticky table" size={"small"}>
          <TableHead>
            <TableRow>
              {columnGroups.map((col) => {
                const colSpan = getColumnSpan(col)
                return !hiddenCols.has(col.id) && colSpan!==0? (
                  <TableCell align="center" colSpan={colSpan}>
                    {col.header}
                    {col.hide ? (
                      <button
                        onClick={(event) => handleShowClick(event, col.id)}
                      >
                        <EyeOffIcon className="inline-block h-4 ml-1 text-gray-400 hover:text-gray-800" />
                      </button>
                    ) : null}
                  </TableCell>
                ) : null;
              })}
            </TableRow>
            <TableRow>
              {columnList.map((col) => {
                return !hiddenCols.has(col.accessor) ? (
                  <StyledTableCell padding={'none'} className={`z-10`} align={'center'} numeric>
                    <TableSortLabel
                      active={orderBy === col.accessor}
                      direction={orderBy === col.accessor ? order : "asc"}
                      onClick={() => handleRequestSort(col.accessor)}
                    >
                      {col.header}
                      {col.accessor !== "Name" ? (
                        <button
                          onClick={(event) =>
                            handleShowClick(event, col.accessor)
                          }
                        >
                          <EyeOffIcon className="inline-block h-4 ml-1 text-gray-400 hover:text-gray-800" />
                        </button>
                      ) : null}
                    </TableSortLabel>
                  </StyledTableCell>
                ) : null;
              })}
            </TableRow>
          </TableHead>
          {!initLoading ? (
            <TableBody>
              <StyledTableRow key={"totals"}>
                <StickyTableCell>
                  <StyledTableCell className={classes.cell}>
                    Totals
                  </StyledTableCell>
                </StickyTableCell>
                {columnList.slice(1).map((col) => {
                  return !hiddenCols.has(col.accessor) ? (
                    <StyledTableCell align={'center'} padding={'none'} className={classes.cell}>
                      {getColumnTotal(col.accessor, serverData)}
                    </StyledTableCell>
                  ) : null;
                })}
              </StyledTableRow>
              {serverData
                .slice(startIndex, stopIndex)
                .sort(getComparator(order, orderBy))
                .map((n) => {
                  return !hiddenRows.has(n.name) ? (
                    <StyledTableRow key={n.name}>
                      <StickyTableCell>
                        <StyledTableCell
                          numeric
                          align="right"
                          padding={'none'}
                          className={classes.cell}
                        >
                          {n.name}
                        </StyledTableCell>
                      </StickyTableCell>
                      {columnList.slice(1).map((col) => {
                        return !hiddenCols.has(col.accessor) ? (
                          <StyledTableCell
                            className={`z-10`}
                            numeric
                            align={'center'}
                            padding={'none'}
                            style={{
                              color: !msAccessors.has(col.accessor) ? getStyle(n[col.accessor], col.accessor) : null,
                            }}
                          >
                            {msAccessors.has(col.accessor) &&
                            n[col.accessor] !== ""
                              ?  (<>
                                  <span style={{color: getStyle(n[col.accessor], col.accessor)}}>
                                    {n[col.accessor] + "ms"}
                                  </span>{' / '}
                                  <span style={{color: getStyle(n[col.accessor+'9'], col.accessor+'9')}}>
                                    {n[col.accessor+'9'] + "ms"}
                                  </span>
                                </>)
                              : n[col.accessor]}
                          </StyledTableCell>
                        ) : null;
                      })}
                    </StyledTableRow>
                  ) : null;
                })}
            </TableBody>
          ) : null}
        </Table>
      </TableContainer>
    </div>
  );
}

export default DataTable;

import { makeStyles, withStyles } from "@mui/styles";
import { TableCell, TableRow } from "@mui/material";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  head: {
    backgroundColor: "#fff",
    minWidth: "50px",
    zIndex: 1,
  },
  headSticky: {
    backgroundColor: "#fff",
    minWidth: "50px",
    zIndex: 5,
  },
  tableContainer: {
    maxHeight: window.innerHeight,
    marginBottom: 10,
  },
  cell: {
    padding:0
  },
}));

export const StickyTableCell = withStyles((theme) => ({
  head: {
    left: 0,
    position: "sticky",
    zIndex: 0,
  },
  headSticky: {
    backgroundColor: "#fff",
    minWidth: "50px",
    zIndex: 5,
  },
  body: {
    backgroundColor: "#ddd",
    minWidth: "50px",
    left: 0,
    position: "sticky",
    zIndex: 0,
  },
}))(TableCell);

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#ffffff",
    color: "white",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "light-gray",
    },
  },
}))(TableRow);

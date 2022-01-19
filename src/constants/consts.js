//thresholds stores threshold values for table cell colors
export const thresholds = {
  dl_rate: [{ value: 25000, color: "red", comparator: "gt" }],
  ul_base_rate: [{ value: 1000, color: "red", comparator: "gt" }],
  ul_chunk_rate: [{ value: 1000, color: "red", comparator: "gt" }],
  regr_rate: [{ value: 25000, color: "red", comparator: "gt" }],
  regw_rate: [{ value: 10000, color: "red", comparator: "gt" }],
  dl_p99: [
    { value: 2000, color: "green", comparator: "lt" },
    { value: 5000, color: "red", comparator: "gt" },
  ],
  dl_p999: [
    { value: 2000, color: "green", comparator: "lt" },
    { value: 5000, color: "red", comparator: "gt" },
  ],
  ul_base_p99: [
    { value: 2000, color: "green", comparator: "lt" },
    { value: 5000, color: "red", comparator: "gt" },
  ],
  ul_base_p999: [
    { value: 2000, color: "green", comparator: "lt" },
    { value: 5000, color: "red", comparator: "gt" },
  ],
  ul_chunk_p99: [
    { value: 2000, color: "green", comparator: "lt" },
    { value: 5000, color: "red", comparator: "gt" },
  ],
  ul_chunk_p999: [
    { value: 2000, color: "green", comparator: "lt" },
    { value: 5000, color: "red", comparator: "gt" },
  ],
  regread_p99: [
    { value: 500, color: "green", comparator: "lt" },
    { value: 2000, color: "red", comparator: "gt" },
  ],
  regread_p999: [
    { value: 500, color: "green", comparator: "lt" },
    { value: 2000, color: "red", comparator: "gt" },
  ],
  regwrite_p99: [
    { value: 500, color: "green", comparator: "lt" },
    { value: 2000, color: "red", comparator: "gt" },
  ],
  regwrite_p999: [
    { value: 500, color: "green", comparator: "lt" },
    { value: 2000, color: "red", comparator: "gt" },
  ],
  health_scan_time: [
    { value: 8, color: "green", comparator: "lt" },
    { value: 24, color: "red", comparator: "gt" },
  ],
  files: [
    { value: 1500000, color: "red", comparator: "gt" },
    { value: 1000000, color: "orange", comparator: "gt" },
  ],
  contracts: [{ value: 100, color: "orange", comparator: "gt" }],
  wallet: [{ value: "healthy", color: "green", comparator: "eq" }],
  allowance: [
    { value: "high", color: "orange", comparator: "eq" },
    { value: "low", color: "red", comparator: "eq" },
    { value: "healthy", color: "green", comparator: "eq" },
  ],
  repair: [{ value: 1, color: "orange", comparator: "gt" }],
  max_health: [{ value: 75, color: "orange", comparator: "lt" }],
};
//column accessors that require millisecond units appended to end of numerical value
export const msAccessors = new Set([
  "dl_p99",
  "dl_p999",
  "ul_base_p99",
  "ul_base_p999",
  "ul_chunk_p99",
  "ul_chunk_p999",
  "regread_p99",
  "regread_p999",
  "regwrite_p99",
  "regwrite_p999",
]);

//columns to record total values
export const totalColumns = new Set([
  "active",
  "accounts",
  "dl_rate",
  "ul_base_rate",
  "ul_chunk_rate",
  "regr_rate",
  "regw_rate",
  "files",
  "storage",
  "contracts",
  "stuck_chunks",
]);

//region key value mapping
export const region = {
  eu: "Europe",
  us: "US",
  as: "Asia",
};
//subregion key value mapping
export const subRegion = {
  fin: "Finland",
  ger: "Germany",
  pol: "Poland",
  va: "Virginia",
  pen: "Pennsylvania",
  la: "Los Angeles",
  or: "Oregon",
  ny: "New York",
  sp: "Singapore",
  hk: "Hong Kong",
};

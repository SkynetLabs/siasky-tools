//column groups, children array is of accessors to corresponding columns
export const columnGroupsList = {
  general: {
    columnGroup: "General",
    children: ["name", "production", "region", "country", "ip", "commit", "active", "accounts", "alerts"],
  },
  performance: {
    columnGroup: "Performance",
    children: [
      "dl_rate",
      "ul_base_rate",
      "ul_chunk_rate",
      "regr_rate",
      "regw_rate",
      "dl_p99",
      "ul_base_p99",
      "ul_chunk_p99",
      "regread_p99",
      "regwrite_p99",
    ],
  },
  renter_stats: {
    columnGroup: "Renter Stats",
    children: [
      "files",
      "storage",
      "contracts",
      "wallet",
      "allowance",
      "max_storage_price",
      "repair",
      "max_health",
      "stuck_chunks",
    ],
  },
};
//columns for table, header is display string, accessor is used for operations on column.
export const columnList = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Production",
    accessor: "production",
  },
  {
    header: "LB Zone",
    accessor: "region",
  },
  {
    header: "IP Addr",
    accessor: "ip",
  },
  {
    header: "Commit",
    accessor: "commit",
  },
  {
    header: "Active",
    accessor: "active",
  },
  {
    header: "Accounts",
    accessor: "accounts",
  },
  {
    header: "Alerts",
    accessor: "alerts",
  },
  {
    header: "DL /15min",
    accessor: "dl_rate",
  },
  {
    header: "UL /15min",
    accessor: "ul_base_rate",
  },
  {
    header: "UL Chunk /15min",
    accessor: "ul_chunk_rate",
  },
  {
    header: "RegR /15min",
    accessor: "regr_rate",
  },
  {
    header: "RegW /15min",
    accessor: "regw_rate",
  },
  {
    header: "DL (p99)",
    accessor: "dl_p99",
  },
  {
    header: "UL Base (p99)",
    accessor: "ul_base_p99",
  },
  {
    header: "UL Chunk (p99)",
    accessor: "ul_chunk_p99",
  },
  {
    header: "RegRead (p99)",
    accessor: "regread_p99",
  },
  {
    header: "RegWrite (p99)",
    accessor: "regwrite_p99",
  },
  {
    header: "Health Scan Time (hours)",
    accessor: "health_scan_time",
  },
  {
    header: "Files",
    accessor: "files",
  },
  {
    header: "Storage (TB)",
    accessor: "storage",
  },
  {
    header: "Contracts (TB)",
    accessor: "contracts",
  },
  {
    header: "Renew Window",
    accessor: "renewwindow",
  },
  {
    header: "Wallet",
    accessor: "wallet",
  },
  {
    header: "Allowance",
    accessor: "allowance",
  },
  {
    header: "Max Storage Price (/TB/Mo)",
    accessor: "max_storage_price",
  },
  {
    header: "Repair (TB)",
    accessor: "repair",
  },
  {
    header: "Max Health",
    accessor: "max_health",
  },
  {
    header: "Stuck Chunks",
    accessor: "stuck_chunks",
  },
  {
    header: "Uptime",
    accessor: "uptime",
  },
];

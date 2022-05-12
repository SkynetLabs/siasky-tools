import { calcUptime } from "./upTimeCalculation";

/**
 * fetchHealthCheck() get and set health data for given server
 * @param {string} domain server host domain
 * @param {int} index index of the given server in the server data array
 * @param {array} sd array of server objects
 * @param {function} setServerData state set function for server data
 */
export const fetchHealthCheck = (domain, index, sd, setServerData) => {
  fetch("https://" + domain + "/health-check?nocache=true")
    .then((res) => {
      const active = res.status > 200 ? "Down!" : "Yes";
      let d = sd;
      d[index].active = active;
      //setServerData([...d]);
      return { r: res, d: d };
    })
    .then(async ({ r, d }) => {
      const val = await r.json();
      return { res: val, d: d };
    })
    .then(({ res, d }) => {
      if (res.disabled) {
        d[index].active = `Disabled: ${res.disabled}`;
      }
      if (res.entry && res.entry.checks) {
        const checks = res.entry.checks;
        const health = checks.filter((el) => el.name === "accounts");
        const accounts = health.length && health[0].up ? "healthy" : "down";
        d[index].accounts = accounts;
      }
      setServerData([...d]);
    })
    .catch((e) => {
      const active = "Unresponsive";
      const accounts = "Unknown";
      let d = sd;
      d[index].active = active;
      d[index].accounts = accounts;
      setServerData([...d]);
    });
};

/**
 * fetchStats() get and set stats for given server
 * @param {string} domain server host domain
 * @param {int} index index of the given server in the server data array
 * @param {array} sd array of server objects
 * @param {function} setServerData state set function for server data
 */
export const fetchStats = (domain, index, sd, setServerData) => {
  fetch("https://" + domain + "/skynet/stats?nocache=true")
    .then(async (res) => {
      try {
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    })
    .then((res) => {
      let d = sd;
      if (res.versioninfo && res.versioninfo.gitrevision) d[index].commit = res.versioninfo.gitrevision;
      if (res.numcritalerts) d[index].alerts = res.numcritalerts;
      if (res.streambufferread15mdatapoints) d[index].dl_rate = res.streambufferread15mdatapoints.toFixed(2);
      if (res.basesectorupload15mdatapoints) d[index].ul_base_rate = res.basesectorupload15mdatapoints.toFixed(2);
      if (res.chunkupload15mdatapoints) d[index].ul_chunk_rate = res.chunkupload15mdatapoints.toFixed(2);
      if (res.registryread15mdatapoints) d[index].regr_rate = res.registryread15mdatapoints.toFixed(2);
      if (res.registrywrite15mdatapoints) d[index].regw_rate = res.registrywrite15mdatapoints.toFixed(2);
      if (res.streambufferread15mp99ms) {
        d[index].dl_p99 = res.streambufferread15mp99ms;
        d[index].dl_p999 = res.streambufferread15mp999ms;
      }
      if (res.basesectorupload15mp99ms) {
        d[index].ul_base_p99 = res.basesectorupload15mp99ms;
        d[index].ul_base_p999 = res.basesectorupload15mp999ms;
      }
      if (res.chunkupload15mp99ms) {
        d[index].ul_chunk_p99 = res.chunkupload15mp99ms;
        d[index].ul_chunk_p999 = res.chunkupload15mp999ms;
      }
      if (res.registryread15mp99ms) {
        d[index].regread_p99 = res.registryread15mp99ms;
        d[index].regread_p999 = res.registryread15mp999ms;
      }
      if (res.registrywrite15mp99ms) {
        d[index].regwrite_p99 = res.registrywrite15mp99ms;
        d[index].regwrite_p999 = res.registrywrite15mp999ms;
      }
      if (res.systemhealthscandurationhours) {
        const scanTime = res.systemhealthscandurationhours.toLocaleString(undefined, { maximumFractionDigits: 2 });
        d[index].health_scan_time = scanTime !== 0 ? scanTime : "init";
      }
      if (res.numfiles)
        d[index].files = res.numfiles.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        });
      if (res.storage)
        d[index].storage = (res.storage / 1000 / 1000 / 1000 / 1000).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
      if (res.contractstorage)
        d[index].contracts = (res.contractstorage / 1000 / 1000 / 1000 / 1000).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
      if (res.renewwindow) d[index].renewwindow = res.renewwindow;
      if (res.walletstatus) d[index].wallet = res.walletstatus;
      if (res.allowancestatus) {
        d[index].allowance = res.allowancestatus;
        d[index].max_storage_price = Math.round(
          (res.maxstorageprice * 1000 * 1000 * 1000 * 1000 * 6 * 24 * 30) / 1000000000000000000000000
        );
      }
      if (res.repair)
        d[index].repair = (res.repair / 1000 / 1000 / 1000 / 1000).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
      if (res.maxhealthpercentage) {
        d[index].max_health =
          res.maxhealthpercentage.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          }) + "%";
      } else d[index].max_health = "0%";
      if (res.stuckchunks)
        d[index].stuck_chunks = res.stuckchunks.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        });
      if (res.uptime) d[index].uptime = calcUptime(res.uptime);

      setServerData([...d]);
    })
    .catch((e) => {
      console.log(`Error fetching stats for ${domain}`);
    });
};

/**
 * calcUptime() calc uptime based on time from fetch stats
 * @param {number} t uptime in seconds
 */
export const calcUptime = (t) => {
  let uptime = 0.0;
  let t_units = "";
  if (t < 60 * 60) {
    // < 1 hour
    uptime = t / 60;
    t_units = "m";
  } else if (t < 24 * 60 * 60) {
    // < 1 day
    uptime = t / 60 / 60;
    t_units = "h";
  } else {
    uptime = t / 60 / 60 / 24;
    t_units = "d";
  }
  uptime = (Math.round(uptime * 100) / 100).toFixed(1);
  return uptime + t_units;
};

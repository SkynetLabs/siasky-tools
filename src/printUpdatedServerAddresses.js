// use ip-api.com to resolve ip into useful data like location and hosting
async function getGeodata(ip) {
  const fields = ["status", "message", "continentCode", "country", "countryCode", "regionName", "city", "isp", "org"];
  const response = await fetch(`http://ip-api.com/json/${ip}?fields=${fields.join(",")}`);
  const { status, message, ...data } = await response.json();

  if (status !== "success") {
    throw new Error(`ip-api.com failed on ${ip}: ${message}`);
  }

  return data;
}

(async () => {
  const data = await Object.entries(require("./constants/serverList.json")).reduce(
    async (acc, [portalName, servers]) => {
      const resolvedServers = await Promise.all(
        servers.map(async (server) => {
          const current = await server;
          const updated = { ...current };

          try {
            const [ip] = await require("node:dns").promises.resolve4(server.name);
            updated.ip = ip;
          } catch {
            // do nothing
          }

          if (updated.ip && (updated.ip !== current.ip || !current.hosting)) {
            try {
              const geodata = await getGeodata(updated.ip);
              updated.hosting = geodata.org || geodata.isp;
              updated.continentCode = geodata.continentCode;
              updated.countryCode = geodata.countryCode;
              updated.location = [geodata.country, geodata.regionName, geodata.city].filter(Boolean).join(", ");
            } catch {
              // do nothing
            }
          }

          return updated;
        })
      );
      return { ...(await acc), [portalName]: resolvedServers };
    },
    Promise.resolve({})
  );

  console.log(JSON.stringify(data, null, 2));
})();

(async () => {
  console.log(
    JSON.stringify(
      await Object.entries(require("./constants/serverList.json")).reduce(
        async (acc, [portalName, servers]) => {
          acc = await acc;
          const resolvedServers = await Promise.all(
            servers.map(async (server) => {
              try {
                const [ip] = await require("node:dns").promises.resolve4(
                  server.name
                );
                if (ip) return { ...server, ip };
              } catch {
                // do nothing
              }
              return server;
            })
          );
          return { ...acc, [portalName]: resolvedServers };
        },
        Promise.resolve({})
      ),
      null,
      2
    )
  );
})();

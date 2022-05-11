(async () => {
  console.log(
    JSON.stringify(
      await Object.entries(require("./constants/serverList.json")).reduce(
        async (acc, [key, data]) => {
          acc = await acc;
          const servers = await Promise.all(
            data.map(async (server) => {
              try {
                const [ip] = await require("node:dns").promises.resolve4(
                  server.name
                );

                if (ip) return { ...server, ip };
                return server;
              } catch {
                console.log("Couldn't reach server", server.name);

                return server;
              }
            })
          );
          return { ...acc, [key]: servers };
        },
        Promise.resolve({})
      ),
      null,
      2
    )
  );
})();

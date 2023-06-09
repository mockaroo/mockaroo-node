import { Router } from "@edgio/core";

export default new Router()
  .get("/api/node/:path*", ({ serveStatic }) => {
    serveStatic("docs/:path*");
  })
  .get("/favicon.ico", ({ serveStatic }) => {
    serveStatic("images/favicon.ico");
  })
  .get("/", {
    url: {
      url_redirect: {
        destination: "/api/node/index.html",
      },
    },
  })
  .get("/api/node", {
    url: {
      url_redirect: {
        destination: "/api/node/index.html",
      },
    },
  });

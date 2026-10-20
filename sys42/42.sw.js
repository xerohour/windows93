// STATIC PROTO PATCH (vs upstream src/42.sw.js):
// 1. Relative import so the worker also works from a subpath
//    (upstream: import service from "/42/os/network/service.js").
// 2. vhost URL derived from this script's own URL instead of the
//    hardcoded "http://localhost:3000/42/os/network/client/vhost.html".
// 3. dev:false — dev mode expects the sys42 dev server (live-reload /
//    cache-bust over the backend); there is no backend on static hosting.
import service from "./42/os/network/service.js"

service.install({
  version: "0.0.6", // STATIC SUBPATH PATCH (P9): bumped on kit rebuild (0.0.1 = P9 kit; activate() deletes other-version caches)
  vhost: new URL("./42/os/network/client/vhost.html", self.location.href).href,
  dev: false,
})

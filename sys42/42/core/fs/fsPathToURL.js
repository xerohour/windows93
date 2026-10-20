// STATIC SUBPATH PATCH (P8): shared deploy-root path helpers.
//
// Upstream sys42 assumes the deployment root is the origin root: it converts
// between virtual FS paths ("/42/...", as keyed in the file index) and real
// URLs with `new URL(path, origin-or-import.meta.url).pathname`, which is an
// identity mapping only at a domain root. Under a subpath (e.g. a GitHub
// Pages project site at "/repo/") those conversions gain or lose the deploy
// prefix in the wrong places: theme icon lookups miss the file index and
// return undefined ( -> TypeError in path helpers), and app manifests get an
// origin-root dirURL so their $ref/modules/stylesheets 404 on launch.
//
// This module lives at <root>/42/core/fs/, so the deploy root is always
// "../../../" from here, whatever the deployment. At a domain root both
// helpers reduce to the upstream behaviour.

const DEPLOY_ROOT_URL = new URL("../../../", import.meta.url)
const DEPLOY_ROOT_PATH = DEPLOY_ROOT_URL.pathname

/** FS path ("/42/...") -> real absolute URL under the deploy root. */
export function fsPathToURL(path) {
  return new URL(String(path).replace(/^\//, ""), DEPLOY_ROOT_URL).href
}

/** Real URL (or URL path) -> FS path, by stripping the deploy-root prefix. */
export function urlToFsPath(url) {
  const { pathname } = new URL(url, DEPLOY_ROOT_URL)
  return pathname.startsWith(DEPLOY_ROOT_PATH)
    ? "/" + pathname.slice(DEPLOY_ROOT_PATH.length)
    : pathname
}

export default fsPathToURL

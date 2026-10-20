import ConfigFile from "../classes/ConfigFile.js"
import findIconPath from "./themesManager/findIconPath.js"
// STATIC SUBPATH PATCH (P8): theme icon dirs are FS paths, not URL paths.
import { urlToFsPath } from "../../core/fs/fsPathToURL.js"

// import loadCSS from "../core/load/loadCSS.js"

const DEFAULTS = {
  style: new URL("../../themes/windows9x/index.css", import.meta.url).pathname,
  module: new URL("../../themes/windows9x/index.js", import.meta.url).pathname,
  icons: [urlToFsPath(new URL("../../themes/default/icons", import.meta.url).href)], // STATIC SUBPATH PATCH (P8)
}

class ThemesManager extends ConfigFile {
  #fallbackIcon

  async init() {
    if (this.value.module) {
      await import(this.value.module).then((module) => {
        this.module = module
        return module.install()
      })
    }
    // const el = await loadCSS(this.value.style)
    // document.querySelector("link#theme")?.remove()
    // el.id = "theme"
  }

  async postload() {
    this.#fallbackIcon = undefined
    // STATIC SUBPATH PATCH (P11): heal theme configs persisted by pre-P8
    // builds. Their `icons` entries are URL pathnames carrying the deploy
    // prefix ("/<repo>/42/...") instead of FS paths ("/42/..."), and
    // ConfigFile loads stored values verbatim, so the P8 defaults fix
    // never reached existing profiles: every icon lookup missed the file
    // index, the fallback missed too, getIconPath returned undefined and
    // Icon.getInfos died in fs.getURL(undefined) — one TypeError dialog
    // per desktop icon, on every boot, immune to kit updates because the
    // poison lives in the profile's persisted FS. urlToFsPath is
    // idempotent for already-correct entries; persist the healed value.
    if (Array.isArray(this.value?.icons)) {
      const healed = this.value.icons.map((p) => urlToFsPath(p))
      if (healed.some((p, i) => p !== this.value.icons[i])) {
        this.value.icons = healed
        await this.save().catch(() => {})
      }
    }
  }

  async getIconPath(infos, size = "32x32") {
    await this.ready
    for (const themePath of this.value.icons) {
      // STATIC SUBPATH PATCH (P11): normalize defensively (see postload)
      const path = await findIconPath(urlToFsPath(themePath), infos, size)
      if (path) return path
    }

    if (typeof infos === "string") {
      // If unfound try from a freedesktop name
      // https://specifications.freedesktop.org/icon-naming-spec/latest/ar01s04.html
      infos = infos.replace("-", "/")
      for (const themePath of this.value.icons) {
        const path = await findIconPath(urlToFsPath(themePath), infos, size)
        if (path) return path
      }
    }

    this.#fallbackIcon ??= await findIconPath(
      urlToFsPath(this.value.icons[0]),
      "subtype/octet-stream",
      size,
    )

    return this.#fallbackIcon
  }

  async refresh() {
    await this.ready
    this.module?.refresh()
  }
}

export const themesManager = new ThemesManager(".theme.json", DEFAULTS)
themesManager.init()

export default themesManager

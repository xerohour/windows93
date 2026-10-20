/* eslint-disable max-depth */
/* eslint-disable complexity */
import ConfigFile from "../classes/ConfigFile.js"
import arrify from "../../fabric/type/any/arrify.js"
import pick from "../../fabric/type/object/pick.js"
import fileIndex from "../../core/fileIndex.js"
import isHashmapLike from "../../fabric/type/any/is/isHashmapLike.js"
import parseURLQuery from "../../fabric/url/parseURLQuery.js"
import mimetypesManager from "./mimetypesManager.js"
import normalizeManifest from "../classes/App/normalizeManifest.js"
import App from "../classes/App.js"
// STATIC SUBPATH PATCH (P8): deploy-root aware URL<->FS-path conversion.
import { fsPathToURL, urlToFsPath } from "../../core/fs/fsPathToURL.js"

const REGISTRY_KEYS = [
  "name",
  "slug",
  "manifestPath",
  "categories",
  "icons",
  "width",
  "height",
  "geometry",
  "document",
  "inset",
]

const MANIFEST_EXTENSION = "app.json5"

class AppsManager extends ConfigFile {
  async populate() {
    this.value = {}

    await Promise.all(
      fileIndex
        .glob(`**/*${MANIFEST_EXTENSION}`)
        .map((manifestPath) => this.add(manifestPath, { save: false })),
    )

    return this.value
  }

  async postload() {
    // STATIC PATCH (P12): merge-missing apps into the persisted
    // registry. populate() above only runs on reset() — i.e. when
    // $HOME/.apps.json does not exist yet — and ConfigFile.load()
    // afterwards trusts the stored registry verbatim (the version
    // stamp is -Date.now() at save time, so the obsolete-version
    // branch can never fire on a later boot). A profile created
    // before new apps shipped therefore kept its original registry
    // (5 framework apps) forever, even once the file index knows the
    // new manifests (see the FileIndex half of P12). On every load,
    // register any indexed manifest whose path is not represented in
    // the stored registry, then persist once if anything was added.
    // Existing entries are left untouched; failures to read a single
    // manifest never block the rest or the boot.
    try {
      if (!this.value || typeof this.value !== "object") return
      const known = new Set(
        Object.values(this.value).map((app) => app?.manifestPath),
      )
      const missing = fileIndex
        .glob(`**/*${MANIFEST_EXTENSION}`)
        .filter((manifestPath) => !known.has(manifestPath))
      if (missing.length === 0) return
      const results = await Promise.allSettled(
        missing.map((manifestPath) => this.add(manifestPath, { save: false })),
      )
      if (results.some(({ status }) => status === "fulfilled")) {
        await this.save().catch(() => {})
      }
    } catch {}
  }

  async add(manifestPath, options) {
    const fs = await import("../../core/fs.js") //
      .then((m) => m.default)

    const manifest = await fs.read.json5(manifestPath)

    if (manifest?.decode?.types) {
      await mimetypesManager.ready
      const undones = []
      for (const { accept, icons } of manifest.decode.types) {
        if (icons) {
          const manifestURL = fsPathToURL(manifestPath) // STATIC SUBPATH PATCH (P8)
          for (const icon of icons) {
            const src = urlToFsPath(new URL(icon.src, manifestURL).href) // STATIC SUBPATH PATCH (P8)

            const sizes = icon.sizes.split(" ")[0]

            const pathname = urlToFsPath(
              new URL("../../themes/default/icons", import.meta.url).href,
            ) // STATIC SUBPATH PATCH (P8)

            const dest = `${pathname}/${sizes}${src.slice(
              src.indexOf(sizes) + sizes.length,
            )}`

            fs.link(src, dest)
          }
        }

        undones.push(mimetypesManager.add(accept, manifest.name))
      }

      await Promise.all(undones)
    }

    manifest.manifestPath = manifestPath
    await normalizeManifest(manifest, { skipNormaliseDecode: true })

    const out = pick(manifest, REGISTRY_KEYS)

    this.value[manifest.name] = out

    if (options?.save !== false) return this.save()
  }

  async launch(appName, options) {
    await this.ready

    if (appName in this.value === false) {
      throw new Error(`Unknown app: ${appName}`)
    }

    const { manifestPath } = this.value[appName]
    return App.launch(manifestPath, options)
  }

  async open(paths, options) {
    await this.ready
    await mimetypesManager.ready

    const openers = {}

    for (const path of arrify(paths)) {
      const { pathname, search, searchParams } = new URL(path, "file:")
      const fileParams = search ? parseURLQuery(searchParams) : undefined

      if (pathname.endsWith("/")) {
        import("../../ui/components/explorer.js") //
          .then(({ explorer }) => explorer(pathname))
        continue
      }

      const { apps: appNames } = mimetypesManager.lookup(pathname)

      if (appNames.length > 0) {
        openers[appNames[0]] ??= {}
        const opener = openers[appNames[0]]
        opener.$files ??= []
        opener.$files.push(pathname)
        opener.$params ??= []
        opener.$params.push(fileParams)
      } else {
        import("../../ui/invocables/alert.js").then(({ alert }) =>
          alert("No app available to open this type of file"),
        )
      }
    }

    for (const [appName, { $files, $params }] of Object.entries(openers)) {
      this.launch(appName, {
        state: { $files, $params },
        ...options,
      })
    }
  }

  async lookup(path) {
    await this.ready
    await mimetypesManager.ready
    const { apps: appNames } = mimetypesManager.lookup(path)

    const apps = []

    for (const appName of appNames) {
      const app = this.value[appName]
      if (app) apps.push(app)
    }

    return apps
  }

  async makeMenu(val) {
    await this.ready

    let state
    let sort

    if (typeof val === "string") {
      val = val in this.value ? [this.value[val]] : await this.lookup(val)
    } else if (Array.isArray(val)) {
      await mimetypesManager.ready

      const counts = {}

      const appNames = new Set()
      for (const item of val) {
        if (item in this.value) appNames.add(item)
        else {
          state ??= {}
          state.$files ??= []
          state.$files.push(item)
          const { apps } = mimetypesManager.lookup(item)
          for (const app of apps) {
            appNames.add(app)
            counts[app] = (counts[app] ?? 0) + 1
          }
        }
      }

      val = []
      for (const appName of appNames) {
        if (appName in this.value) val.push(this.value[appName])
      }

      val.sort((a, b) => counts[b.name] - counts[a.name])
    } else if (isHashmapLike(val)) {
      if ("mimetype" in val) {
        sort = true
        const { mimetype } = val
        const appNames = new Set()
        for (const { apps } of mimetypesManager.list(mimetype, {
          withApps: true,
        })) {
          for (const appName of apps) {
            if (appName in this.value) appNames.add(appName)
          }
        }

        val = []
        for (const appName of appNames) {
          if (appName in this.value) val.push(this.value[appName])
        }
      }
    } else if (!val) {
      sort = true
      val = Object.values(this.value) //
    }

    if (sort) val.sort((a, b) => a.name.localeCompare(b.name))

    const menu = []

    for (const { name, icons } of val) {
      const menuItem = {
        label: name,
        click: () => this.launch(name, state),
      }

      for (const { sizes, src } of icons) {
        if (sizes === "16x16") {
          menuItem.picto = src
          break
        }

        menuItem.picto = src
      }

      menu.push(menuItem)
    }

    return menu
  }
}

export const appsManager = new AppsManager(".apps.json")
appsManager.init()

export default appsManager

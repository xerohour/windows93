/* eslint-disable camelcase */
import toKebabCase from "../../../fabric/type/string/case/toKebabCase.js"
import getDirname from "../../../core/path/core/getDirname.js"
import mimetypesManager from "../../managers/mimetypesManager.js"
// STATIC SUBPATH PATCH (P8): deploy-root aware URL<->FS-path conversion.
import { fsPathToURL, urlToFsPath } from "../../../core/fs/fsPathToURL.js"

export async function getIcons(manifest) {
  const fileIndex = await import("../../../core/fileIndex.js") //
    .then(({ fileIndex }) => fileIndex)

  const icons = []

  let icon16
  let icon32
  let icon160

  for (const path of fileIndex.glob([
    `${manifest.dir}icons/**/*.{jpg,gif,svg,png}`,
    `${manifest.dir}icons/*.{jpg,gif,svg,png}`,
    `${manifest.dir}icon*.{jpg,gif,svg,png}`,
  ])) {
    if (path.includes("/16x16/icon.") || path.includes("-16.")) {
      icon16 = {
        src: urlToFsPath(new URL(path, manifest.dirURL).href), // STATIC SUBPATH PATCH (P8)
        sizes: "16x16",
      }
    } else if (path.includes("/32x32/icon.") || path.includes("-32.")) {
      icon32 = {
        src: urlToFsPath(new URL(path, manifest.dirURL).href), // STATIC SUBPATH PATCH (P8)
        sizes: "32x32",
      }
    } else if (path.includes("/160x160/icon.") || path.includes("-160.")) {
      icon160 = {
        src: urlToFsPath(new URL(path, manifest.dirURL).href), // STATIC SUBPATH PATCH (P8)
        sizes: "160x160",
      }
    }
  }

  if (icon16) icons.push(icon16)
  if (icon32) icons.push(icon32)
  if (icon160) icons.push(icon160)

  return icons
}

async function normaliseDecode(manifest) {
  if (manifest?.decode?.types) {
    await mimetypesManager.ready

    const mainAction = manifest.dirURL
    manifest.decode.types = manifest.decode.types.map((type) => {
      const out = {}
      out.action = type.action ?? mainAction

      out.accept = mimetypesManager.normalize(type.accept)

      if (type.icons) out.icons = type.icons
      if (type.launch_type) out.launch_type = type.launch_type
      return out
    })
  }
}

export async function normalizeManifest(manifest, options) {
  manifest.slug ??= toKebabCase(manifest.name)

  manifest.manifestPath ??= document.baseURI
  manifest.manifestURL ??= String(manifest.manifestPath).startsWith("http")
    ? new URL(manifest.manifestPath, document.baseURI).href
    : fsPathToURL(manifest.manifestPath) // STATIC SUBPATH PATCH (P8)
  manifest.dir ??= getDirname(manifest.manifestPath) + "/"
  manifest.dirURL ??= getDirname(manifest.manifestURL) + "/"

  const [icons] = await Promise.all([
    getIcons(manifest),
    options?.skipNormaliseDecode === true
      ? undefined
      : normaliseDecode(manifest),
  ])

  if (icons) manifest.icons = icons
}

export default normalizeManifest

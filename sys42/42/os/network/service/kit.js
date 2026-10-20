import tarExtractPipe from "../../../core/formats/tar/tarExtractPipe.js"
import getPathInfos from "../../../core/path/getPathInfos.js"

const kit = {}

kit.install = async (version, options) => {
  if (await caches.has(version)) return

  kit.version = version

  const kitsFolder = options?.kitsFolder ?? "42-kits"

  const [res, cache] = await Promise.all([
    // STATIC PROTO PATCH: was fetch(`/${kitsFolder}/...`) — absolute path
    // breaks under a subpath. This code only runs in the service worker,
    // whose location is <root>/42.sw.js, so resolving against it is
    // subpath-safe.
    fetch(new URL(`${kitsFolder}/${version}.tar.gz`, location.href)),
    kit.cache ?? caches.open(version),
  ])

  if (!res.ok) return

  kit.cache = cache

  const undones = []

  const sink = new WritableStream({
    async write(item) {
      if (item.type === "file") {
        const { headers } = getPathInfos(item.name, { headers: true })
        headers["Content-Length"] = item.size
        const res = new Response(item.file, { headers })
        undones.push(cache.put(item.name, res))
      }
    },
  })

  try {
    await res.body.pipeThrough(tarExtractPipe({ gzip: true })).pipeTo(sink)
    await Promise.all(undones)
  } catch (err) {
    await caches.delete(version)
    throw err
  }
}

kit.update = async (path, version = kit.version) => {
  kit.cache ??= await caches.open(version)
  await kit.cache.add(path)
}

export { kit }
export default kit

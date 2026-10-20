/* eslint-disable unicorn/no-this-assignment */
/* eslint-disable no-constructor-return */
import FileLocator from "./FileLocator.js"
import Canceller from "../../fabric/classes/Canceller.js"
import CBOR from "../formats/cbor.js"
import ipc from "../ipc.js"

export const FS_DRIVER_MASKS = {
  0x00: "fetch",
  0x10: "memory",
  0x11: "sessionstorage",
  0x12: "localstorage",
  0x13: "indexeddb",
}

function syncFileIndex(instance) {
  ipc.on("42_FILE_INDEX_CHANGE", ([path, type, inode]) => {
    if (type === "set") {
      if (inode !== undefined) instance[type](path, inode)
    } else instance[type](path)
  })
}

let ExportedClass

if (ipc.inIframe) {
  ExportedClass = class FileIndex extends FileLocator {
    synced = false

    async init() {
      if (this.synced) return

      // Sync file index with top-level realm
      this.value = await ipc.send("42_FILE_INDEX_INIT")
      this.synced = true

      syncFileIndex(this)

      if (!ipc.inWorker) {
        globalThis.addEventListener("pagehide", () =>
          ipc.emit("42_FILE_INDEX_CLOSE"),
        )
      }
    }
  }
} else {
  const populate = async () => {
    // STATIC PROTO PATCH: was new URL("/files.cbor", import.meta.url) —
    // absolute path breaks under a subpath (GitHub Pages project site).
    // This file lives at <root>/42/core/fs/, so ../../../ is the site root.
    const url = new URL("../../../files.cbor", import.meta.url)
    const res = await fetch(url)
    return res.status === 200 ? CBOR.decode(await res.arrayBuffer()) : {}
  }

  let instance

  ExportedClass = class FileIndex extends FileLocator {
    synced = false

    constructor() {
      if (instance) {
        console.warn("FileIndex already initialized")
        return instance
      }

      super(Object.create(null), { populate })

      instance = this

      const ports = new WeakMap()

      ipc
        .on("42_FILE_INDEX_INIT", async (_, { port, emit }) => {
          const cancel = new Canceller()
          ports.set(port, cancel)
          const { signal } = cancel

          this.on("change", { signal }, (...args) => {
            emit("42_FILE_INDEX_CHANGE", args)
          })

          await this.ready
          return this.value
        })
        .on("42_FILE_INDEX_SYNC", async (_, { emit }) => {
          this.on("change", (...args) => emit("42_FILE_INDEX_CHANGE", args))
        })
        .on("42_FILE_INDEX_CLOSE", async (_, { port }) => {
          if (ports.has(port)) {
            const cancel = ports.get(port)
            cancel()
            ports.delete(port)
          }
        })
    }

    async init(target) {
      if (target) {
        if (target === true) {
          const [value] = await ipc.send("42_FILE_INDEX_INIT")
          this.value = value
          this.synced = true
        } else {
          const value = await ipc.to(target).sendOnce("42_FILE_INDEX_INIT")
          this.value = value
          this.synced = true
        }
      } else {
        await super.init()
        // STATIC PATCH (P12): merge-missing hosted entries from the
        // current files.cbor. The index is a Storable whose populate()
        // (the files.cbor seed) only runs when its IndexedDB store is
        // first created, and the Database version never changes — so a
        // profile created by an older deployment kept that deployment's
        // file list forever: files added by later kits (desktop
        // shortcuts, new app manifests, theme icons) never appeared,
        // no matter how many kit updates shipped. Here, after loading
        // the persisted index, any leaf present in the freshly fetched
        // files.cbor but missing locally is added with its hosted inode
        // (0). Existing entries are never touched, so user-created
        // files (array inodes written through the FS drivers) and their
        // store records are preserved exactly; the merge is idempotent
        // and a failed fetch simply leaves the persisted index as-is.
        try {
          const fresh = await populate()
          const missing = []
          const walk = (node, prefix) => {
            for (const [key, val] of Object.entries(node)) {
              const path = `${prefix}/${key}`
              if (
                val !== null &&
                typeof val === "object" &&
                !Array.isArray(val)
              ) {
                walk(val, path)
              } else if (!this.has(path)) missing.push([path, val])
            }
          }

          walk(fresh, "")
          for (const [path, inode] of missing) await this.set(path, inode)
        } catch {}

        this.synced = true
        if (ipc.inWorker) ipc.emit("42_FILE_INDEX_SYNC")
      }

      if (ipc.inWorker) syncFileIndex(this)
    }
  }
}

export { ExportedClass as FileIndex }
export default ExportedClass

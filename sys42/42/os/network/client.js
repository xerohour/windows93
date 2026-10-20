/* eslint-disable import/no-unresolved */
import system from "../../system.js"
import ipc from "../../core/ipc.js"
import listen from "../../fabric/event/listen.js"
import unregisterServices from "./client/unregisterServices.js"

if (location.search.includes("clear-site-data")) {
  if (await unregisterServices()) location.reload()
}

class Client {
  get controller() {
    return navigator.serviceWorker.controller
  }

  #bus
  get bus() {
    if (!navigator.serviceWorker.controller) return
    this.#bus ??= ipc.to(navigator.serviceWorker.controller)
    return this.#bus
  }

  async connect(options) {
    // STATIC SUBPATH PATCH (P9): default was "/42.sw.js" (origin root) —
    // wrong under a subpath deployment. This module lives at
    // <root>/42/os/network/, so the worker is ../../../42.sw.js from here.
    const url =
      typeof options === "string"
        ? options
        : options?.url ?? new URL("../../../42.sw.js", import.meta.url).href

    this.registration = await navigator.serviceWorker //
      .register(url, { type: "module" })

    const hasController = navigator.serviceWorker.controller

    if (this.registration) {
      // prevent hard refresh to disable service worker https://stackoverflow.com/a/62596701
      if (this.registration.active && !hasController) location.reload()

      this.registration.addEventListener("updatefound", () => {
        console.log("Service Worker update found!")
      })
    }

    if (!hasController) {
      await new Promise((resolve) => {
        const forget = listen(navigator.serviceWorker, {
          controllerchange() {
            if (navigator.serviceWorker.controller) {
              forget()
              resolve()
            }
          },
        })
      })
    }

    this.bus.send("42_SW_HANDSHAKE").then((config) => {
      if (config.vhost) {
        system.network ??= {}
        system.network.vhost ??= config.vhost
      }

      if (config.dev && !system.dev) import("../../dev.js?verbose=2&service")
    })
  }
}

const client = new Client()

export { client }
export default client

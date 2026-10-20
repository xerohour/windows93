// STATIC PATCH (P10, xerohour/windows93): upstream sys42 has no command
// that launches a registered app by name, which is what .desktop entries
// need (their Exec= runs through os.exec). `app <Name>` launches the app
// from the apps registry — used by the desktop shortcuts in
// tests/fixtures/formats/*.desktop.
import appsManager from "../managers/appsManager.js"

export const cli = { argsKey: "name" }

export async function app(args) {
  const raw = args?.name ?? args?._
  const name = Array.isArray(raw) ? raw[0] : raw
  if (name) return appsManager.launch(String(name))
}

export default app

import registerCommands from "./commands"
import registerSidebar from "./sidebar"
import registerTasks from "./tasks"
import RubyLanguageServer from "./other/RubyLanguageServer"
import VersionChecker from "./other/VersionChecker"

import { isRailsInProject, showNotification } from "./helpers"

const versionChecker = new VersionChecker()
versionChecker.check()

let langserver

async function asyncActivate() {
  if (isRailsInProject()) {
    nova.workspace.railsDetected = true

    showNotification(
      "rails-detected",
      "Ruby on Rails Found in Project 🚂",
      false,
      "Specific features will be enabled..."
    )
  } else {
    nova.workspace.railsDetected = false
  }

  registerCommands()
  registerSidebar()
  registerTasks()

  if (nova.config.get("tommasonegri.rails.config.solargraph.enabled", "boolean")) {
    langserver = new RubyLanguageServer()
  }
}

export function activate() {
  return asyncActivate()
    .then(() => {
      console.log("Hello from Ruby on Rails 🚂")
    })
    .catch(err => {
      console.error("Failed to activate with error:", err)
      nova.workspace.showErrorMessage(err)
    })
}

export function deactivate() {
  if (langserver) {
    langserver.deactivate()
    langserver = null
  }

  console.log("Goodbye from Ruby on Rails 👋")
}

async function reload() {
  deactivate()

  console.log("Reloading Ruby Language Server...")
  showNotification(
    "rails-reload",
    "Ruby on Rails is Reloading...",
    false,
    "Don't worry, it won't take a while."
  )

  await asyncActivate()
    .then(() => {
      console.log("Hello from Ruby on Rails 🚂")
    })
    .catch(err => {
      console.error("Failed to activate with error:", err)
      nova.workspace.showErrorMessage(err)
    })
}

nova.commands.register("tommasonegri.rails.commands.reload", () => {
  reload()
})

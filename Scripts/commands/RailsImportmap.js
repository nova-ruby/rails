const { showNotification } = require("../helpers")

exports.RailsImportmap = class RailsImportmap {
  constructor() {}

  pin() {
    const message = "Pin one or more packages to Rails importmap. Separate packages with a blank space."

    nova.workspace.showInputPanel(message, {
      label: "Packages",
      placeholder: "lodash local-time react@17.0.1",
      prompt: "Pin"
    }, packages => this.pin_or_unpin(packages, { method: "pin" }))
  }

  unpin() {
    const message = "Unpin one or more packages from Rails importmap. Separate packages with a blank space."

    nova.workspace.showInputPanel(message, {
      label: "Packages",
      placeholder: "lodash local-time react@17.0.1",
      prompt: "Unpin"
    }, packages => this.pin_or_unpin(packages, { method: "unpin" }))
  }

  // Private

  pin_or_unpin(packages, options) {
    const process = new Process("usr/bin/env", {
      cwd: nova.workspace.path,
      args: ["bin/importmap", options.method, ...packages.split(" ")],
      stdio: ["ignore", "pipe", "pipe"],
    })

    let str = ""
    let err = ""

    process.onStdout(output => str += output.trim())
    process.onStderr(error_output => err += error_output)

    process.onDidExit((status) => {
      if (status === 0) {
        if (str.includes("Couldn't find any packages")) {
          console.warn("Couldn't find packages:", packages)

          nova.workspace.showWarningMessage(`Couldn"t find the specified packages. Check out for typos or other reference errors.`)
        } else {
          console.log(`Successfully ${options.method}ned packages:`, packages)

          showNotification(
            `rails-importmap-${options.method}`,
            `Successfully ${options.method}ned packages`,
            false,
            `Packages have been ${options.method}ned correctly.`
          )
        }
      } else {
        console.error(`Importmap ${options.method} command exited with error:`, err)

        nova.workspace.showErrorMessage(`Something went wrong with the importmap ${options.method} command. Check out the Extension Console for more information.`)
      }
    })

    process.start()
  }
}

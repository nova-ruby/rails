const { showNotification } = require("../helpers")

exports.RailsStimulus = class RailsStimulus {
  updateManifest() {
    // TODO: Handle case when importmaps or other system are used
    if (!nova.workspace.railsDetected) {
      console.error("Something went wrong with the update Stimulus manifest command")

      this.showError("Something went wrong with the update Stimulus manifest command. Does the workspace contain a Rails project?")

      return
    }

    const process = new Process("usr/bin/env", {
      cwd: nova.workspace.path,
      args: ["rails", "stimulus:manifest:update"],
      stdio: ["ignore", "pipe", "ignore"],
    })
    let str = ""

    process.onStdout((output) => {
      str += output.trim()
    })

    process.onDidExit((status) => {
      if (status === 0) {
        console.log("Stimulus manifest updated")

        showNotification(
          "rails-stimulus-manifest-updated",
          "Stimulus manifest updated",
          false,
          "The Stimulus manifest file has been updated correctly."
        )
      } else {
        console.error("Update Stimulus manifest command", str)

        this.showError("Something went wrong with the update Stimulus manifest command. Check out the Extension Console for more information.")
      }
    })

    process.start()
  }

  showError(msg) {
    nova.workspace.showErrorMessage(msg)
  }
}

const { showNotification } = require("../helpers")

exports.VersionChecker = class VersionChecker {
  constructor() {
    if (nova.inDevMode()) {
      console.log("————— VERSION CHECKER —————")
      console.log("(CHECKER) Extension Identifier:", nova.extension.identifier)
      console.log("(CHECKER) Extension Name:", nova.extension.name)
      console.log("(CHECKER) Current Version:", nova.extension.version)
      console.log("(CHECKER) Stored Version:", this.getLatestStoredVersion())
    }
  }

  check() {
    switch (this.getLatestStoredVersion()) {
      case null:
        this.storeLatestVersion()
        break
      case nova.extension.version:
        break
      default:
        this.notifyVersionChanged()
        this.storeLatestVersion()
    }
  }

  getLatestStoredVersion() {
    const key = `${nova.extension.identifier}.extension.version`

    return nova.config.get(key, "string")
  }

  storeLatestVersion() {
    const key = `${nova.extension.identifier}.extension.version`

    nova.config.set(key, nova.extension.version)
  }

  notifyVersionChanged() {
    showNotification(
      `${nova.extension.identifier}-new-version`,
      `${nova.extension.name} Updated`,
      false,
      `${nova.extension.name} has been updated to v${nova.extension.version}`,
      ["Open Changelog", "Ignore"],
      (reply) => {
        switch (reply.actionIdx) {
          case 0:
            this.openChangelog()
            break
          case 1:
            break
        }
      }
    )
  }

  openChangelog() {
    nova.extension.openChangelog()
  }
}

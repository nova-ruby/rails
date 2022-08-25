function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.general.alternateFileType", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.general.alternateFileType", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.general.alternateFileType", "boolean")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.general.alternateFileType", "string")

  switch (str) {
    case "Global Default":
      return null
    case "minitest":
      return "minitest"
    case "rspec":
      return "rspec"
    default:
      return null
  }
}

exports.statusNotialternateFileTypefications = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

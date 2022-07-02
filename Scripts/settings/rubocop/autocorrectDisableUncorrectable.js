function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.rubocop.autocorrect.disableUncorrectable", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.rubocop.autocorrect.disableUncorrectable", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.rubocop.autocorrect.disableUncorrectable", "boolean")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.rubocop.autocorrect.disableUncorrectable", "string")

  switch (str) {
    case "Global Default":
      return null
    case "Enabled":
      return true
    case "Disabled":
      return false
    default:
      return null
  }
}

exports.autocorrectDisableUncorrectable = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

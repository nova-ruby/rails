function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.general.statusNotifications", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.general.statusNotifications", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.general.statusNotifications", "boolean")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.general.statusNotifications", "string")

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

exports.statusNotifications = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

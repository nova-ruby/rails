function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.solargraph.definitions", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.solargraph.definitions", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.solargraph.definitions", "boolean")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.solargraph.definitions", "string")

  switch (str) {
    case "Global Default":
      return null
    case "Enable":
      return true
    case "Disable":
      return false
    default:
      return null
  }
}

exports.definitions = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

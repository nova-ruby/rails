function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.solargraph.logLevel", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.solargraph.logLevel", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.solargraph.logLevel", "string")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.solargraph.logLevel", "string")

  switch (str) {
    case "Global Default":
      return null
    case "warn":
      return "warn"
    case "info":
      return "info"
    case "debug":
      return "debug"
    default:
      return null
  }
}

exports.logLevel = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.solargraph.transport", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.solargraph.transport", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.solargraph.transport", "string")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.solargraph.transport", "string")

  switch (str) {
    case "Global Default":
      return null
    case "socket":
      return "socket"
    case "stdio":
      return "stdio"
    default:
      return null
  }
}

exports.transport = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

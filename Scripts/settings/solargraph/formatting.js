function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.solargraph.formatting", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.solargraph.formatting", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.solargraph.formatting", "boolean")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.solargraph.formatting", "string")

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

exports.formatting = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

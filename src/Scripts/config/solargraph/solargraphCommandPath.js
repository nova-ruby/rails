function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.solargraph.commandPath", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.solargraph.commandPath", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.solargraph.commandPath", "string")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.solargraph.commandPath", "string")

  switch (str) {
    case "":
      return null
    default:
      return str
  }
}

export default function solargraphCommandPathSetting() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.solargraph.bundlerPath", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.solargraph.bundlerPath", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.solargraph.bundlerPath", "string")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.solargraph.bundlerPath", "string")

  switch (str) {
    case "":
      return null
    default:
      return str
  }
}

export default function solargraphBundlerPathSetting() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

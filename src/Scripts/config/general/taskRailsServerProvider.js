function reload() {
  nova.workspace.reloadTasks("tommasonegri.rails.tasks.rails")
}

nova.config.onDidChange("tommasonegri.rails.config.general.task.railsServerProvider", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.general.task.railsServerProvider", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.general.task.railsServerProvider", "boolean")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.general.task.railsServerProvider", "string")

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

export default function isTaskRailsServerProviderEnabled() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

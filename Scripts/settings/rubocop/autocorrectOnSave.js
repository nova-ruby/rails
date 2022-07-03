function reload() {
  nova.commands.invoke("tommasonegri.rails.commands.reload")
}

nova.config.onDidChange("tommasonegri.rails.config.rubocop.autocorrect.onSave", reload)
nova.workspace.config.onDidChange("tommasonegri.rails.config.rubocop.autocorrect.onSave", reload)

function getExtensionSetting() {
  return nova.config.get("tommasonegri.rails.config.rubocop.autocorrect.onSave", "string")
}

function getWorkspaceSetting() {
  const str = nova.workspace.config.get("tommasonegri.rails.config.rubocop.autocorrect.onSave", "string")

  switch (str) {
    case "Global Default":
      return null
    case "Layout (recommended)":
      return "Layout (recommended)"
    case "Safe Cops":
      return "Safe Cops"
    case "Safe & Unsafe Cops":
      return "Safe & Unsafe Cops"
    default:
      return null
  }
}

exports.autocorrectOnSave = function() {
  const workspaceConfig = getWorkspaceSetting()
  const extensionConfig = getExtensionSetting()

  return workspaceConfig === null ? extensionConfig : workspaceConfig
}

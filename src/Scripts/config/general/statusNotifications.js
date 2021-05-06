function reload() {
    nova.commands.invoke("tommasonegri.rails.commands.reload");
}

nova.config.onDidChange(
    "tommasonegri.rails.config.general.statusNotifications",
    reload
);
nova.workspace.config.onDidChange(
    "tommasonegri.rails.config.general.statusNotifications",
    reload
);

function getExtensionSetting() {
    return nova.config.get(
        "tommasonegri.rails.config.general.statusNotifications",
        "boolean"
    );
}

function getWorkspaceSetting() {
    const str = nova.workspace.config.get(
        "tommasonegri.rails.config.general.statusNotifications",
        "string"
    );

    switch (str) {
        case "Global Default":
            return null;
        case "Enable":
            return true;
        case "Disable":
            return false;
        default:
            return null;
    }
}

export default function statusNotificationsSetting() {
    const workspaceConfig = getWorkspaceSetting();
    const extensionConfig = getExtensionSetting();

    return workspaceConfig === null ? extensionConfig : workspaceConfig;
}

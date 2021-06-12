function reload() {
    nova.commands.invoke("tommasonegri.rails.commands.reload");
}

nova.config.onDidChange(
    "tommasonegri.rails.config.solargraph.autoformat",
    reload
);
nova.workspace.config.onDidChange(
    "tommasonegri.rails.config.solargraph.autoformat",
    reload
);

function getExtensionSetting() {
    return nova.config.get(
        "tommasonegri.rails.config.solargraph.autoformat",
        "boolean"
    );
}

function getWorkspaceSetting() {
    const str = nova.workspace.config.get(
        "tommasonegri.rails.config.solargraph.autoformat",
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

export default function solargraphAutoFormatSetting() {
    const workspaceConfig = getWorkspaceSetting();
    const extensionConfig = getExtensionSetting();

    return workspaceConfig === null ? extensionConfig : workspaceConfig;
}

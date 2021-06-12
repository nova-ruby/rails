function reload() {
    nova.commands.invoke("tommasonegri.rails.commands.reload");
}

nova.config.onDidChange(
    "tommasonegri.rails.config.solargraph.checkGemVersion",
    reload
);
nova.workspace.config.onDidChange(
    "tommasonegri.rails.config.solargraph.checkGemVersion",
    reload
);

function getExtensionSetting() {
    return nova.config.get(
        "tommasonegri.rails.config.solargraph.checkGemVersion",
        "boolean"
    );
}

function getWorkspaceSetting() {
    const str = nova.workspace.config.get(
        "tommasonegri.rails.config.solargraph.checkGemVersion",
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

export default function solargraphCheckGemVersionSetting() {
    const workspaceConfig = getWorkspaceSetting();
    const extensionConfig = getExtensionSetting();

    return workspaceConfig === null ? extensionConfig : workspaceConfig;
}

let langserver = null;

// Initialize a new Nova Disposable object
const compositeDisposable = new CompositeDisposable();

async function asyncActivate() {
    // Instantiate the Information Sidebar
    const informationView = new InformationView();
    compositeDisposable.add(informationView);

    informationView.status = "Warming up...";

    // If VLS isn't found, install it
    try {
        await dependencyManagement.installWrappedDependencies(
            compositeDisposable,
            {
                console: {
                    log: (...args) => {
                        if (nova.inDevMode()) {
                            console.log("dependencyManagement:", ...args);
                        }
                    },
                    info: (...args) => {
                        if (nova.inDevMode()) {
                            console.info("dependencyManagement:", ...args);
                        }
                    },
                    warn: (...args) => {
                        console.warn("dependencyManagement:", ...args);
                    },
                },
            }
        );
    } catch (err) {
        informationView.status = "Failed to install";
        throw err;
    }

    // Retrieve the VLS path
    const vlsPath = nova.path.join(
        dependencyManagement.getDependencyDirectory(),
        "node_modules",
        ".bin",
        "vls"
    );

    // If VLS hasn't been installed, display an error message and quit
    if (!vlsPath) {
        informationView.status = "VLS not found";

        showNotification(
            "vls-not-found",
            "VLS Not Found",
            true,
            "The Vue Language Server hasn't been installed correctly. You may want to restart the server or open an issue. I'm sorry for this...",
            ["Restart", "Open Issue", "Ignore"],
            (reply) => {
                console.log(reply.actionIdx);
                switch (reply.actionIdx) {
                    case 0:
                        nova.commands.invoke(
                            "tommasonegri.vue.commands.reload"
                        );
                        break;
                    case 1:
                        nova.openURL(
                            "https://github.com/tommasongr/nova-vue/issues"
                        );
                        break;
                    case 2:
                        break;
                }
            }
        );

        return;
    } else {
        if (nova.inDevMode()) {
            console.info("Using VLS at:", vlsPath);
        }
    }

    // Instantiate the Vue Language Server
    var serverOptions = {
        path: vlsPath,
    };

    var clientOptions = {
        // The set of document syntaxes for which the server is valid
        syntaxes: ["ruby"],
        initializationOptions: {
            config: {
                vetur: {
                    completion: {
                        autoImport: isCompletionAutoImportEnabled(),
                        tagCasing: isCompletionTagCasingEnabled(),
                    },
                    languageFeatures: {
                        codeActions: isLanguageFeaturesCodeActionsEnabled(),
                        updateImportOnFileMove: isLanguageFeaturesUpdateImportOnFileMoveEnabled(),
                    },
                    // Disabled by default for preventing xxx errors to show up
                    validation: {
                        interpolation: isValidationInterpolationEnabled(),
                        script: isValidationScriptEnabled(),
                        style: isValidationStyleEnabled(),
                        template: isValidationTemplateEnabled(),
                        templateProps: isValidationTemplatePropsEnabled(),
                    },
                    experimental: {
                        templateInterpolationService: isExperimentalTemplateInterpolationServiceEnabled(),
                    },
                    dev: {
                        logLevel: isDevLogLevelEnabled(),
                    },
                    format: {
                        enable: false,
                    },
                    ignoreProjectWarning: isMiscIgnoreProjectWarningEnabled(),
                    useWorkspaceDependencies: isMiscUseWorkspaceDependenciesEnabled(),
                },
            },
        },
    };

    langserver = new LanguageClient(
        "tommasonegri.ruby",
        "Ruby Language Server",
        serverOptions,
        clientOptions
    );

    // Add an event listener for when Vue Language Server stops
    compositeDisposable.add(
        langserver.onDidStop((err) => {
            informationView.status = "Stopped";

            // Display an error message and a restart button if the server stopped unexpectedly
            if (err) {
                let message = "Vue Language Server stopped unexpectedly";
                message += `:\n\n${err.toString()}`;
                message +=
                    "\n\nPlease report this, along with any output in the Extension Console.";

                nova.workspace.showActionPanel(
                    message,
                    {
                        buttons: ["Restart", "Ignore"],
                    },
                    (index) => {
                        if (index == 0) {
                            nova.commands.invoke(
                                "tommasonegri.vue.commands.reload"
                            );
                        }
                    }
                );
            }
        })
    );

    langserver.start();

    // Retrieve the running VLS version to display in the Information Sidebar
    getVlsVersion()
        .then((version) => {
            console.log("VLS Version", version);
            informationView.vlsVersion = version;
        })
        .catch((err) => {
            console.log("No VLS Version:", err);
        });

    informationView.status = "Running";

    // Used for the when clause of the start/stop server command
    nova.workspace.config.set("tommasonegri.vue.serverRunning", true);
}

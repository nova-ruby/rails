import registerCommands from "./registerCommands";
import RailsInformationView from "./sidebar/RailsInformationView";
import RailsTaskProvider from "./other/RailsTaskProvider";
import VersionChecker from "./other/VersionChecker";

import { isRailsInProject, showNotification } from "./helpers";

// import RubyLanguageServer from "./other/RubyLanguageServer";

nova.config.set(`${nova.extension.identifier}.extension.version`, "0.5");
const versionChecker = new VersionChecker();
versionChecker.check();

//********* REGISTRATIONS *********//

// Register Nova commands
registerCommands();

// Register a Nova command for reloading the Sidebar About Rails View
// thanks to an event Emitter
const aboutRailsSidebarReloadEmitter = new Emitter();
nova.commands.register(
    "tommasonegri.rails.commands.sidebar.aboutRails.reload",
    () => {
        aboutRailsSidebarReloadEmitter.emit("reload");
    }
);

nova.commands.register("tommasonegri.rails.commands.reload", () => {
    reload();
});

// Register a Nova task assistant
nova.assistants.registerTaskAssistant(new RailsTaskProvider(), {
    identifier: "tommasonegri.rails.tasks.rails",
    name: "Ruby on Rails",
});

//********* INITIALIZATION *********//

// let langserver;

// Initialize a new Nova Disposable object
const compositeDisposable = new CompositeDisposable();

async function asyncActivate() {
    if (isRailsInProject()) {
        showNotification(
            "rails-detected",
            "Ruby on Rails Found in Project 🎉",
            false,
            "Specific features will be enabled..."
        );
    }

    const railsInformationView = new RailsInformationView(
        aboutRailsSidebarReloadEmitter
    );
    compositeDisposable.add(railsInformationView);

    // langserver = new RubyLanguageServer();
}

export function activate() {
    console.log("Activating Ruby Language Server...");

    return asyncActivate()
        .then(() => {
            console.log("Hello from Ruby on Rails 💎");
        })
        .catch((err) => {
            console.error("Failed to activate with error:", err);
            nova.workspace.showErrorMessage(err);
        });
}

export function deactivate() {
    // if (langserver) {
    //     langserver.deactivate();
    //     langserver = null;
    // }

    compositeDisposable.dispose();

    console.log("Goodbye from Ruby on Rails 👋");
}

async function reload() {
    deactivate();

    console.log("Reloading Ruby Language Server...");
    showNotification(
        "rails-reload",
        "Ruby on Rails is Reloading...",
        false,
        "Don't worry, it won't take a while."
    );

    await asyncActivate()
        .then(() => {
            console.log("Hello from Ruby on Rails 💎");
        })
        .catch((err) => {
            console.error("Failed to activate with error:", err);
            nova.workspace.showErrorMessage(err);
        });
}

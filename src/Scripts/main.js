import registerCommands from "./registerCommands";
import RailsInformationView from "./sidebar/RailsInformationView";
import RailsTaskProvider from "./RailsTaskProvider";

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

// Initialize a new Nova Disposable object
const compositeDisposable = new CompositeDisposable();

async function asyncActivate() {
    const railsInformationView = new RailsInformationView(
        aboutRailsSidebarReloadEmitter
    );
    compositeDisposable.add(railsInformationView);
}

export function activate() {
    console.log("Activating Ruby Language Server...");

    return asyncActivate()
        .then(() => {
            console.log("Hello from Rails 💎");
        })
        .catch((err) => {
            console.error("Failed to activate with error:", err);
            nova.workspace.showErrorMessage(err);
        });
}

export function deactivate() {
    // Clean up state before the extension is deactivated
    //     if (langserver) {
    //         langserver.stop();
    //         langserver = null;
    //
    //         // Used for the when clause of the start/stop server command
    //         nova.workspace.config.set("tommasonegri.vue.serverRunning", false);
    //     }
    //

    compositeDisposable.dispose();

    console.log("Goodbye from Ruby 👋");
}

async function reload() {
    deactivate();

    console.log("Reloading Ruby Language Server...");
    //     showNotification(
    //         "vue-reload",
    //         "Vue is Reloading...",
    //         false,
    //         "Don't worry, it won't take a while."
    //     );
    //

    await asyncActivate()
        .then(() => {
            console.log("Hello from Rails 💎");
        })
        .catch((err) => {
            console.error("Failed to activate with error:", err);
            nova.workspace.showErrorMessage(err);
        });
}

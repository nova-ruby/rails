import { erbTagSwitcher } from "./commands/erbTagSwitcher";
import { railsOpenAlternateFile } from "./commands/openAlternateFile";
import RailsMigrations from "./commands/RailsMigrations";

import RailsDocumentation from "./commands/RailsDocumentation";

import RailsInformationView from "./sidebar/RailsInformationView";

import RailsTaskProvider from "./RailsTaskProvider";

nova.commands.register("tommasonegri.rails.erb.tagSwitcher", async (editor) => {
    erbTagSwitcher(editor);
});

nova.commands.register(
    "tommasonegri.rails.openLatestMigration",
    (workspace) => {
        const railsMigrations = new RailsMigrations();
        railsMigrations.openLatestMigration();
    }
);

nova.commands.register("tommasonegri.rails.listMigrations", (workspace) => {
    const railsMigrations = new RailsMigrations();
    railsMigrations.listMigrations();
});

nova.commands.register("rails-navigation.openAlternateFile", (workspace) => {
    railsOpenAlternateFile();
});

// Register Nova commands for opening Documentations
nova.commands.register(
    "tommasonegri.rails.documentation.openRailsGuides",
    () => {
        const railsDocumentation = new RailsDocumentation();
        railsDocumentation.openDocs("https://guides.rubyonrails.org");
    }
);
nova.commands.register("tommasonegri.rails.documentation.openRailsAPI", () => {
    const railsDocumentation = new RailsDocumentation();
    railsDocumentation.openDocs("https://api.rubyonrails.org");
});
nova.commands.register(
    "tommasonegri.rails.documentation.openRailsForum",
    () => {
        const railsDocumentation = new RailsDocumentation();
        railsDocumentation.openDocs("https://discuss.rubyonrails.org");
    }
);
nova.commands.register(
    "tommasonegri.rails.documentation.openTurboReference",
    () => {
        const railsDocumentation = new RailsDocumentation();
        railsDocumentation.openDocs(
            "https://turbo.hotwire.dev/reference/drive"
        );
    }
);
nova.commands.register(
    "tommasonegri.rails.documentation.openStimulusReference",
    () => {
        const railsDocumentation = new RailsDocumentation();
        railsDocumentation.openDocs(
            "https://stimulus.hotwire.dev/reference/controllers"
        );
    }
);

// Register a Nova command for Searching the Documentations with the Command Palette
nova.commands.register("tommasonegri.rails.documentation.search", () => {
    const railsDocumentation = new RailsDocumentation();
    railsDocumentation.searchDocs();
});

// Register a Nova command for realoading the Sidebar About Rails View
const aboutRailsSidebarReloadEmitter = new Emitter();
nova.commands.register(
    "tommasonegri.rails.commands.sidebar.aboutRails.reload",
    () => {
        aboutRailsSidebarReloadEmitter.emit("reload");
    }
);

// Register a Nova task assistant
nova.assistants.registerTaskAssistant(new RailsTaskProvider(), {
    identifier: "tommasonegri.rails.tasks.rails",
    name: "Ruby on Rails",
});

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

    await asyncActivate();
}

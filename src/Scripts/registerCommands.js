import { erbTagSwitcher } from "./commands/erbTagSwitcher";
import { railsOpenAlternateFile } from "./commands/openAlternateFile";
import RailsMigrations from "./commands/RailsMigrations";
import RailsDocumentation from "./commands/RailsDocumentation";

export default function registerCommands() {
    nova.commands.register(
        "tommasonegri.rails.erb.tagSwitcher",
        async (editor) => {
            erbTagSwitcher(editor);
        }
    );

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

    nova.commands.register(
        "rails-navigation.openAlternateFile",
        (workspace) => {
            railsOpenAlternateFile();
        }
    );

    // Register Nova commands for opening Documentations
    nova.commands.register(
        "tommasonegri.rails.documentation.openRailsGuides",
        () => {
            const railsDocumentation = new RailsDocumentation();
            railsDocumentation.openDocs("https://guides.rubyonrails.org");
        }
    );
    nova.commands.register(
        "tommasonegri.rails.documentation.openRailsAPI",
        () => {
            const railsDocumentation = new RailsDocumentation();
            railsDocumentation.openDocs("https://api.rubyonrails.org");
        }
    );
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

    // Register a Nova command for Searching the Documentation with the Command Palette
    nova.commands.register("tommasonegri.rails.documentation.search", () => {
        const railsDocumentation = new RailsDocumentation();
        railsDocumentation.searchDocs();
    });
}

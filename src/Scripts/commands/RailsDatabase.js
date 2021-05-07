import { isRailsInProject, showNotification } from "../helpers";

export default class RailsDatabase {
    constructor() {}

    async migrate() {
        if (!isRailsInProject()) {
            return;
        }

        const process = new Process("usr/bin/env", {
            cwd: nova.workspace.path,
            args: ["rails", "db:migrate"],
            stdio: ["ignore", "pipe", "ignore"],
        });
        let str = "";

        process.onStdout((output) => {
            str += output.trim();
        });

        process.onDidExit((status) => {
            console.log(status);

            if (status === 0 && str > 0) {
                console.log("Migration applied");

                showNotification(
                    "rails-database-migrated",
                    "Migration applied",
                    false,
                    "The latest migration has been applied correctly."
                );
            } else if (status === 0) {
                console.log("Nothing to migrate");

                showNotification(
                    "rails-database-no-migrated",
                    "Nothing new to migrate",
                    false,
                    "All the migrations are already applied."
                );
            } else {
                console.error("Something went wrong with migration");
            }
        });

        process.start();
    }
}

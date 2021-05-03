import { isRailsProject } from "./helpers";
import isTaskRailsServerProviderEnabled from "./config/general/taskRailsServerProvider";

export default class RailsTaskProvider {
    constructor() {
        this.isRailsProject = false;

        this.checkIsRailsProject();
    }

    async provideTasks() {
        if (!isTaskRailsServerProviderEnabled()) {
            return [];
        }

        await this.checkIsRailsProject();

        if (!this.isRailsProject) {
            return [];
        }

        let task = new Task("Rails Server");

        task.setAction(
            Task.Run,
            new TaskProcessAction("/usr/bin/env", {
                args: ["rails", "server"],
                env: {},
            })
        );

        return [task];
    }

    async checkIsRailsProject() {
        await isRailsProject()
            .then((response) => {
                this.isRailsProject = response;
            })
            .catch((err) => {
                console.error("Rails Task Provider says:", err);
            });
    }
}

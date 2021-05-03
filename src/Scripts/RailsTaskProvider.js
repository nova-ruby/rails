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

        // TODO: Provide the functionality for starting the rails server
        task.setAction(
            Task.Run,
            new TaskProcessAction("/usr/bin/say", {
                args: ["I'm Running!"],
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

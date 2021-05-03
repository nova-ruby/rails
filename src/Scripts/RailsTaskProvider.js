import isTaskRailsServerProviderEnabled from "./config/general/taskRailsServerProvider";

export default class RailsTaskProvider {
    constructor() {}

    provideTasks() {
        // TODO: Check if the workspace contains a Rails project
        if (!isTaskRailsServerProviderEnabled()) {
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
}

import { isRailsInProject } from "../helpers";
import isTaskRailsServerProviderEnabled from "../config/general/taskRailsServerProvider";

export default class RailsTaskProvider {
    constructor() {}

    provideTasks() {
        if (!isTaskRailsServerProviderEnabled()) {
            return [];
        }

        if (!isRailsInProject()) {
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
}

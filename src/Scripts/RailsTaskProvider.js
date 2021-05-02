export default class RailsTaskProvider {
    constructor() {}

    provideTasks() {
        let task = new Task("Rails Server");

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

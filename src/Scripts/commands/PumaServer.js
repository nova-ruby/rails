export default class PumaServer {
    constructor() {}

    kill() {
        const process = new Process("usr/bin/env", {
            args: ["pkill", "-9", "-f", "rb-fsevent|rails|spring|puma"],
            stdio: ["ignore", "ignore", "ignore"],
        });

        process.start();
    }
}

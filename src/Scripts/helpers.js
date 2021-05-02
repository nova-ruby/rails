// export async function isRailsProject() {
//     return new Promise((resolve, reject) => {
//         if (
//             nova.fs.stat(nova.path.join(nova.workspace.path, "db", "migrate"))
//         ) {
//             resolve(true);
//         } else {
//             reject(false);
//         }
//     });
// }

export async function isRailsProject() {
    return new Promise((resolve, reject) => {
        const process = new Process("/usr/bin/env", {
            cwd: nova.workspace.path,
            args: ["rails", "about"],
            stdio: ["ignore", "pipe", "ignore"],
            shell: true,
        });
        let str = "";
        let strings = [];

        process.onStdout((output) => {
            str += output;
        });

        process.onDidExit((status) => {
            strings = str.match(/[^\r\n]+/g);

            if (
                status === 0 &&
                strings[0] == "About your application's environment"
            ) {
                resolve(strings);
            } else {
                reject(status);
            }
        });

        process.start();
    });
}

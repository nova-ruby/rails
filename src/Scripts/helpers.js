export function isRailsProject() {
    const gemfilePath = nova.workspace.path + "/Gemfile";

    if (!nova.fs.access(gemfilePath, nova.fs.F_OK)) {
        return false;
    }

    const gemfile = nova.fs.open(gemfilePath).read();

    if (gemfile.indexOf("gem 'rails'") !== -1) {
        return true;
    } else {
        return false;
    }
}

export async function aboutRails() {
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

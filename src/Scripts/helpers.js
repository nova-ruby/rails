import statusNotificationsSetting from "./config/general/statusNotifications";

/**
 * @param {string} id Notification ID
 * @param {string} title Notification Title
 * @param {boolean} showAlways Whether to override the user notifications settings
 * @param {string=} body Notification Body
 * @param {[string]=} actions Notification Action
 * @param {function(any)=} handler Notification Handler
 */
export function showNotification(
    id,
    title,
    showAlways,
    body,
    actions,
    handler
) {
    if (showAlways || statusNotificationsSetting()) {
        let request = new NotificationRequest(id);

        request.title = title;
        if (body) {
            request.body = body;
        }
        if (actions) {
            request.actions = actions;
        }

        nova.notifications
            .add(request)
            .then((reply) => {
                if (handler) {
                    handler(reply);
                }
            })
            .catch((err) => console.error(err, err.stack));
    }
}

export function isRailsInProject() {
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
            // Split each line of the output in the strings array
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

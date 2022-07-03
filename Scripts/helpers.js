const SETTINGS = require("./settings")

/**
 * @param {string} id Notification ID
 * @param {string} title Notification Title
 * @param {boolean} showAlways Whether to override the user notifications settings
 * @param {string=} body Notification Body
 * @param {[string]=} actions Notification Action
 * @param {function(any)=} handler Notification Handler
 */
exports.showNotification = function(id, title, showAlways, body, actions, handler) {
  if (showAlways || SETTINGS.statusNotifications()) {
    let request = new NotificationRequest(id)

    request.title = title
    if (body) request.body = body
    if (actions) request.actions = actions

    nova.notifications
      .add(request)
      .then((reply) => {
        if (handler) {
          handler(reply)
        }
      })
      .catch((err) => console.error(err, err.stack))
  }
}

exports.isRailsInProject = function() {
  let gemfilePath

  if (nova.fs.access(nova.workspace.path + '/Gemfile', nova.fs.F_OK)) {
    gemfilePath = nova.workspace.path + '/Gemfile'
  } else if (nova.fs.access(nova.workspace.path + '/gems.rb', nova.fs.F_OK)) {
    gemfilePath = nova.workspace.path + '/gems.rb'
  } else {
    return false
  }

  const gemfile = nova.fs.open(gemfilePath).read()

  if (gemfile.indexOf("gem 'rails'") !== -1 || gemfile.indexOf('gem "rails"') !== -1) {
    return true
  } else {
    return false
  }
}

exports.aboutRails = async function() {
  if (!nova.workspace.railsDetected) return []

  return new Promise((resolve, reject) => {
    const process = new Process('/usr/bin/env', {
      cwd: nova.workspace.path,
      args: ['rails', 'about'],
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    })
    let str = ''
    let err = ''
    let strings = []

    process.onStdout((output) => {
      str += output
    })

    process.onStderr((error_output) => {
      err += error_output
    })

    process.onDidExit((status) => {
      if (status == 1){ return reject(err) }
      if (str.length == 0) { return reject("rails about is empty") }

      // Split each line of the output in the strings array
      strings = str.match(/[^\r\n]+/g)

      if (status === 0 && strings[0] == "About your application's environment") {
        resolve(strings)
      } else {
        reject(status)
      }
    })

    process.start()
  })
}

exports.railsNotes = async function() {
  if (!nova.workspace.railsDetected) return []

  return new Promise((resolve, reject) => {
    const process = new Process('/usr/bin/env', {
      cwd: nova.workspace.path,
      args: ['rails', 'notes'],
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    })
    let str = ''
    let err = ''
    let strings = []

    process.onStdout((output) => {
      str += output
    })

    process.onStderr((error_output) => {
      err += error_output
    })

    process.onDidExit((status) => {
      if (status == 1){ return reject(err) }
      if (str.length == 0) { return reject("rails notes is empty") }

      const notes = []
      // Split each line of the output in the strings array
      strings = str.match(/[^\r\n]+/g)

      strings.forEach((str, index) => {
        const possibleFilePath = str.slice(0, -1)

        if (nova.fs.access(`${nova.workspace.path}/${possibleFilePath}`, nova.fs.F_OK)) {
          const notesGroup = {
            filename: possibleFilePath.split("/").pop(),
            path: possibleFilePath,
            notes: []
          }
          notes.push(notesGroup)
        } else {
          const noteParts = /\s{2}\*\s\[\s*(\d+)\]\s\[(.*)\]\s(.+)/.exec(str)

          const note = {
            line: noteParts[1],
            annotation: noteParts[2],
            comment: noteParts[3]
          }

          notes[notes.length - 1].notes.push(note)
        }
      })

      if (status === 0) {
        resolve(notes)
      } else {
        reject(status)
      }
    })

    process.start()
  })
}

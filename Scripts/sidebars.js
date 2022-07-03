const { NotesView } = require("./sidebars/NotesView")
const { AboutView } = require("./sidebars/AboutView")

exports.RailsSidebar = class RailsSidebar {
  constructor() {
    this.start()
  }

  deactivate() {
    this.stop()
  }

  start() {
    if (this.notesView) {
      this.notesView.deactivate()
      nova.subscriptions.remove(this.notesView)
    }
    if (this.aboutView) {
      this.aboutView.deactivate()
      nova.subscriptions.remove(this.aboutView)
    }

    this.notesView = new NotesView()
    nova.subscriptions.add(this.notesView)

    this.aboutView = new AboutView()
    nova.subscriptions.add(this.aboutView)
  }

  stop() {
    if (this.notesView) {
      this.notesView.deactivate()
      nova.subscriptions.remove(this.notesView)
      this.notesView = null
    }
    if (this.aboutView) {
      this.aboutView.deactivate()
      nova.subscriptions.remove(this.aboutView)
      this.aboutView = null
    }
  }
}

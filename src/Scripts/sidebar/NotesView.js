import { railsNotes } from "../helpers"

export default class NotesView {
  constructor() {
    this.tree = new TreeView("tommasonegri.rails.sidebar.notes", {
      dataProvider: this
    })
    this.rootItems = []

    this.fetchNotes()

    this.getChildren = this.getChildren.bind(this)
    this.getTreeItem = this.getTreeItem.bind(this)

    this.registerCommands()
  }

  reload() {
    this.tree.reload()
  }

  dispose() {
    this.tree.dispose()
  }

  // Private

  getChildren(element) {
    if (!this.rootItems?.length > 0) return []

    if (!element) {
        return this.rootItems
    } else {
        return element.children
    }
  }

  getParent(element) {
    return element.parent
  }

  getTreeItem(element) {
    let item = new TreeItem(element.name)

    item.collapsibleState = element.collapsibleState
    item.command          = element.command
    item.color            = element.color
    item.contextValue     = element.contextValue
    item.descriptiveText  = element.descriptiveText
    item.identifier       = element.identifier
    item.image            = element.image
    item.path             = element.path
    item.tooltip          = element.tooltip

    item.line             = element.line

    return item
  }

  fetchNotes() {
    const rootItems = []

    railsNotes()
      .then(response => {
        response.forEach(notesGroup => {
          const element = new NotesItem(notesGroup.filename)

          element.collapsibleState = TreeItemCollapsibleState.Expanded
          element.descriptiveText  = `(${notesGroup.notes.length})`
          element.path             = notesGroup.path
          element.tooltip          = notesGroup.path

          notesGroup.notes.forEach(note => {
            const n = new NotesItem(note.annotation)

            n.descriptiveText = note.comment
            n.line            = note.line

            element.addChild(n)
          })

          rootItems.push(element)
        })

        this.rootItems = rootItems

        this.reload()
      })
      .catch(err => {
        console.error(err)
      })
  }

  registerCommands() {
    nova.commands.register("tommasonegri.rails.commands.sidebar.notes.openFile", () => {
      let selection = this.tree.selection[0]

      let path
      if (selection.path) {
        path = `${nova.workspace.path}/${selection.path}`
      } else {
        path = `${nova.workspace.path}/${selection.parent.path}`
      }

      nova.workspace.openFile(path, {
        line: +selection.line
      })
    })

    nova.commands.register("tommasonegri.rails.commands.sidebar.notes.reload", () => {
      this.fetchNotes()
    })
  }
}

class NotesItem {
  constructor(name) {
    this.name             = name
    this.collapsibleState = TreeItemCollapsibleState.None
    this.command          = "tommasonegri.rails.commands.sidebar.notes.openFile"
    this.color            = null
    this.contextValue     = null
    this.descriptiveText  = ""
    this.identifier       = null
    this.image            = null
    this.path             = null
    this.tooltip          = ""

    this.line             = null

    this.children         = []
    this.parent           = null
  }

  addChild(element) {
    element.parent = this
    this.children  = [...this.children, element]
  }
}

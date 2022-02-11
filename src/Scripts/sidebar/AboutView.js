import { aboutRails } from "../helpers"

export default class AboutView {
  constructor() {
    this.tree = new TreeView("tommasonegri.rails.sidebar.about", {
      dataProvider: this
    })

    this._railsVersionElement = {
      title: "Rails Version",
      value: "...",
      identifier: "railsVersion",
    }
    this._rubyVersionElement = {
      title: "Ruby Version",
      value: "...",
      identifier: "rubyVersion",
    }
    this._rubyGemsVersionElement = {
      title: "RubyGems Version",
      value: "...",
      identifier: "rubyGemsVersion",
    }
    this._rackVersionElement = {
      title: "Rack Version",
      value: "...",
      identifier: "rackVersion",
    }
    this._applicationRootElement = {
      title: "Application Root",
      value: "...",
      identifier: "applicationRoot",
    }
    this._environmentElement = {
      title: "Environment",
      value: "...",
      identifier: "environment",
    }
    this._databaseAdapterElement = {
      title: "Database Adapter",
      value: "...",
      identifier: "databaseAdapter",
    }
    this._databaseSchemaVersionElement = {
      title: "Database Schema Version",
      value: "...",
      identifier: "databaseSchemaVersion",
    }

    this.fetchAbout()

    this.getChildren = this.getChildren.bind(this)
    this.getTreeItem = this.getTreeItem.bind(this)

    nova.commands.register("tommasonegri.rails.commands.sidebar.aboutRails.reload", () => {
      this.fetchAbout()
    })
  }

  reload() {
    this.tree.reload()
  }

  dispose() {
    this.tree.dispose()
  }

  // Private

  getChildren(element) {
    if (element == null && this.isRailsDetected) {
      return [
        this._railsVersionElement,
        this._rubyVersionElement,
        this._rubyGemsVersionElement,
        this._rackVersionElement,
        this._applicationRootElement,
        this._environmentElement,
        this._databaseAdapterElement,
        this._databaseSchemaVersionElement,
      ]
    }
    return []
  }

  getTreeItem(element) {
    const item = new TreeItem(element.title)

    item.collapsibleState = TreeItemCollapsibleState.None
    item.descriptiveText  = element.value
    item.identifier       = element.identifier
    item.tooltip          = element.tooltip

    return item
  }

  fetchAbout() {
    aboutRails()
      .then(response => {
        if (!nova.workspace.railsDetected) return

        this.isRailsDetected = true

        const railsVersion          = response[1].split(" ").pop()
        const rubyVersion           = response[2].slice(12).trim()
        const rubyGemsVersion       = response[3].split(" ").pop()
        const rackVersion           = response[4].split(" ").pop()
        const applicationRoot       = response[6].split(" ").pop()
        const environment           = response[7].split(" ").pop()
        const databaseAdapter       = response[8].split(" ").pop()
        const databaseSchemaVersion = response[9].split(" ").pop()

        this._railsVersionElement.value          = railsVersion
        this._rubyVersionElement.value           = rubyVersion
        this._rubyGemsVersionElement.value       = rubyGemsVersion
        this._rackVersionElement.value           = rackVersion
        this._applicationRootElement.value       = applicationRoot
        this._environmentElement.value           = environment
        this._databaseAdapterElement.value       = databaseAdapter
        this._databaseSchemaVersionElement.value = databaseSchemaVersion

        this.reload()
      })
      .catch(err => {
        console.error(err)
      })
  }
}

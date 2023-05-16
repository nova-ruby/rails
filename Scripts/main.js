const COMMANDS                               = require("./commands")
const SETTINGS                               = require("./settings")
const { VersionChecker }                     = require("./other/VersionChecker")
const { RailsSidebar }                       = require("./sidebars")
const { isRailsInProject, showNotification } = require("./helpers")

const versionChecker = new VersionChecker()
versionChecker.check()

let sidebar    = null

exports.activate = function() {
  if (nova.inDevMode()) console.log("Hello from Ruby on Rails 🚂 (DEV mode)")
  else console.log("Hello from Ruby on Rails 🚂")

  if (isRailsInProject()) {
    nova.workspace.railsDetected = true

    showNotification(
      "rails-detected",
      "Ruby on Rails Found in Project 🚂",
      false,
      "Specific features will be enabled..."
    )
  } else {
    nova.workspace.railsDetected = false
  }

  sidebar = new RailsSidebar()
}

exports.deactivate = function() {
  // Clean up state before the extension is deactivated
  if (sidebar) {
    sidebar.deactivate()
    sidebar = null
  }

  console.log("Goodbye from Ruby on Rails 🚂")
}

function reload() {
  exports.deactivate()
  exports.activate()
}

// Register Nova commands

nova.commands.register("tommasonegri.rails.commands.reload", reload)

nova.commands.register("tommasonegri.rails.commands.erb.tagSwitcher", async (editor) => {
  COMMANDS.erbTagSwitcher(editor)
})

nova.commands.register("tommasonegri.rails.commands.migrations.openLatest", () => {
  const railsMigrations = new COMMANDS.RailsMigrations()
  railsMigrations.openLatestMigration()
})

nova.commands.register("tommasonegri.rails.commands.migrations.list", () => {
  const railsMigrations = new COMMANDS.RailsMigrations()
  railsMigrations.listMigrations()
})

nova.commands.register("tommasonegri.rails.commands.openAlternateFile", () => {
  const railsAlternateFile = new COMMANDS.RailsAlternateFile()
  railsAlternateFile.alternate()
})

// Register Nova commands for opening Documentations
nova.commands.register("tommasonegri.rails.commands.documentation.openRailsGuides", () => {
  const railsDocumentation = new COMMANDS.RailsDocumentation()
  railsDocumentation.openDocs("https://guides.rubyonrails.org")
})
nova.commands.register("tommasonegri.rails.commands.documentation.openRailsAPI", () => {
  const railsDocumentation = new COMMANDS.RailsDocumentation()
  railsDocumentation.openDocs("https://api.rubyonrails.org")
})
nova.commands.register("tommasonegri.rails.commands.documentation.openRailsForum", () => {
  const railsDocumentation = new COMMANDS.RailsDocumentation()
  railsDocumentation.openDocs("https://discuss.rubyonrails.org")
})
nova.commands.register("tommasonegri.rails.commands.documentation.openTurboReference", () => {
  const railsDocumentation = new COMMANDS.RailsDocumentation()
  railsDocumentation.openDocs("https://turbo.hotwired.dev/reference/drive")
})
nova.commands.register("tommasonegri.rails.commands.documentation.openStimulusReference", () => {
  const railsDocumentation = new COMMANDS.RailsDocumentation()
  railsDocumentation.openDocs("https://stimulus.hotwired.dev/reference/controllers")
})
nova.commands.register("tommasonegri.rails.commands.documentation.openExtensionWiki", () => {
    const railsDocumentation = new COMMANDS.RailsDocumentation()
    railsDocumentation.openDocs("https://github.com/nova-ruby/rails/wiki")
})

// Register a Nova command for Searching the Documentation with the Command Palette
nova.commands.register("tommasonegri.rails.commands.documentation.search", () => {
  const railsDocumentation = new COMMANDS.RailsDocumentation()
  railsDocumentation.searchDocs()
})

// Register a Nova command for Killing Puma Server.
// Useful for recovering from a not properly stopped server
// for example after a Nova crash.
nova.commands.register("tommasonegri.rails.commands.pumaServer.kill", () => {
  const railsServer = new COMMANDS.RailsServer()
  railsServer.kill()
})

// Register a Nova command for Applying the latest Migration
nova.commands.register("tommasonegri.rails.commands.migrations.migrate", () => {
  const railsMigrations = new COMMANDS.RailsMigrations()
  railsMigrations.migrate()
})

// Register a Nova command for Applying a Rollback
nova.commands.register("tommasonegri.rails.commands.migrations.rollback", () => {
  const railsMigrations = new COMMANDS.RailsMigrations()
  railsMigrations.rollback()
})

// Register a Nova command for Updating Stimulus manifest
nova.commands.register("tommasonegri.rails.commands.stimulus.manifest.update", () => {
  const railsStimulus = new COMMANDS.RailsStimulus()
  railsStimulus.updateManifest()
})

// Register Nova commands for showing project infos
nova.commands.register("tommasonegri.rails.commands.info.routes", () => {
  const railsInfo = new COMMANDS.RailsInfo()
  railsInfo.showRoutes()
})
nova.commands.register("tommasonegri.rails.commands.info.properties", () => {
  const railsInfo = new COMMANDS.RailsInfo()
  railsInfo.showProperties()
})

// Register Nova commands for pinning and unpinning packages from importmap
nova.commands.register("tommasonegri.rails.commands.importmap.pin", () => {
  const railsImportmap = new COMMANDS.RailsImportmap()
  railsImportmap.pin()
})
nova.commands.register("tommasonegri.rails.commands.importmap.unpin", () => {
  const railsImportmap = new COMMANDS.RailsImportmap()
  railsImportmap.unpin()
})

// Register Nova command for showing related files
nova.commands.register("tommasonegri.rails.commands.showRelatedFiles", (editor) => {
  const relatedFiles = new COMMANDS.RailsRelatedFiles()
  relatedFiles.run(editor.document.path)
})

import { erbTagSwitcher } from './commands/erbTagSwitcher'
import RailsAlternateFile from './commands/RailsAlternateFile'
import RailsMigrations from './commands/RailsMigrations'
import RailsDocumentation from './commands/RailsDocumentation'
import RailsServer from './commands/RailsServer'
import RailsStimulus from './commands/RailsStimulus'
import RailsInfo from './commands/RailsInfo'
import RailsImportmap from './commands/RailsImportmap'

export default function registerCommands() {
  nova.commands.register('tommasonegri.rails.commands.erb.tagSwitcher', async (editor) => {
    erbTagSwitcher(editor)
  })

  nova.commands.register('tommasonegri.rails.commands.migrations.openLatest', () => {
    const railsMigrations = new RailsMigrations()
    railsMigrations.openLatestMigration()
  })

  nova.commands.register('tommasonegri.rails.commands.migrations.list', () => {
    const railsMigrations = new RailsMigrations()
    railsMigrations.listMigrations()
  })

  nova.commands.register('tommasonegri.rails.commands.openAlternateFile', () => {
    const railsAlternateFile = new RailsAlternateFile()
    railsAlternateFile.alternate()
  })

  // Register Nova commands for opening Documentations
  nova.commands.register('tommasonegri.rails.commands.documentation.openRailsGuides', () => {
    const railsDocumentation = new RailsDocumentation()
    railsDocumentation.openDocs('https://guides.rubyonrails.org')
  })
  nova.commands.register('tommasonegri.rails.commands.documentation.openRailsAPI', () => {
    const railsDocumentation = new RailsDocumentation()
    railsDocumentation.openDocs('https://api.rubyonrails.org')
  })
  nova.commands.register('tommasonegri.rails.commands.documentation.openRailsForum', () => {
    const railsDocumentation = new RailsDocumentation()
    railsDocumentation.openDocs('https://discuss.rubyonrails.org')
  })
  nova.commands.register('tommasonegri.rails.commands.documentation.openTurboReference', () => {
    const railsDocumentation = new RailsDocumentation()
    railsDocumentation.openDocs('https://turbo.hotwire.dev/reference/drive')
  })
  nova.commands.register('tommasonegri.rails.commands.documentation.openStimulusReference', () => {
    const railsDocumentation = new RailsDocumentation()
    railsDocumentation.openDocs('https://stimulus.hotwire.dev/reference/controllers')
  })
  nova.commands.register('tommasonegri.rails.commands.documentation.openExtensionWiki', () => {
      const railsDocumentation = new RailsDocumentation()
      railsDocumentation.openDocs('https://github.com/tommasongr/nova-rails/wiki')
  })

  // Register a Nova command for Searching the Documentation with the Command Palette
  nova.commands.register('tommasonegri.rails.commands.documentation.search', () => {
    const railsDocumentation = new RailsDocumentation()
    railsDocumentation.searchDocs()
  })

  // Register a Nova command for Killing Puma Server.
  // Useful for recovering from a not properly stopped server
  // for example after a Nova crash.
  nova.commands.register('tommasonegri.rails.commands.pumaServer.kill', () => {
    const railsServer = new RailsServer()
    railsServer.kill()
  })

  // Register a Nova command for Applying the latest Migration
  nova.commands.register('tommasonegri.rails.commands.migrations.migrate', () => {
    const railsMigrations = new RailsMigrations()
    railsMigrations.migrate()
  })

  // Register a Nova command for Applying a Rollback
  nova.commands.register('tommasonegri.rails.commands.migrations.rollback', () => {
    const railsMigrations = new RailsMigrations()
    railsMigrations.rollback()
  })

  // Register a Nova command for Updating Stimulus manifest
  nova.commands.register('tommasonegri.rails.commands.stimulus.manifest.update', () => {
    const railsStimulus = new RailsStimulus()
    railsStimulus.updateManifest()
  })

  // Register Nova commands for showing project infos
  nova.commands.register('tommasonegri.rails.commands.info.routes', () => {
    const railsInfo = new RailsInfo()
    railsInfo.showRoutes()
  })
  nova.commands.register('tommasonegri.rails.commands.info.properties', () => {
    const railsInfo = new RailsInfo()
    railsInfo.showProperties()
  })

  // Register Nova commands for pinning and unpinning packages from importmap
  nova.commands.register('tommasonegri.rails.commands.importmap.pin', () => {
    const railsImportmap = new RailsImportmap()
    railsImportmap.pin()
  })
  nova.commands.register('tommasonegri.rails.commands.importmap.unpin', () => {
    const railsImportmap = new RailsImportmap()
    railsImportmap.unpin()
  })
}

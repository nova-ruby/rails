const { erbTagSwitcher } = require("./commands/erbTagSwitcher")
const { RailsAlternateFile } = require("./commands/RailsAlternateFile")
const { RailsDocumentation } = require("./commands/RailsDocumentation")
const { RailsImportmap } = require("./commands/RailsImportmap")
const { RailsInfo } = require("./commands/RailsInfo")
const { RailsMigrations } = require("./commands/RailsMigrations")
const { RailsServer } = require("./commands/RailsServer")
const { RailsStimulus } = require("./commands/RailsStimulus")
const RailsRelatedFiles = require("./commands/RailsRelatedFiles")

module.exports = {
  erbTagSwitcher,
  RailsAlternateFile,
  RailsDocumentation,
  RailsImportmap,
  RailsInfo,
  RailsMigrations,
  RailsServer,
  RailsStimulus,
  RailsRelatedFiles
}

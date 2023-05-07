// EXTENSION
const { statusNotifications }             = require("./settings/general/statusNotifications")
const { alternateFileType }               = require("./settings/general/alternateFileType")
// SOLARGRAPH
const { autoFormat }                      = require("./settings/solargraph/autoFormat")
const { bundlerPath }                     = require("./settings/solargraph/bundlerPath")
const { checkGemVersion }                 = require("./settings/solargraph/checkGemVersion")
const { commandPath }                     = require("./settings/solargraph/commandPath")
const { completion }                      = require("./settings/solargraph/completion")
const { definitions }                     = require("./settings/solargraph/definitions")
const { diagnostics }                     = require("./settings/solargraph/diagnostics")
const { folding }                         = require("./settings/solargraph/folding")
const { formatting }                      = require("./settings/solargraph/formatting")
const { hover }                           = require("./settings/solargraph/hover")
const { logLevel }                        = require("./settings/solargraph/logLevel")
const { references }                      = require("./settings/solargraph/references")
const { rename }                          = require("./settings/solargraph/rename")
const { symbols }                         = require("./settings/solargraph/symbols")
const { transport }                       = require("./settings/solargraph/transport")
const { useBundler }                      = require("./settings/solargraph/useBundler")
// RUBOCOP
const { autocorrectOnSave }               = require("./settings/rubocop/autocorrectOnSave")
const { autocorrectDisableUncorrectable } = require("./settings/rubocop/autocorrectDisableUncorrectable")

module.exports = {
  statusNotifications,
  alternateFileType,
  solargraph: {
    autoFormat,
    bundlerPath,
    checkGemVersion,
    commandPath,
    completion,
    definitions,
    diagnostics,
    folding,
    formatting,
    hover,
    logLevel,
    references,
    rename,
    symbols,
    transport,
    useBundler
  },
  rubocop: {
    autocorrectOnSave,
    autocorrectDisableUncorrectable
  }
}

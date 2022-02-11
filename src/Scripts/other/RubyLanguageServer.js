import solargraphAutoFormatSetting from "../config/solargraph/solargraphAutoFormat"
import solargraphBundlerPathSetting from "../config/solargraph/solargraphBundlerPath"
import solargraphCheckGemVersionSetting from "../config/solargraph/solargraphCheckGemVersion"
import solargraphCommandPathSetting from "../config/solargraph/solargraphCommandPath"
import solargraphCompletionSetting from "../config/solargraph/solargraphCompletion"
import solargraphDefinitionsSetting from "../config/solargraph/solargraphDefinitions"
import solargraphDiagnosticsSetting from "../config/solargraph/solargraphDiagnostics"
import solargraphFoldingSetting from "../config/solargraph/solargraphFolding"
import solargraphFormattingSetting from "../config/solargraph/solargraphFormatting"
import solargraphHoverSetting from "../config/solargraph/solargraphHover"
import solargraphLogLevelSetting from "../config/solargraph/solargraphLogLevel"
import solargraphReferencesSetting from "../config/solargraph/solargraphReferences"
import solargraphRenameSetting from "../config/solargraph/solargraphRename"
import solargraphSymbolsSetting from "../config/solargraph/solargraphSymbols"
import solargraphTransportSetting from "../config/solargraph/solargraphTransport"
import solargraphUseBundlerSetting from "../config/solargraph/solargraphUseBundler"

export default class RubyLanguageServer {
  constructor() {
    console.log("Activating Ruby Language Server...")

    // Observe the configuration setting for the server's location, and restart the server on change
    nova.config.observe("tommasonegri.rails.config.solargraph.path", function (path) {
      this.start(path)
    }, this)
  }

  get isBundled() {
    if (typeof this._isBundled !== "undefined") {
      return Promise.resolve(this._isBundled)
    }

    if (!(nova.workspace.contains(nova.workspace.path + "/Gemfile") || nova.workspace.contains(nova.workspace.path + "/gems.rb"))) {
      this._isBundled = false
      return Promise.resolve(false)
    }

    return new Promise((resolve) => {
      const process = new Process("bundle", {
        args: ["exec", "solargraph", "--version"],
        cwd: nova.workspace.path,
        shell: true,
      })

      let output = ""
      process.onStdout((line) => (output += line.trim()))
      process.onDidExit((status) => {
        if (status === 0) {
          console.log(`Found Solargraph ${output} (Bundled)`)
          resolve((this._isBundled = true))
        } else {
          resolve((this._isBundled = false))
        }
      })

      process.start()
    })
  }

  get globalPath() {
    if (typeof this._globalPath !== "undefined") {
      return Promise.resolve(this._globalPath)
    }

    return new Promise((resolve) => {
      const process = new Process("which", {
        args: ["solargraph"],
        shell: true,
      })

      let path = ""
      process.onStdout((line) => (path += line.trim()))
      process.onDidExit((status) => {
        if (status === 0) {
          const versionProcess = new Process(path, {
            args: ["--version"],
            shell: true,
          })

          let output = ""
          versionProcess.onStdout((line) => (output += line.trim()))
          versionProcess.onDidExit((status) => {
            if (status === 0) {
              console.log(`Found Solargraph ${output} (Global)`)
              resolve((this._globalPath = path))
            } else {
              resolve((this._globalPath = false))
            }
          })

          versionProcess.start()
        } else {
          resolve((this._globalPath = false))
        }
      })

      process.start()
    })
  }

  async commandArgs(commandArguments) {
    if (await this.isBundled) {
      commandArguments.unshift(
        nova.workspace.path + "/bin/bundle",
        "exec",
        "solargraph"
      )
    } else if (await this.globalPath) {
      commandArguments.unshift(await this.globalPath)
    }

    // commandArguments.unshift("/usr/bin/env")
    const args = commandArguments
    return args
  }

  notifyUserOfMissingCommand() {
    if (this.isNotified) return

    const request = new NotificationRequest("solargraph-not-found")
    request.title = nova.localize("Solargraph Not Found")
    request.body = nova.localize('The "solargraph" command could not be found in your environment.')
    request.actions = [nova.localize("OK"), nova.localize("Help")]

    const notificationPromise = nova.notifications.add(request)
    notificationPromise
      .then((response) => {
        if (response.actionIdx === 1) {
          // Help
          nova.openConfig()
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        this.isNotified = true
      })
  }

  deactivate() {
    this.stop()
  }

  async start(path) {
    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
    }

    // Use the default server path
    if (!path) {
      path = nova.workspace.path + "/bin/bundle"
    }

    const defaultArguments = ["stdio"]
    const allArgs = await this.commandArgs(defaultArguments)
    if (!allArgs) return

    // Create the client
    var serverOptions = {
      path: allArgs.shift(),
      args: allArgs,
    }
    var clientOptions = {
      // The set of document syntaxes for which the server is valid
      syntaxes: ["ruby"],
      initializationOptions: {
        autoFormat: solargraphAutoFormatSetting(),
        bundlerPath: solargraphBundlerPathSetting(),
        checkGemVersion: solargraphCheckGemVersionSetting(),
        commandPath: solargraphCommandPathSetting(),
        completion: solargraphCompletionSetting(),
        definitions: solargraphDefinitionsSetting(),
        diagnostics: solargraphDiagnosticsSetting(),
        folding: solargraphFoldingSetting(),
        formatting: solargraphFormattingSetting(),
        hover: solargraphHoverSetting(),
        logLevel: solargraphLogLevelSetting(),
        references: solargraphReferencesSetting(),
        rename: solargraphRenameSetting(),
        symbols: solargraphSymbolsSetting(),
        transport: solargraphTransportSetting(),
        useBundler: solargraphUseBundlerSetting(),

        enablePages: true,
      },
    }
    var client = new LanguageClient(
      "ruby",
      "Ruby Language Server",
      serverOptions,
      clientOptions
    )

    try {
      // Start the client
      client.start()

      // Add the client to the subscriptions to be cleaned up
      nova.subscriptions.add(client)
      this.languageClient = client
    } catch (err) {
      // If the .start() method throws, it's likely because the path to the language server is invalid

      if (nova.inDevMode()) {
        console.error(err)
      }
    }
  }

  stop() {
    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
      this.languageClient = null
    }
  }
}

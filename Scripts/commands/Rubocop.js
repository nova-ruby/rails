const SETTINGS = require("../settings")

exports.Rubocop = class Rubocop {
  autocorrectLayout(document) {
    this.rubocopSharedProcess([
      "-x",
      document.path,
      SETTINGS.rubocop.autocorrectDisableUncorrectable() ? "--disable-uncorrectable" : ""
    ])
  }

  autocorrect(document) {
    this.rubocopSharedProcess([
      "-a",
      document.path,
      SETTINGS.rubocop.autocorrectDisableUncorrectable() ? "--disable-uncorrectable" : ""
    ])
  }

  autocorrectAll(document) {
    this.rubocopSharedProcess([
      "-A",
      document.path,
      SETTINGS.rubocop.autocorrectDisableUncorrectable() ? "--disable-uncorrectable" : ""
    ])
  }

  async listOffenses() {
    const { files, summary } = await this.offenses

    nova.workspace.showChoicePalette(
      files.map(el => `(${el.offenses.length}) ${el.path}`),
      { placeholder: `${summary.offense_count} ${summary.offense_count == 1 ? "Offense" : "Offenses"} in ${files.length} ${files.length == 1 ? "File" : "Files"}` },
      (_, fileIndex) => {
        nova.workspace.showChoicePalette(
          files[fileIndex].offenses.map(el => `${el.message}`),
          { placeholder: `${files[fileIndex].offenses.length} ${files[fileIndex].offenses.length == 1 ? "Offense" : "Offenses"} in ${files[fileIndex].path}` },
          (_, offenseIndex) => {
            const offense = files[fileIndex].offenses[offenseIndex]
            const uri = `${nova.workspace.path}/${files[fileIndex].path}`

            nova.workspace.openFile(uri, {
              line: offense.location.line,
              column: offense.location.column
            })
          }
        )
      }
    )
  }

  // private

  get rubocopCommand() {
    if (SETTINGS.solargraph.useBundler()) {
      return ["bundle", "exec", "rubocop"]
    } else {
      return ["rubocop"]
    }
  }

  get offenses() {
    return new Promise((resolve, reject) => {
      const process = new Process("usr/bin/env", {
        cwd: nova.workspace.path,
        args: [...this.rubocopCommand, "-f", "json"],
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      let str = ""
      let err = ""

      process.onStdout((output) => {
        str += output
      })

      process.onStderr((error_output) => {
        err += error_output
      })

      process.onDidExit((status) => {
        if (err.length > 0) return reject(err)
        if (str.length == 0) return

        const json = JSON.parse(str)
        json.files = json.files.filter(el => el.offenses.length > 0)

        resolve(json)
      })

      process.start()
    })
  }

  rubocopSharedProcess(commandArgs) {
    const args = [...this.rubocopCommand, ...commandArgs]

    const process = new Process("usr/bin/env", {
      cwd: nova.workspace.path,
      args: args,
      stdio: ["ignore", "ignore", "ignore"],
    })

    process.start()
  }
}

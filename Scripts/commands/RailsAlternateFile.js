const SETTINGS = require("../settings")

exports.RailsAlternateFile = class RailsAlternateFile {
  constructor() {
    // FIXME: Handle running the command while something else than a file is active (like a terminal)
    this.currentPath = nova.workspace.activeTextEditor.document.path
    this.splitPath = nova.path.split(this.currentPath)
  }

  // TODO: Refactor and improve code quality
  alternate() {
    var testType = (SETTINGS.general.alternateFileType == "rspec" ?  "spec" : "test");

    // If neither app nor test are found in the path, can't find associated file
    if (this.splitPath.indexOf("app") === -1 && this.splitPath.indexOf(testType) === -1) {
      this.showError("Couldn't find alternate files. Does the workspace contain a Rails project?")
      return
    }

    const rootIndex = this.splitPath.indexOf("app") === -1 ? this.splitPath.indexOf(testType) : this.splitPath.indexOf("app")
    const rootDir = this.splitPath[rootIndex]
    const associatedDir = rootDir === "app" ? testType : "app"

    const currentFileName = this.splitPath[this.splitPath.length - 1]
    let associatedFileName

    if (associatedDir === testType) {
      associatedFileName = currentFileName.slice(0, -3).concat("_${testType}.rb")
    } else {
      associatedFileName = currentFileName.replace("_${testType}", "")
    }

    let newSplitPath = this.splitPath
    newSplitPath[rootIndex] = associatedDir
    newSplitPath[newSplitPath.length - 1] = associatedFileName
    const newPath = newSplitPath.slice(1).join("/")

    nova.workspace.openFile(newPath)
  }

  showError(msg) {
    nova.workspace.showErrorMessage(msg)
  }
}

export default class RailsAlternateFile {
  constructor() {
    this.currentPath = nova.workspace.activeTextEditor.document.path
    this.splitPath = nova.path.split(this.currentPath)
  }

  // TODO: Refactor and improve code quality
  alternate() {
    // If neither app nor test are found in the path, can't find associated file
    if (this.splitPath.indexOf("app") === -1 && this.splitPath.indexOf("test") === -1) {
      this.showError("Couldn't find alternate files. Does the workspace contain a Rails project?")
      return
    }

    const rootIndex = this.splitPath.indexOf("app") === -1 ? this.splitPath.indexOf("test") : this.splitPath.indexOf("app")
    const rootDir = this.splitPath[rootIndex]
    const associatedDir = rootDir === "app" ? "test" : "app"

    const currentFileName = this.splitPath[this.splitPath.length - 1]
    let associatedFileName

    if (associatedDir === "test") {
      associatedFileName = currentFileName.slice(0, -3).concat("_test.rb")
    } else {
      associatedFileName = currentFileName.replace("_test", "")
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

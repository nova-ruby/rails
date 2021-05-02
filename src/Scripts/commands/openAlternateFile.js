export function railsOpenAlternateFile(workspace) {
    var currentPath = nova.workspace.activeTextEditor.document.path;
    var splitPath = nova.path.split(currentPath);

    // If neither app nor test are found in the path, can't find associated file
    if (splitPath.indexOf("app") === -1 && splitPath.indexOf("test") === -1) {
        return;
    }

    var rootIndex =
        splitPath.indexOf("app") === -1
            ? splitPath.indexOf("test")
            : splitPath.indexOf("app");
    var rootDir = splitPath[rootIndex];
    var associatedDir = rootDir === "app" ? "test" : "app";

    var currentFileName = splitPath[splitPath.length - 1];
    if (associatedDir === "test") {
        var associatedFileName = currentFileName
            .slice(0, -3)
            .concat("_test.rb");
    } else {
        var associatedFileName = currentFileName.replace("_test", "");
    }

    var newSplitPath = splitPath;
    newSplitPath[rootIndex] = associatedDir;
    newSplitPath[newSplitPath.length - 1] = associatedFileName;
    var newPath = newSplitPath.slice(1).join("/");

    nova.workspace.openFile(newPath);
}

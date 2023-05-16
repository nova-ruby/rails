class RailsRelatedFiles {
  run(filePath) {
    const related = new Related(filePath, this._patterns)

    nova.workspace.showChoicePalette(related.files, {
      placeholder: "Go to related file..."
    }, (choice) => {
      if (choice) {
        nova.workspace.openFile(nova.path.join(nova.workspace.path, choice))
      }
    })
  }

  get _patterns() {
    return PATTERNS
  }
}

class Related {
  constructor(filePath, patterns) {
    this._filePath = filePath
    this._patterns = patterns

    this.files = []

    this._build()
  }

  _build() {
    this._patterns.forEach(({ regex, paths }) => {
      const match = this._filePath.match(regex)
      if (match) {
        this.files = [...this.files, ...this._filesForPath(match, paths)]
      }
    })
  }

  /**
   * Retrieves a list of files for the given match and paths
   * @param {string[]} match
   * @param {string[]} paths
   * @returns {string[]}
   */
  _filesForPath(match, paths) {
    return paths
      .map(path => this._replacePath(match, path))
      .flatMap(path => this._expandGlob(path))
      .filter(path => nova.workspace.contains(nova.path.join(nova.workspace.path, path)))
      .filter(path => nova.path.join(nova.workspace.path, path) != this._filePath)
  }

  /**
   * Retrieves a path with its interpolation vars replaces by the found groups on match
   * @param {string[]} match
   * @param {string} path
   * @returns {string}
   */
  _replacePath(match, path) {
    let replacedPath = path

    match.forEach((value, index) => {
      replacedPath = replacedPath.replace(`$${index}`, value)
    })

    return replacedPath
  }

  /**
   * Retrieves a path or collection of expanded paths from glob
   * @param {string} path
   * @returns {string|string[]}
   */
  _expandGlob(path) {
    if (!path.includes("**")) return path

    path = path.replace("**", "")
    const basePath = nova.path.join(nova.workspace.path, path)

    if (!nova.workspace.contains(basePath)) return "NOT_A_FILE"

    return nova.fs.listdir(basePath)
      .filter(item => nova.fs.stat(nova.path.join(basePath, item)).isFile())
      .map(item => nova.path.join(path, item))
  }
}

const PATTERNS = [
  {
    "regex": ".+\/(app|lib)\/(.+).rb",
    "paths": [
      "spec/$2_spec.rb",
      "test/$2_test.rb"
    ]
  },
  {
    "regex": ".+\/(test|spec)\/(.+)_(test|spec).rb",
    "paths": [
      "app/$2.rb",
      "lib/$2.rb"
    ]
  },
  {
    "regex": ".+\/app\/controllers\/(.+)_controller.rb",
    "paths": [
      "app/views/$1/**",
      "app/helpers/$1_helper.rb",
      "config/routes.rb",
      "spec/requests/$1_spec.rb",
      "spec/routing/$1_routing_spec.rb"
    ]
  },
  {
    "regex": ".+\/app\/helpers\/(.+)_helper.rb",
    "paths": [
      "app/views/$1/**",
      "app/controllers/$1_controller.rb",
      "config/routes.rb",
      "spec/requests/$1_spec.rb"
    ]
  },
  {
    "regex": ".+\/app\/views\/(.+)\/[^\/].+",
    "paths": [
      "app/views/$1/**",
      "app/controllers/$1_controller.rb",
      "app/helpers/$1_helper.rb",
      "config/routes.rb",
      "spec/controllers/$1_spec.rb",
      "spec/requests/$1_spec.rb"
    ]
  },
  {
    "regex": ".+\/config\/routes.rb",
    "paths": [
      "spec/routing/**"
    ]
  },
  {
    "regex": ".+\/(lib)\/(.+).rb",
    "paths": [
      "spec/lib/$2_spec.rb",
      "test/lib/$2_test.rb"
    ]
  },
  {
    "regex": ".+/spec/controllers/(.+)_controller_spec.rb",
    "paths": [
      "app/controllers/$1_controller.rb",
      "app/helpers/$1_helper.rb",
      "app/views/$1/**",
      "config/routes.rb"
    ]
  },
  {
    "regex": ".+/spec/requests/(.+)_spec.rb",
    "paths": [
      "app/controllers/$1_controller.rb",
      "app/helpers/$1_helper.rb",
      "app/views/$1/**",
      "config/routes.rb"
    ]
  },
  {
    "regex": ".+/spec/lib/(.+)_spec.rb",
    "paths": [
      "lib/$1.rb"
    ]
  }
]

module.exports = RailsRelatedFiles

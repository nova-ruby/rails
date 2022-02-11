import { showNotification } from "../helpers"

export default class RailsMigrations {
  openLatestMigration() {
    this.maybeShowMigrations((migrations) => {
      const migration = migrations[0]
      this.openMigration(migration)
    })
  }

  listMigrations() {
    this.maybeShowMigrations((migrations) => {
      nova.workspace.showChoicePalette(
        migrations,
        { placeholder: "Choose Migration" },
        this.openMigration.bind(this)
      )
    })
  }

  maybeShowMigrations(callbackAction) {
    if (this.migrationsFolderExists) {
      const migrations = this.migrationsList
      if (migrations && migrations.length > 0) {
        callbackAction(migrations)
      } else {
        this.showError("No files found in the migrations folder.")
      }
    } else {
      this.showError(
        "Couldn't find the migrations folder. Does the workspace contain a Rails project?"
      )
    }
  }

  openMigration(name) {
    nova.workspace.openFile(nova.path.join(this.migrationsPath, name))
  }

  async migrate() {
    if (!nova.workspace.railsDetected) {
      console.error("Something went wrong with the migrate command")

      this.showError("Something went wrong with the migrate command. Does the workspace contain a Rails project?")

      return
    }

    const process = new Process("usr/bin/env", {
      cwd: nova.workspace.path,
      args: ["rails", "db:migrate"],
      stdio: ["ignore", "pipe", "ignore"],
    })
    let str = ""

    process.onStdout((output) => {
      str += output.trim()
    })

    process.onDidExit((status) => {
      if (status === 0 && str.length > 0) {
        console.log("Migration applied")

        showNotification(
          "rails-database-migrated",
          "Migration applied",
          false,
          "The latest migration has been applied correctly."
        )
      } else if (status === 0) {
        console.log("Nothing to migrate")

        showNotification(
          "rails-database-no-migrated",
          "Nothing new to migrate",
          false,
          "All the migrations are already applied."
        )
      } else {
        console.error("Migrate command", str)
        this.showError("Something went wrong with the migrate command. Check out the Extension Console for more information.")
      }
    })

    process.start()
  }

  async rollback() {
    if (!nova.workspace.railsDetected) {
      console.error("Something went wrong with the rollback command")
      this.showError("Something went wrong with the rollback command. Does the workspace contain a Rails project?")

      return
    }

    const process = new Process("usr/bin/env", {
      cwd: nova.workspace.path,
      args: ["rails", "db:rollback"],
      stdio: ["ignore", "pipe", "ignore"],
    })
    let str = ""

    process.onStdout((output) => {
      str += output.trim()
    })

    process.onDidExit((status) => {
      console.log(status)
      console.log(str)

      if (status === 0 && str.length > 0) {
        console.log("Rollback applied")

        showNotification(
          "rails-database-rollbacked",
          "Rollback applied",
          false,
          "The rollback has been applied correctly."
        )
      } else if (status === 0) {
        console.log("Nothing to rollback to")

        showNotification(
          "rails-database-no-rollbacked",
          "Nothing to rollback",
          false,
          "No migrations to rollback."
        )
      } else {
        console.error("Rollback command:", str)

        this.showError("Something went wrong with the rollback command. Check out the Extension Console for more information.")
      }
    })

    process.start()
  }

  showError(msg) {
    nova.workspace.showErrorMessage(msg)
  }

  get migrationsList() {
    return nova.fs
      .listdir(this.migrationsPath)
      .filter((fileName) => fileName.endsWith(".rb"))
      .sort()
      .reverse()
  }

  get migrationsFolderExists() {
    const migrationsFs = nova.fs.stat(this.migrationsPath)
    return migrationsFs && migrationsFs.isDirectory()
  }

  get migrationsPath() {
    return nova.path.join(nova.workspace.path, "db", "migrate")
  }
}

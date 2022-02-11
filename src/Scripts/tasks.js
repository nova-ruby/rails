import RailsTaskProvider from "./other/RailsTaskProvider"

export default function registerTasks() {
  if (!nova.workspace.railsDetected) return

  nova.assistants.registerTaskAssistant(new RailsTaskProvider(), {
    identifier: "tommasonegri.rails.tasks.rails",
    name: "Ruby on Rails",
  })
}

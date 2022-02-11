import NotesView from "./sidebar/NotesView"
import AboutView from "./sidebar/AboutView"

export default function registerSidebar() {
  const notesView = new NotesView()
  nova.subscriptions.add(notesView)

  const aboutView = new AboutView()
  nova.subscriptions.add(aboutView)
}

exports.RailsInfo = class RailsInfo {
  // TODO: Verify if is it possible to get the host from the active process
  showRoutes() {
    nova.openURL("http://localhost:3000/rails/info/routes")
  }

  showProperties() {
    nova.openURL("http://localhost:3000/rails/info/properties")
  }
}

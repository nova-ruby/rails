export default class RailsInfo {
    showRoutes() {
        nova.openURL('http://localhost:3000/rails/info/routes')
    }

    showProperties() {
        nova.openURL('http://localhost:3000/rails/info/properties')
    }
}

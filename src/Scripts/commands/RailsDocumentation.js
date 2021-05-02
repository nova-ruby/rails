export default class RailsDocumentation {
    constructor() {
        this.availableDocs = {
            railsAPI: "Rails API",
            railsGuides: "Rails Guides",
            turbo: "Turbo",
            stimulus: "Stimulus",
            rubyDoc: "Ruby Doc",
        };

        this.docsSearchLinks = {
            railsAPI:
                "https://duckduckgo.com/?t=ffab&q=site%3Aapi.rubyonrails.org+",
            railsGuides:
                "https://duckduckgo.com/?t=ffab&q=site%3Aguides.rubyonrails.org+",
            turbo: "https://duckduckgo.com/?t=ffab&q=site%3Aturbo.hotwire.dev+",
            stimulus:
                "https://duckduckgo.com/?t=ffab&q=site%3Astimulus.hotwire.dev+",
            rubyDoc: "https://duckduckgo.com/?t=ffab&q=site%3Aruby-doc.org+",
        };
    }

    /**
     * @param {string} link Documentation Page Link
     */
    openDocs(link) {
        nova.openURL(link);
    }

    searchDocs() {
        const documentations = Object.values(this.availableDocs);

        nova.workspace.showChoicePalette(
            documentations,
            {
                placeholder: "Choose Documentation",
            },
            this.askWhatToSearch.bind(this)
        );
    }

    /**
     * @param {string} documentation Documentation Page Link
     */
    askWhatToSearch(documentation) {
        if (!documentation) {
            return;
        }

        const docs = this.availableDocs;
        const docsLinks = this.docsSearchLinks;
        const message = "Search in " + documentation;
        let docLink = null;

        switch (documentation) {
            case docs.railsAPI:
                docLink = docsLinks.railsAPI;
                break;
            case docs.railsGuides:
                docLink = docsLinks.railsGuides;
                break;
            case docs.turbo:
                docLink = docsLinks.turbo;
                break;
            case docs.stimulus:
                docLink = docsLinks.stimulus;
                break;
            case docs.rubyDoc:
                docLink = docsLinks.rubyDoc;
                break;
        }

        nova.workspace.showInputPalette(
            message,
            {
                placeholder: message,
            },
            function (query) {
                this.performDocumentationSearch(docLink, query);
            }.bind(this)
        );
    }

    /**
     * @param {string} searchURL Documentation Search URL
     * @param {string} query Search terms
     */
    performDocumentationSearch(searchURL, query) {
        if (!query) {
            return;
        }

        nova.openURL(searchURL + encodeURIComponent(query));
    }
}

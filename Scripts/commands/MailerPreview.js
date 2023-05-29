class MailerPreview {
  preview(path) {
    const match = path.match(/.+\/views\/([^\.]*).+/)

    nova.openURL(`http://localhost:3000/rails/mailers/${match[1]}`)
  }
}

module.exports = MailerPreview

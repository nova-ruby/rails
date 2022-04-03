![](https://raw.githubusercontent.com/tommasongr/nova-rails/main/Rails.novaextension/extension.png)

# Ruby on Rails for Nova editor

Provides Ruby & Ruby on Rails support for Panic's Nova text editor.

## Usage

Enable the extension in the extension library within Nova.

## Features Overview

### Solargraph

The extension provides Solargraph support with almost all its settings exposed. You can configure it globally or on a workspace base.

> WARNING: Solargraph v0.42.0 or above is required.

**Installation process:**
- Install [Solargraph](https://solargraph.org) globally on your system with `gem install solargraph`. With version managers like *rbenv* make sure is installed for every Ruby version.
- Follow the [tutorial](https://www.youtube.com/watch?v=mkLDPpDSWng) to set up Solargraph to work well with Rails.

### Database & Migrations

The extension provides commands for migrating/rolling back the database, opening quickly the last migration and list all migrations within a command palette.

### Alternate Files

Quickly switch between tests and model/controller/etc files.

### Stimulus Clips

Quickly insert Stimulus notations. To access the Clips start typing `stimul...`. You can use placeholders for referencing the correct naming conventions.

![Stimulus Clips](https://raw.githubusercontent.com/tommasongr/nova-rails/main/docs/images/stimulus-clips.png)

### And much more...

ERB tag switcher, Search in various documentations, Task Templates, DHH Ruby Clips, About Rails Sidebar, show routes and infos, importmap pin and unpin commands, update Stimulus manifest...

Check out the [Wiki](https://github.com/tommasongr/nova-rails/wiki) for a complete reference.

## Report a Bug or Feature Request

To report a bug or request a feature, please add an issue to the GitHub repository. Thanks!

## Special Thanks

Thanks to @devjah, @jonathanpike and @Wylan for their work on different extensions which have been integrated in this suite.

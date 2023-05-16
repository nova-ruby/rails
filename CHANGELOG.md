## Version 7.0

### FEAT

- Add StimulusJS outlets Clips

### FIX

- Change Ruby clip shortcut with an available one
- Use the new `hotwired.dev` domain for documentation by @gobijan in #33 and #34

## Version 6.2

### IMPROVE

- Update task-bridgetown icons to avoid a resizing issue

## Version 6.1

### FIX

- Prevent "do" and "do (yield)" clips to popup when typing "end"
- Update noteParts regexp to handle Notes with empty comments by @hmaddocks

## Version 6.0

### FEAT

- Improved RuboCop support with autocorrect commands, fix on save and offenses list

### REFACTOR

- Update extension structure to not use npm
- Update extension icons

### Fix

- Resolved a parsing issue of Rails Notes with "/" in it
- Removed an error-prone option from task templates

## Version 5.2

### FIX

- When rails notes/about fails to run, save the error output and return it in the Extension error logs

## Version 5.1

### FIX

- Fixed an issue with Rails Notes regex pattern

## Version 5.0

### FEATURES

- Replaced the automatically provided Rails server task with an optional Task template
- Added new Rails server task template (equivalent to bin/dev)
- Added new Bridgetown task template with Run, Build and Clean command

### DOCS

- Added a tutorial for installing and configuring Solargraph

## Version 4.0

### FEATURES

- Added new Rails Notes sidebar

### REFACTOR

- Improved code quality and style

## Version 3.3

### FIX

- Honor both Gemfile as well as gems.rb for Rails project detection

## Version 3.2

### FIX

- Remove JS private methods in classes for compatibility reasons

## Version 3.1

### FIX

- Fixed an issue with the importmaps commands and multiple packages

## Version 3.0

### FEATURES

- Added new commands for pinning and unpinning packages from importmap
- Added new Clips for ERB, Ruby and Rails based on *DHH Ruby* bundle for TextMate

### DOCS

- Streamlined and updated the README.

## Version 2.0

### FEATURES

- Added new Clips and updated existing ones to follow Stimulus v3.0.0
- Added new command for updating Stimulus manifest (./bin/rails stimulus:manifest:update)
- Added new commands for opening rails/info/routes and rails/info/properties

### FIX

- Fixed an issue where isRailsProject wasn't detecting projects created with Rails 7.0

## Version 1.0

### FEATURES

- Added Solargraph support with relative settings

## Version 0.9

### DOCS

- Added extension icon in the README
- Added StimulusJS as keyword
- Exited from Alpha stage

## Version 0.8 - Alpha

### FEATURES

- Added a Version Checker for notify user of background updates

## Version 0.7 - Alpha

### FEATURES

- Added new Clips for Stimulus in HTML (100% coverage). Every Clip uses official naming conventions for placeholders, suggesting you the correct text format (camelCase, kebab-case, etc).
![Stimulus Clips](https://raw.githubusercontent.com/nova-ruby/rails/main/docs/images/stimulus-clips.png)

### IMPROVE

- Clean up console logs of the ERB Tag Switcher for production

## Version 0.6 - Alpha

### FEATURES

- Added a command for killing Puma server processes
- Added a command for applying the latest migration
- Added a command for applying a rollback
- Added a command for opening the Extension Wiki

## Version 0.5 - Alpha

### FEATURES

- Added Rails project detection
- Added Rails Server Task
- Added Rails About sidebar
- Added Rails Documentation search
- Added Rails list and last migration commands
- Added Rails alternate file command
- Added Erb Tag Switcher
- Added Status Notifications

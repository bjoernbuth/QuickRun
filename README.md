# Quick Run

## Purpose
Purpose: Create a way to use shortnames for functions.

## Example
In settings.json we define:

    "quickrun.commands": [
      {
        "shortcut": "br",
        "cmd": "editor.action.jumpToBracket",
        "description": "Go to Bracket"
      }
    ]

Then running "Quick Run Command" opens a text box.
Entering the shortname "br" will directly execute
the given command (in this case editor.action.jumpToBracket)
without having to press enter.

## Shortnames
For obvious reasons no shortname should be a
a part (starting from the beginning) of another shortname,
otherwise the longer shortname would become unreachable.

Example: Using the shortname "br" and "bra" would make
"bra" unreachable since after typing "br" the command we
have assigned to "br" would immediately be run. This is intended
behavior and saved us from having to confirm via Enter.

In case this does not some favourable to you please fork
the github repo and change the way the function quickRunCommand
is implemented.

## General
This extension allows you to quickly run commands by
specifying a shortcut name. In my opinion VS Code really
lacks an easy mechanism to define **Aliases** for command
names, I'm amazed that such an advanced and polished product
is missing such a basic feature (if I'm wrong please don't
hesitate to correct my but as of my knowdlege the only way
to create short names for commands is to use extensions).

Using the command palette is often sufficient and it is quite
efficent but there's no guarantee it will directly jump
to the correct command and you still have to press enter.
For example even if you have defined a command under the
name 'gg' (as a shortcut to run git-graph from the the git-graph
extension) using the command palette and typing gg might jump
other suggestions first (e.g. "Toggle between dark and light themes").
The mechanism is quite smart and will learn from your input and
selections but for me it is desirable to be able to run
certain commands via shortnames in a way that will guarantee
they are run and even without having to confirm with enter.

## Specifying commands in settings.json
The commands the extension can run are specified in the global
settings.json file. In later versions I might add a way to
add certain settings to the workkspace settings.json files and
have the two lists merged, but currently there is only the global
list of commands.

Each command has the fields shortcut, cmd and description.
In package.json all three are declared as required, so in case
you don't want a description just use an empty string.

    "quickrun.commands": [
      {
        "shortcut": "br",
        "cmd": "editor.action.jumpToBracket",
        "description": "Go to Bracket"
      },
      {
        "shortcut": "kk",
        "cmd": "editor.action.jumpToBracket",
        "description": "Go to Bracket"
      },
      {
        "shortcut": "gg",
        "cmd": "git-graph.view",
        "description": "Git graph view"
      },
    ]

## Keybinding for quickRunCommand (adjust as you like)

    {
      "key": "f3",
      "command": "quickrun.quickRunCommand"
    }

or (recently ctrl+; seems quicker to me)":

    {
      "key": "ctrl+;",
      "command": "quickrun.quickRunCommand"
    }

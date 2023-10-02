import * as fs from 'fs';
import * as vscode from 'vscode';

function quickRunCommand() {
    const inputBox = vscode.window.createInputBox();
    inputBox.prompt = 'Enter command code';

    inputBox.onDidChangeValue((userInput) => {
        if (COMMAND_MAP[userInput]) {
            vscode.commands.executeCommand(COMMAND_MAP[userInput].cmd);
            inputBox.hide();  // Close the input box once the command is executed
        }
    });

    inputBox.show();
}


const customCommands: Array<{ shortcut: string, cmd: string, description: string, group?: string}> = vscode.workspace.getConfiguration().get('quickrun.commands') || [];

export const COMMAND_MAP: { [key: string]: { cmd: string, description: string } } = {};

for (const cmd of customCommands) {
    cmd.group = cmd.group || 'nogroup';
    COMMAND_MAP[cmd.shortcut] = { cmd: cmd.cmd, description: cmd.description };
}



export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "QuickRun" is now active!');

    let quickRunDisposable = vscode.commands.registerCommand('quickrun.quickRunCommand', quickRunCommand);

    for (const cmdInfo of customCommands) {
        let disposable = vscode.commands.registerCommand(`quickrun.${cmdInfo.shortcut}`, () => {
            vscode.commands.executeCommand(cmdInfo.cmd);
        });
        context.subscriptions.push(disposable);
    }

    let helpDisposable = vscode.commands.registerCommand('quickrun.help', () => {
        // Create and show a new webview

        // this will save the content of the help to a file
        // saveWebviewContentToFile();

        const panel = vscode.window.createWebviewPanel(
            'quickrunHelp',
            'Quickrun Commands',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(
        quickRunDisposable,
        helpDisposable
    );
}


function getWebviewContent() {
    const groups: { [key: string]: Array<{ shortcut: string, cmd: string, description?: string }> } = {};

    // Group commands by their group property
    for (const cmd of customCommands) {
        if (!groups[cmd.group!]) {
            groups[cmd.group!] = [];
        }
        groups[cmd.group!].push(cmd);
    }

    // Generate the webview content based on groups
    let content = '<html><head></head><body>';

    const sortedGroupNames = Object.keys(groups).sort();

    for (const groupName of sortedGroupNames) {
        content += `<h2>${groupName}</h2><ul>`;
        for (const cmd of groups[groupName]) {
            content += `<li><strong>${cmd.shortcut}</strong>: ${cmd.description || ''}</li>`;
        }
        content += '</ul>';
    }

    content += '</body></html>';
    return content;
}


function saveWebviewContentToFile() {
    const content = getWebviewContent();
    const pathToFile = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath + '/quickrun_command_generated.html'
        : 'quickrun_command_generated.html';

    fs.writeFile(pathToFile, content, err => {
        if (err) {
            vscode.window.showErrorMessage('Failed to save file! ' + err.message);
        } else {
            vscode.window.showInformationMessage(`File saved successfully to ${pathToFile}`);
        }
    });
}



export function deactivate() {}

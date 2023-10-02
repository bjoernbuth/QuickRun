import * as vscode from 'vscode';
import { quickRunCommand } from './quickRunCommand';

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


// function getWebviewContent() {
//     let htmlContent = `
//         <html>
//         <head>
//             <title>Quickrun Commands</title>
//         </head>
//         <body>
//             <h1>Quickrun Commands</h1>
//             <ul>
//     `;

//     for (const cmdInfo of customCommands) {
//         htmlContent += `<li><strong>${cmdInfo.shortcut}</strong>: ${cmdInfo.description || ''} (Executes: ${cmdInfo.cmd})<br></br></li>`;
//     }

//     htmlContent += `
//             </ul>
//         </body>
//     </html>
//     `;

//     return htmlContent;
// }


export function deactivate() {}

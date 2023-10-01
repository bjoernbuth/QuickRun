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


const customCommands: Array<{ shortcut: string, cmd: string, description: string }> = vscode.workspace.getConfiguration().get('quickrun.commands') || [];

const COMMAND_MAP: { [key: string]: { cmd: string, description: string } } = {};

for (const cmd of customCommands) {
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
    let htmlContent = `
        <html>
        <head>
            <title>Quickrun Commands</title>
        </head>
        <body>
            <h1>Quickrun Commands</h1>
            <ul>
    `;

    for (const cmdInfo of customCommands) {
        htmlContent += `<li><strong>${cmdInfo.shortcut}</strong>: ${cmdInfo.description || ''} (Executes: ${cmdInfo.cmd})</li>`;
    }

    htmlContent += `
            </ul>
        </body>
    </html>
    `;

    return htmlContent;
}


export function deactivate() {}

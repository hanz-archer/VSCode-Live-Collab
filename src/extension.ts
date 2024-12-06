import * as vscode from 'vscode';
import { syncDocument } from './firebaseService'; // relative path

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "live-collab" is now active!');

    let disposable = vscode.commands.registerCommand('live-collab.startCollaboration', async () => {
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
            vscode.window.showErrorMessage('No active document found!');
            return;
        }

        // Prompt user for a document ID
        const documentId = await vscode.window.showInputBox({
            placeHolder: 'Enter a unique document ID to collaborate on',
        });

        if (!documentId) {
            vscode.window.showErrorMessage('Document ID is required!');
            return;
        }

        // Sync the document with Firebase (initialize real-time collaboration)
        syncDocument(documentId, document.getText());
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

import * as vscode from 'vscode';
import { syncDocument } from './firebaseService'; // Ensure this path is correct

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "live-collab" is now active!');

    let disposable = vscode.commands.registerCommand('live-collab.startCollaboration', async () => {
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
            vscode.window.showErrorMessage('No active document found!');
            return;
        }

        // Default document ID for testing purposes
        const documentId = '1234';  // Set document ID to 1234 for testing

        // Sync the document with Firebase (initialize real-time collaboration)
        syncDocument(documentId, document.getText());

        // Optional: Show a message with the document ID
        vscode.window.showInformationMessage(`Using Document ID: ${documentId}`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

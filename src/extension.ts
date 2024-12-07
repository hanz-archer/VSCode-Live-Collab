import * as vscode from 'vscode';
import { syncDocument, updateCursorPosition, listenForCursorUpdates } from './firebaseService'; // Ensure this path is correct

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "live-collab" is now active!');

    const userId = `user_${Date.now()}`; // Generate a unique user ID
    let documentId: string | null = null; // Variable to store the current document ID
    const collaboratorCursors: Record<string, vscode.TextEditorDecorationType> = {};

    const showCollaboratorsCursors = (cursors: Record<string, { line: number; character: number }>) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        for (const decoration of Object.values(collaboratorCursors)) {
            decoration.dispose();
        }

        for (const [collabUserId, position] of Object.entries(cursors)) {
            if (collabUserId === userId) continue; // Skip self

            const range = new vscode.Range(position.line, position.character, position.line, position.character);
            const decorationType = vscode.window.createTextEditorDecorationType({
                before: {
                    contentText: `${collabUserId}`, 
                    backgroundColor: 'rgba(0, 122, 255, 0.2)', 
                    color: 'black',
                    border: '1px solid rgba(0, 122, 255, 0.5)',
                    margin: '0 3px',
                },
            });

            editor.setDecorations(decorationType, [range]);
            collaboratorCursors[collabUserId] = decorationType;
        }
    };

    /**
     * Command to start collaboration.
     */
    let startCollaborationDisposable = vscode.commands.registerCommand('live-collab.startCollaboration', async () => {
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
            vscode.window.showErrorMessage('No active document found!');
            return;
        }

        // Default document ID for testing purposes
        documentId = '1234'; // Set document ID to 1234 for testing

        // Sync the document with Firebase
        syncDocument(documentId, document.getText());

        // Listen for collaborators' cursor updates
        listenForCursorUpdates(documentId, (cursors) => {
            showCollaboratorsCursors(cursors);
        });

        // Inform the user
        vscode.window.showInformationMessage(`Collaboration started with Document ID: ${documentId}`);
    });

    /**
     * Track and sync the local user's cursor position.
     */
    vscode.window.onDidChangeTextEditorSelection((event) => {
        if (!documentId) return; // Only track cursor if collaboration is active

        const position = event.selections[0]?.active; // Get the cursor's current position
        if (position) {
            updateCursorPosition(documentId, userId, { line: position.line, character: position.character });
        }
    });

    // Add the command to the extension's context subscriptions
    context.subscriptions.push(startCollaborationDisposable);
}

export function deactivate() {
    // Clean up resources when the extension is deactivated
    console.log('Extension "live-collab" has been deactivated.');
}

import * as vscode from 'vscode';
import { syncDocument, updateCursorPosition, listenForCursorUpdates } from './firebaseService'; // Ensure this path is correct

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "live-collab" is now active!');

    const userId = `user_${Date.now()}`; // Generate a unique user ID
    let documentId: string | null = null; // Variable to store the current document ID
    const collaboratorCursors: Record<string, vscode.TextEditorDecorationType> = {}; // Store cursor decorations

    const showCollaboratorsCursors = (cursors: Record<string, { line: number; character: number }>) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        // Clear previous decorations
        Object.values(collaboratorCursors).forEach((decoration) => decoration.dispose());

        // Apply new decorations
        for (const [collabUserId, position] of Object.entries(cursors)) {
            if (collabUserId === userId) continue; // Skip the current user's cursor

            const range = new vscode.Range(position.line, position.character, position.line, position.character);
            const decorationType = vscode.window.createTextEditorDecorationType({
                after: {
                    contentText: ` ${collabUserId}`, // Display collaborator's user ID after the cursor
                    color: 'rgba(0, 122, 255, 0.7)', // Color of the collaborator ID text
                    margin: '0 5px', // Add margin to avoid overlapping with the code
                },
                isWholeLine: true, // Apply decoration across the entire line
            });

            editor.setDecorations(decorationType, [range]);
            collaboratorCursors[collabUserId] = decorationType; // Store decoration for disposal
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

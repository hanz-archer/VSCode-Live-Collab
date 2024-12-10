import * as vscode from 'vscode';
import { syncDocument, updateCursorPosition, listenForCursorUpdates, listenForDocumentUpdates, syncRealTimeDocumentUpdates, removeCollaboratorCursor } from './firebaseService';

// Function to generate a random 5-character alphanumeric ID
const generateDocumentId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

// Function to authenticate user with GitHub
const authenticateWithGitHub = async (): Promise<string | null> => {
    try {
        const session = await vscode.authentication.getSession('github', [], { createIfNone: true });
        return session?.account?.label || null; // Use session.account.label to get the display name
    } catch (error) {
        vscode.window.showErrorMessage('GitHub authentication failed.');
        return null;
    }
};

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "live-collab" is now active!');

    const userId = user_${Date.now()}; // Generate a unique user ID
    let documentId: string | null = null; // Variable to store the current document ID
    const collaboratorCursors: Record<string, vscode.TextEditorDecorationType> = {}; // Store cursor decorations
    let displayName: string | null = null; // To store GitHub display name

    // Authenticate the user via GitHub when the extension is activated
    authenticateWithGitHub().then((name) => {
        if (name) {
            displayName = name;
            console.log(Authenticated as: ${displayName});
        } else {
            vscode.window.showErrorMessage('Could not retrieve GitHub user information.');
        }
    });

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
                    contentText:  ${displayName || collabUserId}, // Use GitHub display name, fallback to userId
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
        if (!displayName) {
            vscode.window.showErrorMessage('You must authenticate with GitHub first!');
            return;
        }

        // Prompt the user to choose their role
        const role = await vscode.window.showQuickPick(['Host', 'Collaborator'], {
            placeHolder: 'Are you a Host or a Collaborator?',
        });

        if (!role) {
            vscode.window.showErrorMessage('Role selection canceled.');
            return;
        }

        const document = vscode.window.activeTextEditor?.document;
        if (!document && role === 'Host') {
            vscode.window.showErrorMessage('No active document found! Host must have a document open.');
            return;
        }

        if (role === 'Host') {
            // Generate a random document ID for the host
            documentId = generateDocumentId();
            vscode.window.showInformationMessage(Share this Document ID with your collaborators: ${documentId});

            // Start collaboration for the host
            if (document) {
                syncDocument(documentId, document.getText());
                listenForCursorUpdates(documentId, (cursors) => {
                    showCollaboratorsCursors(cursors);
                });
                listenForDocumentUpdates(documentId, (content) => {
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        const currentText = editor.document.getText();
                        if (currentText !== content && content !== null) {
                            const fullRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
                            editor.edit((editBuilder) => {
                                editBuilder.replace(fullRange, content);
                            });
                        }
                    }
                });
            }
        } else if (role === 'Collaborator') {
            // Ask for the document ID from the collaborator
            const inputId = await vscode.window.showInputBox({
                prompt: 'Enter the Document ID provided by the Host',
                placeHolder: 'Enter Document ID',
            });

            if (!inputId) {
                vscode.window.showErrorMessage('No Document ID provided.');
                return;
            }

            documentId = inputId;

            // Automatically open the document and sync its content
            listenForDocumentUpdates(documentId, (content) => {
                // Check if there's an open document and sync the content
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const currentText = editor.document.getText();
                    if (currentText !== content && content !== null) {
                        const fullRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
                        editor.edit((editBuilder) => {
                            editBuilder.replace(fullRange, content);
                        });
                    }
                } else {
                    // Open a new untitled document if none is open
                    vscode.workspace.openTextDocument({ content }).then((doc) => {
                        vscode.window.showTextDocument(doc);
                    });
                }
            });

            listenForCursorUpdates(documentId, (cursors) => {
                showCollaboratorsCursors(cursors);
            });

            vscode.window.showInformationMessage(Joined collaboration on Document ID: ${documentId});
        }
    });

    /**
     * Command to leave collaboration.
     */
    let leaveCollaborationDisposable = vscode.commands.registerCommand('live-collab.leaveCollaboration', async () => {
        if (!documentId || !userId) {
            vscode.window.showErrorMessage('No active collaboration session to leave.');
            return;
        }
    
        const editor = vscode.window.activeTextEditor;
    
        if (editor) {
            const document = editor.document;
            const content = document.getText();
    
            // Save the collaborator's final changes to the shared document
            await syncRealTimeDocumentUpdates(documentId, content);
    
            // Remove collaborator's cursor decorations only
            if (collaboratorCursors[userId]) {
                collaboratorCursors[userId].dispose();
                delete collaboratorCursors[userId];
            }
    
            // Notify the user and ensure they can save their local changes
            if (document.isDirty) {
                await document.save();
            }
    
            vscode.window.showInformationMessage('Your changes have been saved. You have left the collaboration.');
        }
    
        // Ensure the session is reset for the collaborator but does not impact the host or others
        documentId = null; // Reset for this user
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

    /**
     * Track and sync text changes in the document.
     */
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (!documentId) return; // Only track text changes if collaboration is active

        const document = event.document;
        if (document) {
            const content = document.getText();
            syncRealTimeDocumentUpdates(documentId, content); // Sync the updated content to Firebase
        }
    });

    /**
     * Handle collaborator leaving
     */
    vscode.workspace.onDidCloseTextDocument((document) => {
        if (documentId && userId) {
            // Save the collaborator's final state to the shared document
            const content = document.getText();
            syncRealTimeDocumentUpdates(documentId, content);
    
            // Remove only the collaborator's cursor, leaving the document content intact
            removeCollaboratorCursor(documentId, userId);
    
            // Clean up cursor decorations for this collaborator
            if (collaboratorCursors[userId]) {
                collaboratorCursors[userId].dispose();
                delete collaboratorCursors[userId];
            }
        }
    });
    

    // Add the command to the extension's context subscriptions
    context.subscriptions.push(startCollaborationDisposable, leaveCollaborationDisposable);
}

export function deactivate() {
    // Clean up resources when the extension is deactivated
    console.log('Extension "live-collab" has been deactivated.');
}
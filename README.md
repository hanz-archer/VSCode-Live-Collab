# VSCode-Live-Collab
**Live Collaboration Extension for VS Code**

This extension enables real-time collaboration between multiple users editing the same file in VS Code.

## Features:
- Syncs the content of a file in real-time across multiple VS Code instances.
- Allows easy collaboration using a unique 5-digit alphanumeric Document ID for each file.
- Requires GitHub sign-in for access control and collaboration setup.

## Requirements:
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (for building and running the extension)
- [Firebase](https://firebase.google.com/) (or another backend service for syncing files)
- [GitHub Account](https://github.com/) (for authentication)

## Installation Steps

### Prerequisites:
1. **Install VS Code**: If you haven't already, download and install [VS Code](https://code.visualstudio.com/).
2. **Install Node.js**: Ensure that Node.js is installed. You can download it from [here](https://nodejs.org/).
3. **Clone or Download the Extension**:
   - Clone this repository or download the extension code to your local machine:

   ```bash
   git clone https://github.com/your-repo/live-collab
   cd live-collab

## Install Dependencies:
In the terminal, run the following command to install all necessary dependencies:

bash
Copy code
npm install
Build the Extension:
Run the following command to compile the TypeScript files:

bash
Copy code
npm run compile
Package the Extension:
To create the VSIX file for installation, run:

bash
Copy code
vsce package
Loading the Extension in VS Code (Development Mode):

Press F5 to open a new VS Code window in Extension Development Host mode.
Once the new window opens, the extension should be active.

Installing the Extension in Another VS Code Instance:
Open another instance of VS Code (Ctrl + Shift + N or Cmd + Shift + N on Mac).

## Install the Extension:
Open the Extensions panel in VS Code.
Click the three dots (...) at the top of the panel and select Install from VSIX.
Choose the .vsix file generated during the packaging step and install it.
How to Collaborate (Steps for Both Users)
 
## Sign In and Choose Collaboration Mode:
### User 1 (Host):

Sign in with your GitHub account within the extension. This is required to begin the collaboration.

After signing in, you will be prompted to choose between "Collab" or "Host".

Select "Host" to initiate a new collaboration session.

Once you choose "Host", the extension will generate a 5-digit alphanumeric Document ID (e.g., abc12).

Share this Document ID with User 2 to allow them to join the session.

## User 2 (Collaborator):
### Sign in with your GitHub account within the extension.

After signing in, choose "Collab" to join an existing collaboration session.

Enter the 5-digit alphanumeric Document ID provided by User 1 (e.g., abc12).

## User 1 (Host):
Open the file they want to collaborate on in their VS Code window.

Open the Command Palette by pressing Ctrl + Shift + P (or Cmd + Shift + P on Mac).

Search for and select Start Collaboration.

Enter a Document ID (this will be automatically generated as a 5-digit alphanumeric code once you choose "Host").

Once the document is synced, begin editing the file. Changes will be saved to Firebase (or the backend) in real-time.

## User 2 (Collaborator):
Open the same file in their own VS Code window.

Install and load the extension, as mentioned above.

Open the Command Palette (Ctrl + Shift + P or Cmd + Shift + P on Mac).

Search for and select Start Collaboration.

Enter the same 5-digit alphanumeric Document ID that User 1 provided (e.g., abc12).

Once connected, both users can now edit the file simultaneously, and changes will be synced in real-time.

## Troubleshooting
### Document Not Syncing:
Ensure both users are using the same 5-digit alphanumeric Document ID.
Verify that Firebase (or your real-time backend) is properly set up and active.
Ensure both VS Code instances have the extension running.

## Error Messages:
Check the Output panel (View > Output) in VS Code for any error messages related to the extension.
Additional Information
This extension uses Firebase (or another real-time backend) for syncing the document in real-time. If you prefer to use a different backend, you can replace the Firebase logic in firebaseService.ts with your own real-time syncing solution.
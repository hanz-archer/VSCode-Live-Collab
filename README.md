# VSCode-Live-Collab
# Live Collaboration Extension for VS Code

This extension allows real-time collaboration between multiple users editing the same file in VS Code.

## Features:
- Syncs the content of a file in real-time across multiple VS Code instances.
- Easy collaboration with a unique Document ID for each file.

## Requirements:
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (for building and running the extension)
- [Firebase](https://firebase.google.com/) (or another backend service for syncing files)

## Installation Steps

### Prerequisites:
1. **Install VS Code**: If you haven't already, download and install [VS Code](https://code.visualstudio.com/).
2. **Install Node.js**: Ensure that Node.js is installed. You can download it from [here](https://nodejs.org/).
3. **Clone or Download the Extension**:
   - Clone this repository or download the extension code to your local machine.

   ```bash
   git clone https://github.com/your-repo/live-collab
   cd live-collab
Install Dependencies:

In the terminal, run the following command to install all necessary dependencies.
bash
Copy code
npm install
Build the Extension:

Run the following command to compile the TypeScript files.
bash
Copy code
npm run compile
Package the Extension:

To create the VSIX file for installation, run:
bash
Copy code
vsce package
Loading the Extension in VS Code (for Development Mode):
Press F5 to open a new VS Code window in Extension Development Host mode.
Once the new window is open, the extension should be active.
Installing the Extension in Another VS Code Instance (for Both Users to Collaborate):
Open Another Instance of VS Code: You can open a new window using Ctrl + Shift + N (or Cmd + Shift + N on Mac).
Install the Extension:
If you haven't already installed the extension, you can load it by navigating to the Extensions panel in VS Code.
Click on the three dots (...) at the top of the panel and select Install from VSIX.
Choose the .vsix file generated during the packaging step, and install it.
How to Collaborate (Steps for Both Users)
User 1:

Open the file they want to collaborate on in their VS Code window.
Open the Command Palette by pressing Ctrl + Shift + P (or Cmd + Shift + P on Mac).
Search for and select Start Collaboration.
Enter a Document ID (for testing, you can use 1234 as the default ID).
Once the document is synced, you can begin editing the file. Changes will be saved to Firebase in real-time.
User 2:

Open the same file in their own VS Code window.
Install and load the extension, as mentioned in the previous section.
Open the Command Palette (Ctrl + Shift + P or Cmd + Shift + P on Mac).
Search for and select Start Collaboration.
Enter the same Document ID that User 1 provided (1234 or any other ID they use).
Once connected, both users can now edit the file simultaneously, and changes will be synced in real-time.
Troubleshooting
Document Not Syncing:

Make sure both users are using the same Document ID.
Ensure that Firebase (or the real-time backend you're using) is properly set up and active.
Verify that both VS Code instances have the extension running.
Error Messages:

Check the Output panel (View > Output) in VS Code for any error messages related to the extension.
Additional Information
This extension uses Firebase (or another real-time backend) for syncing the document in real-time. You can replace the Firebase logic in firebaseService.ts with your own real-time backend.

markdown
Copy code

### Summary of Key Steps for Collaboration:

1. **Install and load the extension** in both VS Code instances.
2. **Open the same file** in both VS Code windows.
3. **Run the 'Start Collaboration' command** and use the **same Document ID** for both users (default `1234`).
4. **Edit the file simultaneously** and see real-time updates.

Let me know if you need more modifications or details!
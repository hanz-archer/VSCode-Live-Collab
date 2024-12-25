# VS Code Live Collaboration Extension Project

A real-time collaboration extension for Visual Studio Code that enables multiple users to edit the same file simultaneously. Users can see each other's cursor positions and changes in real-time.

## Features

- 🔄 Real-time document synchronization
- 👥 Multiple user collaboration
- 🔒 Secure GitHub authentication
- 📍 Live cursor position tracking
- 🎯 Simple 5-digit room system
- 👤 User presence indicators

## Prerequisites

Before installing the extension, ensure you have:

- [Visual Studio Code](https://code.visualstudio.com/) 1.95.0 or higher
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- A [GitHub](https://github.com/) account for authentication

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Code ta Bai!"
4. Click Install

### From Source

1. Clone the repository:
```bash
git clone https://github.com/hanz-archer/VSCode-Live-Collab.git
cd VSCode-Live-Collab
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run compile
```

4. Package the extension:
```bash
vsce package
```

5. Install the generated .vsix file in VS Code:
   - Press Ctrl+Shift+P
   - Type "Install from VSIX"
   - Select the generated .vsix file

## Usage

### Starting a Collaboration Session

1. **Host:**
   - Open the file you want to collaborate on
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Start Collaboration"
   - Select "Host" when prompted
   - Share the generated 5-digit code with collaborators

2. **Collaborator:**
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Start Collaboration"
   - Select "Collaborator" when prompted
   - Enter the 5-digit code provided by the host

### Features in Action

- **Real-time Editing:** All changes are instantly synchronized between participants
- **Cursor Tracking:** See other users' cursor positions with their GitHub usernames
- **Authentication:** Secure access through GitHub authentication

## Troubleshooting

### Common Issues

1. **Connection Issues:**
   - Ensure you have a stable internet connection
   - Verify that the 5-digit code is correct
   - Try rejoining the collaboration session

2. **Authentication Problems:**
   - Make sure you're signed in to GitHub
   - Try signing out and back in to VS Code
   - Check if GitHub services are operational

3. **Sync Issues:**
   - Close and reopen the file
   - Restart the collaboration session
   - Check VS Code's output panel for error messages

## Security

- All communications are secured through Firebase
- GitHub authentication ensures user identity
- Document sharing is limited to those with the correct 5-digit code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with by Hans Archer Dalubatan - Student

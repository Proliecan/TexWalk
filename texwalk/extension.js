// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "texwalk" is now active!');
	vscode.window.showInformationMessage('Congratulations, your extension "texwalk" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('texwalk.umlautCorection', function () {
		// The code you place here will be executed every time your command is executed

		// get open latex document
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}
		// return if editor is not a latex document
		if (editor.document.languageId != "latex") {
			return;
		}

		// get document text
		let document = editor.document;
		let text = document.getText();

		// get regex for umlaut in latex format
		let regex = /"[aouAOUsS]/g;
		// get all matches
		let matches = text.match(regex);
		// return if no matches
		if (!matches) {
			return;
		}
		// for each match
		for (let i = 0; i < matches.length; i++) {
			// get match
			let match = matches[i];

			// replace latex umlaut with utf-8 umlaut
			match = match.replace('"a', 'ä');
			match = match.replace('"o', 'ö');
			match = match.replace('"u', 'ü');
			match = match.replace('"A', 'Ä');
			match = match.replace('"O', 'Ö');
			match = match.replace('"U', 'Ü');
			match = match.replace('"s', 'ß');
			match = match.replace('"S', 'ẞ');

			// replace match in text
			text = text.replace(matches[i], match);

			/* 
			I know. I know. It is not very elegant, but it works.
			*/
		}

		// write text to document
		editor.edit(editBuilder => {
			editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(document.lineCount + 1, 0)), text);
		});

		// // Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from TexWalk!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { 
	vscode.window.showInformationMessage('Deactivating TexWalk...');
 }

module.exports = {
	activate,
	deactivate
}

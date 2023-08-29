
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	vscode.window.showInformationMessage('Activating TexWalk...');

	let disposable = vscode.commands.registerCommand('texwalk.umlautCorection', function () {

		// get open latex document
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No tyst document open!');
			return; // No open text editor
		}
		// return if editor is not a latex document
		if (editor.document.languageId != "typst") {
			vscode.window.showInformationMessage('No tyst document open!');
			return;
		}

		// get document text
		let document = editor.document;
		let text = document.getText();

		// get regex for umlaut in latex format
		let regex = /\\[aouAOUsS]/g;
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
			match = match.replace('\\a', 'ä');
			match = match.replace('\\o', 'ö');
			match = match.replace('\\u', 'ü');
			match = match.replace('\\A', 'Ä');
			match = match.replace('\\O', 'Ö');
			match = match.replace('\\U', 'Ü');
			match = match.replace('\\s', 'ß');
			match = match.replace('\\S', 'ẞ');

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

	});

	context.subscriptions.push(disposable);
}

function deactivate() { 
	vscode.window.showInformationMessage('Deactivating TexWalk...');
 }

module.exports = {
	activate,
	deactivate
}

import * as vscode from "vscode";
import path = require("path");

import {
  getGlobalSnippetsDirectory,
  fetchSnippetsList,
  downloadSnippets as downloadSnippetsBlob,
} from "../../utils/lib";

export async function downloadSnippets(context: vscode.ExtensionContext) {
  const snippets = await fetchSnippetsList();
  const selected = await vscode.window.showQuickPick(snippets, {
    canPickMany: true,
  });

  if (selected) {
    const snippetsPath = getGlobalSnippetsDirectory(context);
    await downloadSnippetsBlob(selected, snippetsPath);
    vscode.window.showInformationMessage("下载snippets:完成");
  }
}

import * as vscode from "vscode";
import path = require("path");
import fsPromise = require("fs/promises");

import {
  getGlobalSnippetsDirectory,
  fetchSnippetsList,
  downloadSnippets as downloadSnippetsBlob,
  isSnippet,
  SnippetMeta,
} from "../../utils/lib";

type SnippetMap = Record<string, SnippetMeta>;

async function getInstalledSnippets(directory: string) {
  const remoteSnippets = await fetchSnippetsList();
  const remoteSnippetMap = remoteSnippets.reduce((map, snippet) => {
    map[snippet.name] = snippet;
    return map;
  }, {} as SnippetMap);
  const files = await fsPromise.readdir(directory);
  return files.reduce((snippets, fileName) => {
    if (isSnippet(fileName) && remoteSnippetMap[fileName]) {
      snippets.push(remoteSnippetMap[fileName]);
    }

    return snippets;
  }, [] as Array<SnippetMeta>);
}

export async function updateSnippets(context: vscode.ExtensionContext) {
  const snippetsPath = getGlobalSnippetsDirectory(context);
  const installedSnippets = await getInstalledSnippets(snippetsPath);

  if (installedSnippets.length) {
    await downloadSnippetsBlob(installedSnippets, snippetsPath);
    vscode.window.showInformationMessage("更新完成");
  } else {
    vscode.window.showWarningMessage('未安装已知的snippet, 请先运行RC: Download Snippets安装.');
  }
}

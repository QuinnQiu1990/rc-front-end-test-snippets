import { listTree, getFile } from "./request";
import { ExtensionContext, QuickPickItem } from "vscode";
import path = require("path");
import fs = require("fs");

export interface SnippetMeta {
  name: string;
  id: string;
  path: string;
}

interface SnippetOption extends SnippetMeta, QuickPickItem {}

export function isSnippet(fileName: string) {
  const snippetsSuffixRegexp = /\.code-snippets$/;
  return fileName.match(snippetsSuffixRegexp);
}

export async function fetchSnippetsList(): Promise<Array<SnippetOption>> {
  const snippetsSuffixRegexp = /\.code-snippets$/;
  return listTree().then(({ data }: { data: Array<SnippetMeta> }) =>
    data.reduce((snippets, item) => {
      if (isSnippet(item.name)) {
        snippets.push({
          ...item,
          label: item.name.replace(snippetsSuffixRegexp, ""),
        });
      }

      return snippets;
    }, [] as Array<SnippetOption>)
  );
}

export async function downloadSnippets(
  snippets: Array<SnippetMeta>,
  directory: string
) {
  return Promise.all(
    snippets.map((snippet) =>
      getFile(encodeURIComponent(snippet.path)).then(({ data }) => {
        fs.writeFile(
          path.join(directory, snippet.name),
          data,
          { flag: "w" },
          () => {}
        );
      })
    )
  );
}

export function getGlobalSnippetsDirectory(context: ExtensionContext) {
  return path.resolve(
    context.globalStorageUri.path.replace(/globalStorage.+$/, "snippets")
  );
}

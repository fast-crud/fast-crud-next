import less from "@shikijs/langs/less";
import tsx from "@shikijs/langs/tsx";
import vue from "@shikijs/langs/vue";
import dark from "@shikijs/themes/github-dark";
import light from "@shikijs/themes/github-light";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const highlighter = createHighlighterCore({
  langs: [vue, tsx, less],
  themes: [light, dark],
  engine: createJavaScriptRegexEngine(),
});

export async function highlightDemoSource(source: string): Promise<string> {
  return (await highlighter).codeToHtml(source, {
    lang: "vue",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}

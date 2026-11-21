# Fn theme tokens

Fn CRUD components work without a component framework. The default light and dark token values live in `tokens.css`; applications can override the `--fn-*` variables directly.

The optional Naive UI adapter lives under `naive/` and is imported only by applications that already use Naive UI:

```ts
import { useThemeVars } from "naive-ui";
import { useNaiveTheme } from "./naive";

useNaiveTheme(useThemeVars());
```

The Element Plus adapter lives under `element/`. Call `useElementTheme()` to enable the Fn-to-Element CSS variable mapping:

```ts
import { useElementTheme } from "@fast-crud/fast-crud-next/theme/element";

useElementTheme();
```

The Fast Crud Next demo uses the standalone token defaults and does not install a UI component framework.

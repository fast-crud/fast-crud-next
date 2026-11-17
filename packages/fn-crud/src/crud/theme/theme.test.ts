import { describe, expect, it } from "vitest";
import { createFnThemeStyle, mapAntdvThemeToFnTokens } from "./index";
import { mapNaiveThemeToFnTokens } from "./naive/naive";

describe("Fn theme adapters", () => {
  it("uses Fn-prefixed AntDV token names as CSS variables", () => {
    const tokens = mapAntdvThemeToFnTokens({ colorPrimary: "#1677ff", colorBgContainer: "#141210", borderRadius: 6 });

    expect(createFnThemeStyle(tokens)).toEqual({
      "--fn-color-primary": "#1677ff",
      "--fn-color-bg-container": "#141210",
      "--fn-border-radius": "6px",
    });
  });

  it("maps Naive common and DataTable tokens to Fn table tokens", () => {
    const tokens = mapNaiveThemeToFnTokens({
      common: { primaryColor: "#18a058", bodyColor: "#101010", tableColor: "#181818", textColor1: "#eeeeee", borderColor: "#333333", borderRadius: "8px" },
      DataTable: { thColor: "#222222", tdColorHover: "#292929" },
    });

    expect(tokens).toMatchObject({
      colorPrimary: "#18a058",
      colorBgBase: "#101010",
      colorBgContainer: "#181818",
      colorText: "#eeeeee",
      colorFillAlter: "#222222",
      colorFillSecondary: "#292929",
      colorBorder: "#333333",
      borderRadius: "8px",
    });
  });

  it("maps the flat token shape returned by Naive useThemeVars", () => {
    const tokens = mapNaiveThemeToFnTokens({ primaryColor: "#63e2b7", bodyColor: "#101014", tableColor: "#18181c" });

    expect(tokens).toMatchObject({
      colorPrimary: "#63e2b7",
      colorBgBase: "#101014",
      colorBgContainer: "#18181c",
    });
  });

  it("creates overrides only for provided Fn tokens", () => {
    const style = createFnThemeStyle({ colorPrimary: "#18a058" });

    expect(style).toEqual({ "--fn-color-primary": "#18a058" });
  });
});

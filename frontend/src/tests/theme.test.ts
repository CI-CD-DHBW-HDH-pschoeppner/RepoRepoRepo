import { themes } from "../logic/theme";

describe("check themes for completeness", () => {
  themes.forEach(function (theme) {
    const theme_CSS = theme.CSS();
    const CSS_tags = theme_CSS.split(";");

    it(`checking primary for theme ${theme.name}`, () => {
      expect(CSS_tags[0]).toMatch("--primary: ");
      CSS_tags[0] = CSS_tags[0].slice(11);
      expect(CSS_tags[0]).toMatch(/#[0-9a-fA-F]+/g);
      CSS_tags[0] = CSS_tags[0].slice(7);
      expect(CSS_tags[0]).toBe("");
    });

    it(`checking secondary for theme ${theme.name}`, () => {
      expect(CSS_tags[1]).toMatch(" --secondary: ");
      CSS_tags[1] = CSS_tags[1].slice(14);
      expect(CSS_tags[1]).toMatch(/#[0-9a-fA-F]+/g);
      CSS_tags[1] = CSS_tags[1].slice(7);
      expect(CSS_tags[1]).toBe("");
    });

    it(`checking primaryAccent for theme ${theme.name}`, () => {
      expect(CSS_tags[2]).toMatch(" --primaryAccent: ");
      CSS_tags[2] = CSS_tags[2].slice(18);
      expect(CSS_tags[2]).toMatch(/#[0-9a-fA-F]+/g);
      CSS_tags[2] = CSS_tags[2].slice(7);
      expect(CSS_tags[2]).toBe("");
    });

    it(`checking secondaryAccent for theme ${theme.name}`, () => {
      expect(CSS_tags[3]).toMatch(" --secondaryAccent: ");
      CSS_tags[3] = CSS_tags[3].slice(20);
      expect(CSS_tags[3]).toMatch(/#[0-9a-fA-F]+/g);
      CSS_tags[3] = CSS_tags[3].slice(7);
      expect(CSS_tags[3]).toBe("");
    });

    it(`checking background for theme ${theme.name}`, () => {
      expect(CSS_tags[4]).toMatch(" --background: ");
      CSS_tags[4] = CSS_tags[4].slice(15);
      expect(CSS_tags[4]).toMatch(/#[0-9a-fA-F]+/g);
      CSS_tags[4] = CSS_tags[4].slice(7);
      expect(CSS_tags[4]).toBe("");
    });

    it(`checking for additional parameters for theme ${theme.name}`, () => {
      expect(CSS_tags.length).toBe(5);
    });
  });
});

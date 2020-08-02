import locale from "./locale";
import en from "./locale/en.json";
import ko from "./locale/ko.json";

describe("Test locale", () => {
  test("is english", () => {
    const actual = locale("en");
    expect(actual).toBe(en);
  });

  test("is korean", () => {
    const actual = locale("ko");
    expect(actual).toBe(ko);
  });

  test("is not supported language", () => {
    expect(() => locale("?")).toThrow(Error);
  });
});

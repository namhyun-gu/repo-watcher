import Utils from "./utils";
import { Repository } from "./interfaces";

describe("Test Utils.toRepository", () => {
  test("is correct input", () => {
    const actual = Utils.toRepository("owner/name");
    const expected = <Repository>{
      owner: "owner",
      name: "name",
    };
    expect(actual).toEqual(expected);
  });

  test("is no owner input", () => {
    const actual = Utils.toRepository("/name");
    expect(actual).toBeUndefined();
  });

  test("is no name input", () => {
    const actual = Utils.toRepository("owner/");
    expect(actual).toBeUndefined();
  });

  test("is incorrect input", () => {
    const actual = Utils.toRepository("isnotrepository");
    expect(actual).toBeUndefined();
  });
});

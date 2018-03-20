const expect = require("expect");

const { isRealString } = require("./validation");

describe("isRealString validation", () => {
  it("should reject non-string values", () => {
    let str = 9;
    let result = isRealString(str);

    expect(result).toBe(false);
  });
  it("should reject string only with spaces", () => {
    let str = "    ";
    let result = isRealString(str);

    expect(result).toBe(false);
  });
  it("should allow strings with non-space characters", () => {
    let str = " This is a non empty string ";
    let result = isRealString(str);

    expect(result).toBe(true);
  });
});

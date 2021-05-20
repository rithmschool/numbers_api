const { schema } = require("../graphql/schema/schema");

describe("Test static schema snapshot", () => {
  it("should contain types", () => {
    expect(schema.getType("Destination")).not.toBeNull();
    expect(schema.getType("Destination")).toBeDefined();
  });

  it("should not contain unregistered types", () => {
    expect(schema.getType("DonkeyDoodle")).toBeUndefined();
  });
});

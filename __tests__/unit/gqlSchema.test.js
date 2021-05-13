
const { schema } = require('../../graphql/schema/Schema');

describe('Test static schema snapshot', () => {
    it('should contain types', () => {
        console.log('schema type here', schema);
        expect(schema.getType("Number")).not.toBeNull();
        expect(schema.getType("Number")).toBeDefined();
    })

    it('should not contain unregistered types', () => {
        expect(schema.getType("DonkeyDoodle")).toBeUndefined();
    })
})
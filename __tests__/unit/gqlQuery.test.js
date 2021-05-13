const { resolvers } = require('../../graphql/schema/Resolvers');
const EasyGraphQLTester = require('easygraphql-tester');
const { typeDefs } = require('../../graphql/schema/TypeDefs');
const { schema } = require('../../graphql/schema/Schema');


describe('Test Queries', () => {
    let tester;

    beforeEach(() => {
        tester = new EasyGraphQLTester(schema);
    })

    it('Should return the correct query result', async () => {
        const query = `
            {
                getFacts(number: 100) {
                    trivia
                    math
                    year
                }
            }
        `    
        let result = await tester.graphql(query);
        result = result.data.getFacts;

        expect(Object.keys(result).length).toEqual(3);
        expect(result['trivia'].length).toEqual(9);

    })
})
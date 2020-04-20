import { mapFieldsFromApi } from '../../src/mapFromApi.js';

const mockAPIData = {
    data: {
        fullName: 'Homer Simpson',
        ageNumber: 40,
        location: {
            town: 'SpringField',
        },
    },
    favoriteFood: ['beer', 'pizza', 'burger'],
};

describe('mapFieldsFromApi', () => {
    it('should map the fields according to the mapping configuration', () => {
        const mapping = {
            name: 'data.fullName',
            age: 'data.ageNumber',
            homeTown: 'data.location.town',
            likedFood: 'favoriteFood',
            firstName: (mappedData, response) => {
                return response.data.fullName.split(' ')[0];
            },
            birthYear: (mappedData, response) => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - mappedData.age)
                return date.getFullYear();
            },
            transformFromApi: (mappedData, response) => {
                return {
                    ...mappedData,
                    beersPerDay: 1,
                };
            },
            transformForApi: () => { },
        };

        const expectedDate = new Date();
        expectedDate.setFullYear(expectedDate.getFullYear() - mockAPIData.data.ageNumber)

        const expectedResult = {
            name: mockAPIData.data.fullName,
            age: mockAPIData.data.ageNumber,
            homeTown: mockAPIData.data.location.town,
            likedFood: mockAPIData.favoriteFood,
            firstName: 'Homer',
            birthYear: expectedDate.getFullYear(),
            beersPerDay: 1,
        };

        const mappedResult = mapFieldsFromApi(mockAPIData, mapping);
        expect(mappedResult).toEqual(expectedResult);
    })

    it('should throw an error if not using transformForApi with a computed value', () => {
        const mapping = {
            name: 'data.fullName',
            firstName: () => {},
        };

        const mapFunctionCall = () => { mapFieldsFromApi(mockAPIData, mapping) };
        expect(mapFunctionCall)
            .toThrow(Error('transformForApi function must be provided when using function values'));
    });

    it('should throw an error if not using transformForApi with transformFromApi', () => {
        const mapping = {
            name: 'data.fullName',
            transformFromApi: () => {},
        };

        const mappingFunction = () => { mapFieldsFromApi(mockAPIData, mapping) };
        expect(mappingFunction)
            .toThrow(Error('transformForApi function must be provided when using transformFromApi'));
    });
});

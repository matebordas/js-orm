import { mapFieldsFromApi, mapFieldsForApi } from '../../src';

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

describe('mapFieldsForApi', () => {
    it('should reverse map the fields to their original places names', () => {
        const mapping = {
            name: 'data.fullName',
            age: 'data.ageNumber',
            homeTown: 'data.location.town',
            likedFood: 'favoriteFood',
        };

        const mappedFEData = mapFieldsFromApi(mockAPIData, mapping);

        const expectedResult = {
            data: {
                fullName: 'Homer Simpson',
                ageNumber: 40,
                location: {
                    town: 'SpringField',
                },
            },
            favoriteFood: ['beer', 'pizza', 'burger'],
        };

        const backendModel = mapFieldsForApi(mappedFEData, mapping);
        expect(backendModel).toEqual(expectedResult);
    });

    it('should place data under the entityName field', () => {
        const mapping = {
            entityName: 'simpson',
            name: 'data.fullName',
            age: 'data.ageNumber',
            homeTown: 'data.location.town',
            likedFood: 'favoriteFood',
        };
        const mappedFEData = mapFieldsFromApi(mockAPIData, mapping);

        const expectedResult = {
            simpson: {
                data: {
                    fullName: 'Homer Simpson',
                    ageNumber: 40,
                    location: {
                        town: 'SpringField',
                    },
                },
                favoriteFood: ['beer', 'pizza', 'burger'],
            },
        };

        const backendModel = mapFieldsForApi(mappedFEData, mapping);
        expect(backendModel).toEqual(expectedResult);
    });

    it('should reverse map fields from nested fields', () => {
        const mapping = {
            entityName: 'simpson',
            ['data.name']: 'data.fullName',
            ['data.age']: 'data.ageNumber',
            ['data.homeTown']: 'data.location.town',
            ['data.food.likedFood']: 'favoriteFood',
        };

        const mappedFEData = mapFieldsFromApi(mockAPIData, mapping);

        const expectedResult = {
            simpson: {
                data: {
                    fullName: 'Homer Simpson',
                    ageNumber: 40,
                    location: {
                        town: 'SpringField',
                    },
                },
                favoriteFood: ['beer', 'pizza', 'burger'],
            },
        };

        const backendModel = mapFieldsForApi(mappedFEData, mapping);
        expect(backendModel).toEqual(expectedResult);
    });

    it('should call transformForApi if there are function values', () => {
        const mapping = {
            name: 'data.fullName',
            firstName: (mappedData, response) => {
                return response.data.fullName.split(' ')[0];
            },
            transformForApi: (mappedData) => {
                return {
                    ...mappedData,
                    yearOfBirth: 1960,
                }
            },
        };

        const mappedFEData = mapFieldsFromApi(mockAPIData, mapping);

        const expectedResult = {
            data: {
                fullName: 'Homer Simpson',
            },
            yearOfBirth: 1960,
        };

        const backendModel = mapFieldsForApi(mappedFEData, mapping);
        expect(backendModel).toEqual(expectedResult);
    });

    it('should call transformForApi if there is a transformFromApi call', () => {
        const mapping = {
            name: 'data.fullName',
            transformFromApi: (mappedData, response) => {
                return {
                    ...mappedData,
                    yearOfBirth: 1959,
                }
            },
            transformForApi: (mappedData) => {
                return {
                    ...mappedData,
                    yearOfBirth: mappedData.yearOfBirth + 1,
                }
            },
        };

        const mappedFEData = mapFieldsFromApi(mockAPIData, mapping);
        const expectedResult = {
            data: {
                fullName: 'Homer Simpson',
            },
            yearOfBirth: 1960,
        };

        const backendModel = mapFieldsForApi(mappedFEData, mapping);
        expect(backendModel).toEqual(expectedResult);
    });
});

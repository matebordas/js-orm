import { mapFieldsFromApi } from '../../src/mapFromApi.js';
import { mapFieldsForApi } from '../../src/mapForApi.js';

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
});

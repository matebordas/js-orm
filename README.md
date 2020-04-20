# JS-ORM

## About
A simple library that allows you to map the backend API responses to the desired front-end data model and vice versa.

## Installation
Run:
```
npm i js-orm-lib
```
Import in your project like this:
```
import { mapFieldsFromApi, mapFieldsForApi } from 'js-orm-lib'
```

## Usage
Use the ```mapFieldsFromApi``` to map the data to the desired front-end object structure.
Use the ```mapFieldsForApi``` to map the previously changed object back to the backend structure.

#### Examples:
Let's say you are receiving the following data from the API:
```
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
```

We can do: 
```
const mapping = {
    name: 'data.fullName', // This maps the data in 'data.fullName' to the name field
    age: 'data.ageNumber',
    homeTown: 'data.location.town',
    likedFood: 'favoriteFood',
    firstName: (mappedData, response) => {  // We can create new fields with functions if we need additional transformation on the data
        return response.data.fullName.split(' ')[0];
    },
    birthYear: (mappedData, response) => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - mappedData.age)
        return date.getFullYear();
    },
    transformFromApi: (mappedData, response) => { // This allows us to manipulte the object as a whole
        return {
            ...mappedData,
            beersPerDay: 1,
        };
    },
    transformForApi: (mappedData) => { // This function will be called when calling the mapFieldsForApi()
        return {
          ...mappedData,
          needsMoreBeer: true,
        }
    },
};

const mappedResult = mapFieldsFromApi(mockAPIData, mapping);
```
Note that if you use a function value or call the `transformFromApi` you need to implement the `transformForApi`, otherwise the library will throw an error.
This is to minimise the chance of sending back and invalid data.

All the string path mappings will be reverse mapped when calling `mapFieldsForApi`, the function fields and fields added with `transformFromApi` will stay on the object.

For example if we call `mapFieldsForApi(mappedResult, mapping)` on the above data, we will get:
```
... fields added by functions
data: {
    fullName: 'Homer Simpson',
    ageNumber: 40,
    location: {
        town: 'SpringField',
    },
},
favoriteFood: ['beer', 'pizza', 'burger'],
```

**Nested mapping:**

We can also map values into nested fields using a mapping configuration like this:
```
const mapping = {
    ['data.name']: 'data.fullName',
    ['data.age']: 'data.ageNumber',
    ['data.homeTown']: 'data.location.town',
    ['data.food.likedFood']: 'favoriteFood',
};
const mappedResult = mapFieldsFromApi(mockAPIData, mapping);
```
This will output:
```
data: {
    name: 'Homer Simpson',
    age: 40,
    homeTown: SpringField,
    food: {
        likedFood: ['beer', 'pizza', 'burger'],
    },
}
```
**Entity name:**

If you specify an `entityName` on the mapping configuration, the `mapFieldsForApi` will place all the data inside a field by that name:

E.g.:
```
const mapping = {
    entityName: 'simpson',
    ...
};
```
Will give you:
```
simpson: {
    ... rest of your data
}
```
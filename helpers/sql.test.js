// Imports
const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require('../expressError');

describe("sqlForPartialUpdate", function () {
    test("works: case 1", function () {
      const result = sqlForPartialUpdate(
        { firstName: 'Aliya', age: 32 },
        { firstName: 'first_name', age: 'age' }
      );
      expect(result).toEqual({
        setCols: '"first_name"=$1, "age"=$2',
        values: ['Aliya', 32],
      });
    });
  
    test("works: case 2", function () {
      const result = sqlForPartialUpdate(
        { firstName: 'Aliya' },
        { firstName: 'first_name' }
      );
      expect(result).toEqual({
        setCols: '"first_name"=$1',
        values: ['Aliya'],
      });
    });
  
    test("throws BadRequestError if no data", function () {
      expect(() => sqlForPartialUpdate({}, {})).toThrow(BadRequestError);
    });
});
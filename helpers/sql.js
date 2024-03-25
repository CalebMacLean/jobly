const { BadRequestError } = require("../expressError");

/** Create a SQL query string for updating a subset of columns along with the values to update.
 * 
 * dataToUpdate: should be an object with keys and values to update.
 * 
 * jsToSql: should be an object where keys are the keys in dataToUpdate and the values are the 
 * corresponding column names in the table.
 * 
 * Returns { setCols, values }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // store the keys of the dataToUpdate object in an array
  const keys = Object.keys(dataToUpdate);
  // if there are no keys in the dataToUpdate object, throw a BadRequestError
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  // for key in keys, create a string that looks like '"first_name"=$1' and '"age"=$2'
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  
  // return an object
  return {
    // setCols is a string that looks like '"first_name"=$1, "age"=$2'
    setCols: cols.join(", "),
    // values is an array that looks like ['Aliya', 32]
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

"use strict"

const Account = use('App/Helpers/Account')
const Divisions = use('App/Models/Division')

/**
 * Get all acccount divisions unserialised
 * @param {account} current company
 * @returns {json} divisions
 */
const unserialised = async (auth) => {
  try {
      const account = await Account.currentunserialised(auth)
      const Divisions = await account.divisions().fetch()
      return Divisions
  } catch (error) {
      return false;
  }
}

/**
 * Get all account  divisions serialized
 * @param {account} serialised accounts
 * @returns {json} accounts
 */
const divisions = async (auth) => {
  const _unserialised = await unserialised(auth)
  return  _unserialised ? _unserialised.toJSON() : false
}


/**
 * Count divisions
 * @returns {integer} integer
 */
const count = async (auth) => {
  const _divisions = await divisions(auth)
  var count = 0
  for (var property in _divisions) {
    if (Object.prototype.hasOwnProperty.call(_divisions, property)) {
      count++;
    }
  }

  return count

}

module.exports = {
  unserialised,
  divisions,
  count
}
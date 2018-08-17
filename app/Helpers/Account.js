'use strict'

const Account = use('App/Models/Account')
const Company = use('App/Helpers/Company')

/**
 * Get all company accounts unserialised
 * @param {company} current company
 * @returns {json} accounts
 */
const unserialised = async (auth) => {
  try {
    
    const company = await Company.unserialised(auth)
    const Accounts = await company.accounts().fetch()

    return Accounts

  } catch (error) { 

    return false;

  }
}

/**
 * Get all company  accounts
 * @param {auth} serialised accounts
 * @returns {json} accounts
 */
const accounts = async (auth) => {

  const _unserialised = await unserialised(auth)

  return _unserialised.toJSON()

}

/**
 * Get current account in raw form
 * @param {auth} user
 * @returns {raw} account
 */
const currentunserialised = async (auth) => {

  const _unserialised = await unserialised(auth)

  return _unserialised

}

/**
 * Get current account
 * @param {company} account
 * @returns {json} account
 */
const current = async (auth) => {

  const _unserialised = await unserialised(auth)
  const _json = _unserialised.toJSON()

  return _json[0]

}

/**
 * Get current account
 * @param {company} account
 * @returns {json} account
 */
const count = async (auth) => {
  const _accounts = await unserialised(auth)
  const _json = _accounts.toJSON()

  var count = 0
  for (var property in _json) {
    if (Object.prototype.hasOwnProperty.call(_json, property)) {
      count++;
    }
  }

  return count

}

module.exports = {
  unserialised,
  accounts,
  current,
  currentunserialised,
  count
}
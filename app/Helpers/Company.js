'use strict'

const Company = use('App/Models/Company')

/**
 * Create copmany sessions
 * @param {auth} auth
 * @returns {session} company
 */
const session = async (auth) => {
  const user = await auth.getUser()
  try {
    const company = await user.company().fetch()
    const create = Session._get('company', company)
    return create
  } catch (error) {
    return false;
  }
}

/**
 * Get unserialised company
 * @param {auth} auth
 * @returns {json} company fields
 * @returns {boolean} false if a company does not exist 
 */
const unserialised = async (auth) => {
  const user = await auth.getUser()
  try {
    const company = await user.company().fetch()
    return company
  } catch (error) {
    return false;
  }
}

/**
 * Get company
 * @param {auth} auth
 * @returns {json} company fields
 * @returns {boolean} false if a company does not exist 
 */
const company = async (auth) => {
  const uCompany = await unserialised(auth)
  return uCompany ? uCompany.toJSON() : false
}

/**
 * Check if logged user is a company or agent
 * @param  {auth} auth
 * @return {boolean} True if logged user is company 
 */
const isCompany = async (auth) => {
  const user = await auth.getUser()
  try {
    const company = await user.company().fetch()
    return true
  } catch (error) {
    return false;
  }
}

module.exports = {
  session,
  unserialised,
  company,
  isCompany,
}
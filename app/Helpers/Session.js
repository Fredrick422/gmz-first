'use strict'

/**
 * Create New Session
 * @param {string} session name
 * @param {values} session values
 * @returns {boolean} false if a company does not exist 
 */
const create = async ({session, name, values}) => {
    return await session.put(name, values)
}

/**
 * Get session
 * @param {string} session name
 * @returns {session} return session
 */
const get = async ({session, name}) => {
    return await session.get(name)
}

/**
 * Get session create if not exist
 * @param {string} session name
 * @returns {session} return session
 */
const _get = async ({session, name, value}) => {
    const _exist = await exist(session, name)
    if (_exist) {
       return await get(name)
    }
    const _create = await create(session, value)
    if (_create) {
       return await get(name)
    }

    return false
}

/**
 * Check if session exist
 * @param {string} session name
 * @returns {boolean} true if session exist false if not
 */
const exist = async ({session , name}) => {
    const _session = await session.pull(name)
    if (_session) {
        return true;
    }

    return false;
}


module.exports = {
   create,
   exist,
   get,
   _get
}
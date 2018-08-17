"use-strict"

class AuthorizationService{
    verifyPermisssion({resourceid, ownerid}){
        if (resourceid != ownerid) {
            throw new Error() //invalid access exception
        }
    }
}

module.exports = new AuthorizationService()
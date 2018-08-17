"use-strict"

const Agent = use('App/Models/Agent')

class AuthorizationService{
    async agentAccount({id}){
        try {
            const agent = await Agent.query().where('id', id)
                .with('division.account').fetch()

            return agent[0].division.account.toJSON()

        } catch (error) {
            return false
        }
    }
}

module.exports = new AuthorizationService()
"use-strict"

const Agent = use('App/Models/Agent')
const User = use('App/Models/User')
const Account = use('App/Models/Account')
const Company = use('App/Models/Company')

class GlobalService{

    //get current user company
    async company(auth){
        const user = await auth.getUser()

        if(user.u_role == 3) {

            const company = await user.company().fetch()
            return company.toJSON()

        }else if (user.u_role == 4) {

            const agent = await Agent.query().where('user_id', user.id)
                .with('division.account.company').fetch()
            const toJSON = agent.toJSON()

            return toJSON.account.company
        }

        return false

    }

    //get agent account
    async account(auth){
        const user = await auth.getUser()
        if (user.u_role == 4) {
            const agent = await Agent.query().where('user_id', user.id)
                    .with('division.account').fetch()
            const toJSON = agent.toJSON()
            return toJSON[0].division.account
        }

        return false
            
    }

    //get all company accounts
    async accounts(auth){
        const user = await auth.getUser()
        try {
            const company = await Company.query().where('user_id', user.id)
                    .with('accounts').fetch()
            const toJSON = company.toJSON()
            return toJSON[0].accounts
        } catch (error) {
            return false
        }
    }

    //get current account counts
    async accountCount(auth){

        const user = await auth.getUser()
        const company = await Company.query().where('user_id', user.id)
                .with('accounts').fetch()
        const toJSON = company.toJSON()

        var count = 0
        for (var property in toJSON) {
            if (Object.prototype.hasOwnProperty.call(toJSON, property)) {
                count++;
            }
        }

        return count
    }

    //get agent division
    async division(auth){
        const user = await auth.getUser()
        if (user.u_role == 4) {
            const agent = Agent.query().where('user_id', user.id)
                .with('division').fetch()
            const toJSON = agent.toJSON()
            return toJSON[0].division
        }

        return false
    }

    //check if current user is admin
    async isSuperAdmin(auth){
        const user = await auth.getUser()
        if (user.u_role == 1) {
            return true
        }

        return false
    }

    //check if current user is admin
    async isAdmin(auth){
        const user = await auth.getUser()
        if (user.u_role == 2) {
            return true
        }

        return false
    }

    //check if current user is company
    async isCompany(auth){
        const user = await auth.getUser()
        if (user.u_role == 3) {
            return true
        }

        return false
    }

    //check if current user is agent
    async isAgent(auth){
        const user = await auth.getUser()
        if (user.u_role == 4) {
            return true
        }

        return false
    }
}

module.exports = new GlobalService()
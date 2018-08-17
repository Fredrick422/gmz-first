"use-strict"

const Company = use('App/Models/Company')
const Account = use('App/Models/Account')

class CurrentService{
    async account(auth, session){

        const user = await auth.getUser()
        try {

            const id = session.get('AccountId')
            if (id) {
                const account = await Account.find(id)
                return account.toJSON()
            }
            
            const company = await Company.query().where('user_id', user.id).with('accounts').fetch()
            const toJSON = company.toJSON()
            
            return toJSON[0].accounts[0]

        } catch (error) {
            return false
        }
    }
}

module.exports = new CurrentService()
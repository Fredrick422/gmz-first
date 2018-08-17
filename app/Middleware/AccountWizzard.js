'use strict'

const nAgent = use('App/Models/User')

class AccountWizzard {
  async handle({auth,response,view}, next) {
    const user = await auth.getUser()
    const company = user ? await user.company().fetch() : false
    const accounts = company ? await company.accounts().fetch() : false

    //const agents = await divisions.agents().fetch()

    //check if company setup is complete
    if (company) {
      if (company.c_setup_complete === 0) {
        return response.send(
          view.render('accounts.pages.wizzard')
        )
      } else {
        //check if accounts setup is complete
        if ('rows' in accounts && accounts['rows'] != '') {
          const vAccount = accounts.toJSON()
          const account = vAccount[0]
          if (account.a_setup_complete === 0) {
            return response.send(
              view.render('accounts.pages.wizzard', {
                company,
                account
              })
            )
          } else {
            //check if divisions setup is complete
            const aAccounts = accounts['rows'][0]
            const aDivisions = await aAccounts.divisions().fetch()
            if ('rows' in aDivisions && aDivisions['rows'] != '') {
              const divisions = aDivisions.toJSON()
              const division = divisions[0]
              if (division.d_setup_complete === 0) {
                return response.send(
                  view.render('accounts.pages.wizzard', {
                    company,
                    account,
                    division
                  })
                )
              } else {
                //check if agents setup is complete
                const uDivisions = aDivisions['rows'][0]
                const uAgents = await uDivisions.agents().fetch()
                if ('rows' in uAgents && uAgents['rows'] != '') {
                  const agents = uAgents.toJSON()
                  const agent = agents[0]
                  if (agent.a_setup_complete === 0) {
                    console.log('test')
                    const aAgent = await nAgent.find(agent.user_id)
                    //agent.assign(aAgent.toJSON())
                    return response.send( 
                      view.render('accounts.pages.wizzard', {
                        company,
                        account,
                        division,
                        agent
                      })
                    )
                  } else {
                    await next()
                  }
                } else {
                  return response.send(
                    view.render('accounts.pages.wizzard', {
                      company,
                      account,
                      division
                    })
                  )
                }
              }
            } else {
              return response.send(
                view.render('accounts.pages.wizzard', {
                  company,
                  account
                })
              )
            }
          }
        } else {
          return response.send(
            view.render('accounts.pages.wizzard', {
              company
            })
          )
        }
      }
    } else {
      return response.send(
        view.render('accounts.pages.wizzard')
      )
    }
    await next()
  }
}

module.exports = AccountWizzard

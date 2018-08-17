'use strict'

const Event = use('Event')
const Notification = use('App/Models/Notifications/Notification')
const CurrentService = use('App/Services/CurrentService')

class NotificationController {

    //list all notifications
    async index({response}) {
        const notifications = await Notification.query()
                .with('user')
                .with('type')
                .with('menu')
                .with('message')
                .with('sender')
        const toJSON = notifications.toJSON()

        return response.json(toJSON)
    }

    //list notification
    async list({params, response, auth}){
        const user = await auth.getUser()
        const id = user.id
        const list = await Notification.query()
                .where('recipient_id', id)
                .with('type')
                .with('menu')
                .with('message')
                .with('sender')
                .fetch()
        const notifications = list.toJSON()

        let html = '';        

        for (let i = 0; i < notifications.length; i++) {
           html = html + '<!-- Message --><a href="/notifications/' + notifications[i].id + '" class="message"><div class="btn btn-danger btn-circle"><i class="' + notifications[i].type.n_icon + '"></i></div><div class="mail-contnet"><h5>' + notifications[i].message.n_title + '</h5><span class="mail-desc"> ' + notifications[i].message.n_message + '</span><span class="time">9:30 AM</span> </div></a>'
        }
        return response.send(html)
    }

    //list all notification
    async listall({request, session, auth, view}){
        const Helpers = request.helpers
        Helpers.Account.current = await CurrentService.account(auth, session)
        const user = await auth.getUser()
        const id = user.id
        const list = await Notification.query()
                .where('recipient_id', id)
                .with('type')
                .with('menu')
                .with('message')
                .with('sender')
                .fetch()

        return view.render('accounts.pages.notifications', {
            Helpers,
            notifications: list.toJSON()
        })
    }

    async create() {}

    //store new notification
    async store({request, params}) {
        Event.emit('new::notification', {
                n_sender: false,
                recipient_id: Helpers.Company.company.user_id,
                n_type: 'system',
                n_urgent: true,
                n_title: 'Title',
                n_message: 'Accepted your invitation',

            })
    }

    async show() {
    }

    async edit() {}

    //update notifications
    async update({params, response}) {
        Event.emit('update::notification', {
                id: params.id,
            })
        
        return false
    }

    //delete notification
    async destroy({params, response}) {
        
        const notification = await Notification.find(params.id)

        if (!notification.n_seen) {
            try {

              const badge = await Badge.findBy('recipient_id', notification.recipient_id)
              badge.new_in = false
              await badge.save()

            } catch (error) {

            }
        }

        notification.merge({
            n_deleted: true
        })

        await notification.save()

        return response.json({
            completed: true
        })
    }
}

module.exports = NotificationController

"use-strict"

const Notification = use('App/Models/Notifications/Notification')
const NotificationTypes = use('App/Models/Notifications/Notificationtype')
const Message = use('App/Models/Notifications/Notificationmessage')
const Sender = use('App/Models/Notifications/Notificationsender')
const NotificationMenu = use('App/Models/Notifications/Notificationmenu')
const Badge = use('App/Models/Notifications/Notificationbadge')
const Menu = use('App/Models/Menu')

class NotificationService{
    async store(params){
        
        const notificationtype = await NotificationTypes.findBy('n_name', params.n_type)
        const message = new Message()
        const sender = new Sender()
        const notificationmenu = new NotificationMenu()
        const notification = await Notification.create({
            n_sender: (params.n_sender) ? params.n_sender : false,
            recipient_id: params.recipient_id,
            type_id: notificationtype.id,
            n_urgent: (params.n_urgent) ? params.n_urgent  : false
        })

        message.fill({
          n_title: params.n_title,
          n_message: params.n_message
        })

        await notification.message().save(message)

        if(params.n_menu == true) {
            const menu = await Menu.findBy('m_slug', params.m_slug)

            notificationmenu.fill({
               menu_id: menu.id
            })
            await notification.menu().save(notificationmenu)
        }

        if (params.n_sender == true) {
            sender.fill({
               menu_id: params.sender_id
            })
            await notification.sender().save(sender)
        }

        try {

            const  badge = await Badge.findBy('recipient_id', params.recipient_id)
            badge.new_in = true
            await badge.save()

        } catch (error) {

            const badge = await Badge.create({
                new_in: true,
                recipient_id: params.recipient_id
            })
        }

        return notification
    }

    async update(params){
        notification = await Notification.find(params.id)

        notification.merge({
            n_seen: true
        })

        try {

            const badge = await Badge.findBy('recipient_id', notification.recipient_id)
            badge.new_in = false
            await badge.save()

        } catch (error) {

        }

        return notification
    }

    async delete(params){
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

        return true
    }

    async badgecount(auth){
        const user = await auth.getUser()
        const badge = await Badge.findBy('recipient_id', user.id)
        
        return badge.n_count 
    }

    async badge(auth){

        const count = await this.badgecount(auth)
        
        if (count > 0) {
           return true 
        }

        return false
    }

}

module.exports = new NotificationService()
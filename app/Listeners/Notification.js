'use strict'

const Notification = exports = module.exports = {}

const notification = use('App/Services/NotificationService')

Notification.send = async (params) => {

    await notification.store(params)

}

Notification.update = async (params) => {
   
    await notification.update(params)

}

Notification.delete = async (params) => {

    await notification.delete(params)

}

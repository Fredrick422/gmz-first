'use-strict'

const Event = use('Event')
const Mail = use('Mail')

Event.on('new::notification', 'Notification.send')
Event.on('update::notification', 'Notification.update')
Event.on('delete::notification', 'Notification.delete')
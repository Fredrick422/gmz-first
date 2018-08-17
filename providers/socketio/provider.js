const { ServiceProvider } = require('@adonisjs/fold')

class SocketProvider extends ServiceProvider {
    register () {
        this.app.singleton('Socket/Io', () => {
            //const Config = this.app.use('Adonis/Src/Config')
            return new require('.')
        })
    }
}

module.exports = SocketProvider
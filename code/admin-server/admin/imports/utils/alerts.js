import alertify from 'alertifyjs'
import './alerts.less'

alertify.defaults.transition = 'zoom'
alertify.defaults.notifier.delay = 4
alertify.defaults.notifier.position = 'top-right'
alertify.defaults.notifier.classes.message = 'ajs-message ui message large'
const Alerts = {
  error(error) {
    return alertify.notify(`Sorry, we got an error: ${error}`, 'error')
  },
  success(text) {
    return alertify.notify(text, 'success')
  },
  warning(text) {
    return alertify.notify(text, 'warning')
  }
}

export default Alerts

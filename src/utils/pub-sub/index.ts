import PubSub from 'pubsub-js'

import { SubName } from './sub-name'

class PubSubUtil {
  /**
   * Subscribe to events
   * @param subName event name
   * @param callback event handling function
   * @returns subscription key (used to cancel subscription)
   */
  on(subName: SubName, callback: Function) {
    const key = PubSub.subscribe(subName, (_msg, data) => {
      callback(data)
    })
    return key
  }

  /**
   * publish event
   * @param subName event name
   * @param params parameters
   * @returns whether there is a subscription
   */
  emit(subName: SubName, params?: any) {
    return PubSub.publish(subName, params)
  }

  /**
   * unsubscribe
   * @param key subscription key
   */
  off(key: any) {
    PubSub.unsubscribe(key)
  }

  /**
   * Cancel all subscriptions to an event
   * @param subName event name
   */
  offAll(subName: SubName) {
    PubSub.unsubscribe(subName)
  }

  /**
   * Clear all subscriptions
   */
  clear() {
    PubSub.clearAllSubscriptions()
  }
}
export const pubSubUtil = new PubSubUtil()
export { SubName } from './sub-name'

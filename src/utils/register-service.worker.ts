import { registerWebPush } from '@/api/common'
import { commonModal } from '@/components/Modal/index'
import { getDeviceInfo } from '@/utils/common'
import { usePageVisibility } from '@/utils/composables/usePageVisibility'

const { isPageHidden } = usePageVisibility()

const deviceInfo = getDeviceInfo()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker?.register(`/service-worker.js?_t=${Date.now()}`)
}

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  var rawData = window.atob(base64)
  var outputArray = new Uint8Array(rawData.length)

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function subscribe() {
  navigator.serviceWorker?.ready
    .then(function (registration) {
      const vapidPublicKey = import.meta.env.VITE_PUSH_SERVER_PUBLIC_KEY
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

      // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
      // send notifications that don't have a visible effect for the user).
      return registration?.pushManager?.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      })
    })
    .then(function (subscription) {
      registerWebPush(subscription)
        .then(resp => {
          console.log('registerWebPush success:', resp)
        })
        .catch(err => {
          console.error('registerWebPush err:', err)
        })
    })
    .catch(() => {})
}

export function unsubscribe() {
  navigator.serviceWorker?.ready
    .then(function (registration) {
      return registration?.pushManager?.getSubscription()
    })
    .then(function (subscription) {
      if (!subscription) {
        return
      }
      return subscription.unsubscribe()
    })
    .catch(() => {})
}

export function initServiceWorker() {
  navigator.serviceWorker?.ready
    .then(function (registration) {
      if (registration) {
        const isHidden = isPageHidden() || document.visibilityState === 'hidden'
        registration?.active?.postMessage({
          type: 'visibilityChange',
          visible: !isHidden
        })
      }
      // Use the PushManager to get the user's subscription to the push service.
      registration?.pushManager
        ?.permissionState({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_PUSH_SERVER_PUBLIC_KEY)
        })
        .then(state => {
          if (state === 'denied') {
            console.log('initServiceWorker denied')
            return Promise.reject('User has blocked push notification.')
          }
          if (state === 'prompt') {
            console.log('initServiceWorker prompt')
            // PC or mobile PWA, need prompt for user grant for push permission
            if (!deviceInfo.isMobilePWAInstall) {
              console.log('initServiceWorker confirm modal')
              commonModal.open({
                title: 'Allow Notification',
                content:
                  'Notify me when my friend gets pranked.',
                confirmText: 'Allow',
                onConfirm: () => {
                  console.log('initServiceWorker prompt confirm')
                  subscribe()
                }
              })
            } else {
              console.log('initServiceWorker not pwa')
            }
            return Promise.reject('User has not granted push notification.')
          }
          if (state === 'granted') {
            console.log('initServiceWorker granted')
            return
          }
        })
        .then(() => {
          registration.pushManager?.getSubscription().then(function (subscription) {
            // https://github.com/mdn/serviceworker-cookbook/blob/master/push-subscription-management/index.js
            // https://github.com/GoogleChrome/samples/blob/gh-pages/push-messaging-and-notifications/main.js
            // If a subscription was found, return it.
            console.log('subscription:', subscription)
            if (!subscription) {
              console.log('subscription1')
              subscribe()
            } else {
              console.log('subscription2')
              registerWebPush(subscription)
                .then(resp => {
                  console.log('registerWebPush success:', resp)
                })
                .catch(err => {
                  console.error('registerWebPush err:', err)
                })
            }
          })
        })
        .catch(err => {
          console.error('registration err:', err)
        })
    })
    .catch(err0 => {
      console.error('initServiceWorker err:', err0)
    })
}

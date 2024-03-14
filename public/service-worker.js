let pushCounter = 0
let isVisible = false

function setBadge(...args) {
  if (navigator.setAppBadge) {
    navigator.setAppBadge(...args)
  } else if (navigator.setExperimentalAppBadge) {
    navigator.setExperimentalAppBadge(...args)
  } else if (self.ExperimentalBadge) {
    self.ExperimentalBadge.set(...args)
  }
}

function clearBadge() {
  if (navigator.clearAppBadge) {
    navigator.clearAppBadge()
  } else if (navigator.clearExperimentalAppBadge) {
    navigator.clearExperimentalAppBadge()
  } else if (self.ExperimentalBadge) {
    self.ExperimentalBadge.clear()
  }
}

// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  // The push event's data is a JSON object {"title", "xxxxx", "body":"xxxx"}
  const pushData = event.data.json() || {}
  const title = pushData?.title || ''
  const message = pushData?.body || ''
  if (title && message) {
    if (self.Notification?.permission === 'granted' && !isVisible) {
      event.waitUntil(
        // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
        // Set other parameters such as the notification language, a vibration pattern associated
        // to the notification, an image to show near the body.
        // There are many other possible options, for an exhaustive list see the specs:
        //   https://notifications.spec.whatwg.org/
        self.registration?.showNotification(title, {
          body: message,
          icon: '/pwa-assets/images/logo192.png'
        })
      )
      if ('setAppBadge' in navigator) {
        pushCounter++
        setBadge(pushCounter)
      }
    }
  }
})

addEventListener('message', function (event) {
  console.log('message', event)
  if (event.data && event.data.type === 'visibilityChange') {
    var visible = event.data.visible
    // App visibility changed
    if (visible) {
      isVisible = true
      pushCounter = 0
      clearBadge()
    } else {
      isVisible = false
    }
  }
})

self.addEventListener('notificationclick', function (event) {
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close()

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window'
      })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if ('focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
  )
})

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')
 
client.on('connect', () => {
  client.subscribe('presence', err => {
    if (err) return

		client.publish('presence', 'online')
  })
})
 
client.on('message', (topic, message) => {
  console.log(message.toString())
  client.end()
})


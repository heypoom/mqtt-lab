const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')
 
client.on('connect', () => {
	client.publish('presence', 'online')

	const payload = JSON.stringify({
		humidity: Math.floor(Math.random() * 70),
		temperature: Math.floor(Math.random() * 40)
	})

	client.publish('sensors/farm/1', payload)
})
 
client.on('message', (topic, message) => {
  console.log(message.toString())
  client.end()
})


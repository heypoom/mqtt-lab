const mosca = require('mosca')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/iot', {
	useNewUrlParser: true
})

const Record = mongoose.model('Record', {
	time: Date,
	temperature: Number,
	humidity: Number
});

const settings = {
  port: 1883,
  backend: {
		type: 'redis',
		redis: require('redis'),
		db: 12,
		port: 6379,
		return_buffers: true,
		host: "localhost"
	}
};

const server = new mosca.Server(settings)

server.on('clientConnected', client => {
	console.log('client connected', client.id)
})

server.on('published', (packet, client) => {
  console.log('Published', packet.topic, packet.payload)

	if (packet.topic === 'presence') {
		console.log('SET CLIENT TO', packet.payload.toString())
	}

	if (packet.topic === 'sensors/farm/1') {
		const text = packet.payload.toString()
		if (!text) return

		const {temperature, humidity} = JSON.parse(text)

		const record = new Record({
			time: Date.now(),
			temperature,
			humidity
		})

		record.save().then(() => console.log('data saved to DB'))
	}
})

server.on('ready', setup)

function setup() {
  console.log('Mosca server is up and running');
}


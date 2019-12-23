const mosca = require('mosca')

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
})

server.on('ready', setup)

function setup() {
  console.log('Mosca server is up and running');
}


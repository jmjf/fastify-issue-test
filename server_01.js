const Fastify = require('fastify')

// Instantiate the framework
const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/error01', function (request, reply) {
  reply.code(401).send({ hello: 'world' })
})

fastify.setErrorHandler(function (error, request, reply) {
    request.log.error(error, 'setErrorHandler')
    reply.status(418).send({ ok: false })
  })

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
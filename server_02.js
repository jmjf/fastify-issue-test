const Fastify = require('fastify')

// Instantiate the framework
const fastify = Fastify({
  logger: true
})

fastify.addHook('onSend', async function (request, reply, payload) {
  request.log.info({ reqId: request.id, url: request.url, payload, statusCode: reply.statusCode}, 'onSend')
  reply.header('x-my-req-id', request.id)
  return payload
})

// 404: setNotFoundHandler -> onSend -> 404 with body for setNotFoundHandler
fastify.setNotFoundHandler(async function(request, reply) {
  request.log.info({ reqId: request.id, url: request.url, statusCode: reply.statusCode}, 'setNotfoundHandler')
  reply.code(404).send({httpStatusCode: 404, message: `${request.url} not found`, functionName: 'setNotFoundHandler'})
})

fastify.setErrorHandler(async function (error, request, reply) {
  request.log.error(error, 'setErrorHandler')
  if (reply.statusCode === 404) {
    reply.code(404).send({httpStatusCode: 404, message: `${request.url} not found1`, functionName: 'setErrorHandler'})
  } else {
    reply.code(418).send({ ok: false })
  }
})

// error01: handler -> onSend -> 401 with {hello: 'world'}
fastify.get('/error01', function (request, reply) {
  request.log.info({ reqId: request.id, url: request.url}, 'GET /error01')
  reply.code(401).send({ hello: 'world' })
})

// error02: handler -> setErrorHandler -> onSend -> 418 with { ok: false }
fastify.get('/error02', function (request, reply) {
  request.log.info({ reqId: request.id, url: request.url}, 'GET /error02')
  reply.code(402).send(new Error('error01'))
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})

// test: handler -> onSend -> 200 with body
fastify.get('/test', function (request, reply) {
  request.log.info({ reqId: request.id, url: request.url}, 'GET /error02')
  reply.code(200).send({msg: 'testing 1 2 3'})
})
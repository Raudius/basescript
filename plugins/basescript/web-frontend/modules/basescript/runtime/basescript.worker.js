/**
 * Proxied objects forward any method calls to the main thread by posting a message and expecting a reply.
 * These methods return a Promise which resolves when the reply to the message is received.
 */
const deferreds = new Map()

const workerMethods = {
  runScript({ script }) {
    execute(script)
    // TODO handle response/errors
  },
}

self.onmessage = (event) => {
  const messageId = event.data.messageId
  if (Object.hasOwn(workerMethods, messageId)) {
    workerMethods[messageId](event.data)
  }

  const deferred = deferreds.get(messageId)
  if (!deferred) {
    return
  }
  deferreds.delete(messageId)
  const result = event.data.result

  if (result instanceof Error) {
    deferred.reject(event.data.result)
    return
  }

  deferred.resolve(CreateProxy(result))
}

/**
 * Posts a message to the main thread which expects a reply, returns a promise which resolves
 * when the reply is received.
 */
function postMessageWithExpectedReply(message) {
  const messageId = Date.now() + '-' + Math.floor(Math.random() * 10000)
  message.messageId = messageId

  const deferred = Promise.withResolvers()
  deferreds.set(messageId, deferred)

  self.postMessage(message)
  return deferred.promise
}

const UnwrapProxy = (obj) => {
  if (obj instanceof Array) {
    return obj.map(UnwrapProxy)
  }

  if (!Object.hasOwn(obj, 'type')) {
    return obj
  }

  return JSON.parse(JSON.stringify(obj))
}

const CreateProxy = (obj) => {
  // Arrays get recursively proxied
  if (obj instanceof Array) {
    return obj.map(CreateProxy)
  }

  // Only objects with a 'type' property get proxied.
  if (!obj || !Object.hasOwn(obj, 'type')) {
    return obj
  }

  const handler = {
    get(target, name) {
      if (Object.hasOwn(target, name)) {
        return CreateProxy(target[name])
      }

      if (['then', 'catch', 'toString', 'valueOf', 'toJSON'].includes(name)) {
        return target[name]
      }

      // If it's a proxy method we forward the request to the main thread, return promise for result.
      return (...args) => {
        let subject
        if (target.type !== '') {
          subject = target
          name = `${target.type}_${name}`
        }

        const message = { name, args: UnwrapProxy(args), subject }
        return postMessageWithExpectedReply(message)
      }
    },
  }
  return new Proxy(obj, handler)
}

function exit() {
  self.postMessage({ messageId: 'exit' })
}

async function execute(script) {
  try {
    const client = CreateProxy({ type: '' })
    self.getBase = client.getBase
    self.io = CreateProxy({ type: 'io' })

    /*
     * Override console.log to allow showing Proxied objects
     */
    self.log = console.log
    self.console.log = (...args) => {
      const newArgs = UnwrapProxy(args)
      self.log(...newArgs)
    }

    /*
     * Run the script in an async function to allow `await` calls
     */
    script = `(async() => {
      ${script}
    })`
    // eslint-disable-next-line no-eval
    const evalScriptFunc = eval(script)

    await evalScriptFunc()
  } finally {
    exit()
  }
}

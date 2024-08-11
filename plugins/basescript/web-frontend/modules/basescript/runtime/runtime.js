import MyWorker from './basescript.worker.js'

export function Basescript(client, { started, stopped } = {}) {
  started = started ?? (() => {})
  stopped = stopped ?? (() => {})

  let worker

  const createWorker = () => {
    worker = new MyWorker()

    worker.addEventListener('message', async (msg) => {
      const data = msg.data
      if (!data.messageId) {
        return
      }

      if (data.messageId === 'exit') {
        stopped()
        return
      }

      const cb = (result) => {
        worker.postMessage({
          messageId: data.messageId,
          result,
        })
      }

      try {
        await client.handleMessage(msg.data, cb)
      } catch (error) {
        cb(error)
      }
    })
  }

  return {
    async run(script) {
      createWorker()
      started()
      await worker.postMessage({
        messageId: 'runScript',
        script,
      })
    },

    kill() {
      worker && worker.terminate()
      stopped()
    },
  }
}

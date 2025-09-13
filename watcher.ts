import { watch } from 'fs/promises'
import path from 'path'
import { $, MD5 } from 'bun'
import { readFileSync } from 'fs'

const BLENDER_BIN_PATH = process.env.BLENDER_BIN_PATH ?? '/Applications/Blender.app/Contents/MacOS/Blender'

const server = Bun.serve({
  port: process.env.WATCHER_PORT ?? '8080',
  fetch(req, server) {
    const success = server.upgrade(req)
    return success ? undefined : new Response('Upgrade failed', { status: 500 })
  },
  websocket: {
    open: (ws) => ws.subscribe('glb-changes'),
    close: (ws) => ws.unsubscribe('glb-changes'),
    message: () => {},
  },
})

// Saving causes the file to be modified twice, so we debounce events.
const debounceMap = new Map<string, ReturnType<typeof setTimeout>>()

// Note: .blend files can't use similar MD5 checks because they change at every save.
const glbHashMap = new Map<string, string>()

const watchBlends = async () => {
  for await (const event of watch('./', { recursive: false })) {
    const { filename } = event
    if (filename?.endsWith('.blend')) {
      const blendPath = path.join('./', filename)

      const existingTimeout = debounceMap.get(filename)
      if (existingTimeout) {
        clearTimeout(existingTimeout)
      }

      const timeout = setTimeout(async () => {
        await $`${BLENDER_BIN_PATH} --background --python export_blend_objects.py -- ${blendPath}`.nothrow()
        debounceMap.delete(filename)
      }, 500)

      debounceMap.set(filename, timeout)
    }
  }
}

const watchGlbs = async () => {
  for await (const event of watch('./public', { recursive: false })) {
    if (event.filename?.endsWith('.glb')) {
      const glbHash = MD5.hash(readFileSync(path.join('./public', event.filename)))
      if (glbHashMap.get(event.filename) === glbHash.toString()) continue
      glbHashMap.set(event.filename, glbHash.toString())

      server.publish('glb-changes', event.filename)
      console.log('📦 📡 GLB change broadcast:', event.filename)
    }
  }
}

watchBlends()
watchGlbs()

process.on('SIGINT', () => {
  server.stop()
  process.exit(0)
})

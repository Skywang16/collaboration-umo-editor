import { Extension } from '@tiptap/core'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export interface CollaborationOptions {
  // 是否启用协同编辑
  enabled: boolean
  // 文档名称
  documentName: string
  // WebSocket 服务器地址
  websocketUrl: string
  // 当前用户信息
  user: {
    name: string
    color: string
    avatar?: string
  }
}

// 创建一个扩展来管理协同编辑功能
export const UmoCollaboration = Extension.create<CollaborationOptions>({
  name: 'umoCollaboration',

  addOptions() {
    return {
      enabled: false,
      documentName: 'default-document',
      websocketUrl: 'ws://localhost:1234',
      user: {
        name: 'Anonymous',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        avatar: undefined,
      },
    }
  },

  addStorage() {
    return {
      provider: null,
      ydoc: null,
    }
  },

  addExtensions() {
    if (!this.options.enabled) {
      return []
    }

    // 创建 Yjs 文档
    const ydoc = new Y.Doc()

    // 创建 WebSocket 提供者
    const provider = new WebsocketProvider(
      this.options.websocketUrl,
      this.options.documentName,
      ydoc,
    )

    // 设置当前用户的状态
    provider.awareness.setLocalStateField('user', this.options.user)

    // 存储 provider 以便后续使用
    this.storage.provider = provider
    this.storage.ydoc = ydoc

    // 返回协同编辑相关的扩展
    return [
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: this.options.user,

        render: (user) => {
          // 创建光标元素
          const cursor = document.createElement('span')
          cursor.classList.add('collaboration-cursor__caret')
          cursor.style.setProperty('--cursor-color', user.color)

          // 创建头像容器
          if (user.avatar) {
            const avatarContainer = document.createElement('div')
            avatarContainer.classList.add(
              'collaboration-cursor__avatar-container',
            )
            avatarContainer.style.setProperty('--cursor-color', user.color)

            const avatar = document.createElement('img')
            avatar.src = user.avatar
            avatar.classList.add('collaboration-cursor__avatar')
            avatar.style.setProperty('--cursor-color', user.color)

            avatarContainer.appendChild(avatar)
            cursor.appendChild(avatarContainer)
          }

          // 创建标签元素
          const label = document.createElement('div')
          label.classList.add('collaboration-cursor__label')
          label.style.backgroundColor = user.color
          label.style.setProperty('--cursor-color', user.color)
          label.textContent = user.name

          // 将标签添加到光标
          cursor.appendChild(label)

          return cursor
        },
      }),
    ]
  },

  onDestroy() {
    // 销毁时断开连接
    if (this.storage.provider) {
      this.storage.provider.disconnect()
    }
    if (this.storage.ydoc) {
      this.storage.ydoc.destroy()
    }
  },
})

export default UmoCollaboration

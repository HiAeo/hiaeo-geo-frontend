/**
 * Socket.io 客户端插件
 * 提供 WebSocket 实时通信能力
 */

import { io } from 'socket.io-client'

// Socket.io 事件名称
export const WS_EVENTS = {
  // 连接事件
  CONNECTED: 'connected',
  AUTHENTICATED: 'authenticated',
  DISCONNECTED: 'disconnect',
  
  // 工作流事件
  WORKFLOW_STATE_UPDATE: 'workflow:state_update',
  WORKFLOW_STAGE_CHANGE: 'workflow:stage_change',
  WORKFLOW_PROGRESS: 'workflow:progress',
  
  // Agent 事件
  AGENT_MESSAGE: 'agent:message',
  AGENT_CHAIN_START: 'agent:chain_start',
  AGENT_CHAIN_PROGRESS: 'agent:chain_progress',
  AGENT_CHAIN_COMPLETE: 'agent:chain_complete',
  
  // 诊断事件
  DIAGNOSIS_START: 'diagnosis:start',
  DIAGNOSIS_PROGRESS: 'diagnosis:progress',
  DIAGNOSIS_COMPLETE: 'diagnosis:complete',
  
  // 通知事件
  NOTIFICATION_NEW: 'notification:new',
  
  // 系统事件
  SYSTEM_ALERT: 'system:alert',
}

class SocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  /**
   * 连接服务器
   */
  connect(options = {}) {
    const {
      url = import.meta.env.VITE_WS_URL || 'http://localhost:3000',
      autoConnect = true,
    } = options

    if (this.socket?.connected) {
      console.log('Socket 已连接')
      return
    }

    this.socket = io(`${url}/ws`, {
      autoConnect,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      transports: ['websocket', 'polling'],
    })

    // 绑定基本事件
    this.setupBasicListeners()
  }

  /**
   * 设置基本监听器
   */
  setupBasicListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Socket 连接成功')
      this.connected = true
      this.reconnectAttempts = 0
      this.emit('socket:connected')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket 断开:', reason)
      this.connected = false
      this.emit('socket:disconnected', { reason })
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket 连接错误:', error)
      this.reconnectAttempts++
    })

    this.socket.on('error', (error) => {
      console.error('Socket 错误:', error)
    })
  }

  /**
   * 认证
   */
  authenticate(userId, brandId) {
    if (!this.socket?.connected) {
      console.error('Socket 未连接')
      return Promise.reject(new Error('Socket 未连接'))
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('authenticate', { userId, brandId }, (response) => {
        if (response.success) {
          console.log('Socket 认证成功')
          resolve(response)
        } else {
          reject(new Error('认证失败'))
        }
      })
    })
  }

  /**
   * 订阅品牌
   */
  subscribeBrand(brandId) {
    if (!this.socket?.connected) return

    this.socket.emit('subscribe_brand', { brandId })
    console.log('订阅品牌:', brandId)
  }

  /**
   * 取消订阅品牌
   */
  unsubscribeBrand(brandId) {
    if (!this.socket?.connected) return

    this.socket.emit('unsubscribe_brand', { brandId })
    console.log('取消订阅品牌:', brandId)
  }

  /**
   * 订阅 Agent 会话
   */
  subscribeAgent(sessionId) {
    if (!this.socket?.connected) return

    this.socket.emit('subscribe_agent', { sessionId })
    console.log('订阅 Agent 会话:', sessionId)
  }

  /**
   * 监听事件
   */
  on(event, callback) {
    if (!this.socket) return

    this.socket.on(event, callback)

    // 保存监听器以便后续清理
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  /**
   * 移除事件监听
   */
  off(event, callback) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(event, callback)
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    } else {
      this.socket.off(event)
      this.listeners.delete(event)
    }
  }

  /**
   * 发送事件
   */
  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn('Socket 未连接，无法发送:', event)
      return
    }

    this.socket.emit(event, data)
  }

  /**
   * 发送事件并等待响应
   */
  async send(event, data, timeout = 10000) {
    if (!this.socket?.connected) {
      throw new Error('Socket 未连接')
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('请求超时'))
      }, timeout)

      this.socket.emit(event, data, (response) => {
        clearTimeout(timer)
        resolve(response)
      })
    })
  }

  /**
   * Ping 心跳
   */
  ping() {
    this.emit('ping')
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  /**
   * 获取连接状态
   */
  isConnected() {
    return this.connected
  }
}

// 创建单例
export const socketService = new SocketService()

// 导出 Vue 插件
export const socketPlugin = {
  install(app) {
    app.config.globalProperties.$socket = socketService
    app.provide('socket', socketService)
  },
}

export default socketService

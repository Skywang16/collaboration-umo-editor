export interface CollaborationUser {
  name: string
  color: string
  avatar?: string
}

export interface CollaborationOptions {
  enabled: boolean
  documentName: string
  websocketUrl: string
  user: CollaborationUser
}

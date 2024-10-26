export interface IUserProfile {
  id: number
  account: IAccount
  occupation: string
  dni: string
}

export interface IAccount {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  picture: string
  emailVerified: boolean
  enabled: boolean
  createdTimestamp: string
}

export type IUserProfileRequestDto = Pick<IUserProfile, 'occupation' | 'dni'>
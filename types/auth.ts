export type RegisterPayload = {
  username: string
  email: string
  password: string
  provider: "GOOGLE" | "LOCAL"
}

export type LoginPayload = {
  email: string
  password: string
}

export type GoogleLoginPayload = {
  idToken: string
}
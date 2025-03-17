/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'

const BASE_URL: string = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || ''
export const BASE_REDIRECT_URL: string = `${BASE_URL}/money_management/auth`
export const GOOGLE_SIGNIN_REDIRECT_URL: string = `${BASE_REDIRECT_URL}/google/signin/callback`
export const GOOGLE_SIGNUP_REDIRECT_URL: string = `${BASE_REDIRECT_URL}/google/signup/callback`
export const GOOGLE_DELETE_REDIRECT_URL: string = `${BASE_REDIRECT_URL}/google/delete/callback`
export const LINE_SIGNIN_REDIRECT_URL: string = `${BASE_REDIRECT_URL}/line/signin/callback`
export const LINE_SIGNUP_REDIRECT_URL: string = `${BASE_REDIRECT_URL}/line/signup/callback`
export const LINE_DELETE_REDIRECT_URL: string = `${BASE_REDIRECT_URL}/line/delete/callback`

class Google {
  private _clientId: string = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  private _clientSecret: string =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || ''

  private generateRandomState(length: number = 16): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((n) => characters[n % characters.length])
      .join('')
  }

  private authURL(redirectUrl: string): string {
    const scopesList: string[] = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
    const auth: string = 'https://accounts.google.com/o/oauth2/auth'
    const scopes: string = scopesList.join('+')
    const state: string = this.generateRandomState(32)

    return `${auth}?client_id=${this._clientId}&redirect_uri=${redirectUrl}&response_type=code&prompt=select_account&scope=${scopes}&state=${state}`
  }

  public signIn(): void {
    window.location.href = this.authURL(GOOGLE_SIGNIN_REDIRECT_URL)
  }

  public signUp(): void {
    window.location.href = this.authURL(GOOGLE_SIGNUP_REDIRECT_URL)
  }

  public getToken(
    code: string | string[],
    redirectUrl: string
  ): Promise<AxiosResponse<any, any>> {
    const params = new URLSearchParams()
    params.append('client_id', this._clientId)
    params.append('client_secret', this._clientSecret)
    params.append('code', code as string)
    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', redirectUrl)

    return axios.post('https://oauth2.googleapis.com/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }

  public getInfo(access_token: string): Promise<AxiosResponse<any, any>> {
    const url: string = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`

    return axios.get(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }
}

class Line {
  private _clientId: string = process.env.NEXT_PUBLIC_LINE_CLIENT_ID || ''
  private _clientSecret: string =
    process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET || ''

  private generateRandomState(length: number = 16): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((n) => characters[n % characters.length])
      .join('')
  }

  private authURL(redirectUrl: string): string {
    const auth: string = 'https://access.line.me/oauth2/v2.1/authorize'
    const scopes: string = 'profile openid email'
    const state: string = this.generateRandomState(32)

    return `${auth}?client_id=${this._clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scopes}&state=${state}`
  }

  public signIn(): void {
    window.location.href = this.authURL(LINE_SIGNIN_REDIRECT_URL)
  }

  public signUp(): void {
    window.location.href = this.authURL(LINE_SIGNUP_REDIRECT_URL)
  }

  public getToken(
    code: string | string[],
    redirectUrl: string
  ): Promise<AxiosResponse<any, any>> {
    const params = new URLSearchParams()
    params.append('client_id', this._clientId)
    params.append('client_secret', this._clientSecret)
    params.append('code', code as string)
    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', redirectUrl)

    return axios.post('https://api.line.me/oauth2/v2.1/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }

  public getInfo(access_token: string): Promise<AxiosResponse<any, any>> {
    const url: string = 'https://api.line.me/v2/profile'

    return axios.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${access_token}`,
      },
    })
  }
}

export const google = new Google()
export const line = new Line()

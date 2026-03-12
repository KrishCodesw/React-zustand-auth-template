type GoogleOAuth2 = {
  initTokenClient(config: {
    client_id: string
    scope: string
    callback: (response: { access_token: string }) => void
  }): { requestAccessToken: () => void }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: GoogleOAuth2
      }
    }
  }
}

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise: Promise<void> | null = null

async function loadGoogleScript() {
  if (window.google?.accounts?.oauth2) return

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = GOOGLE_SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google client script'))
      document.head.appendChild(script)
    })
  }

  await scriptPromise

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google OAuth client not available after script load.')
  }
}

export type GoogleUserInfo = {
  sub: string
  email: string
  name: string
  picture?: string
}

export async function authenticateWithGoogle(): Promise<{
  accessToken: string
  userInfo: GoogleUserInfo
}> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not configured.')
  }

  await loadGoogleScript()

  const google = window.google
  if (!google?.accounts?.oauth2) {
    throw new Error('Google OAuth client not available on window.')
  }

  const accessToken = await new Promise<string>((resolve, reject) => {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (response) => {
          if (!response.access_token) {
            reject(new Error('Failed to obtain access token from Google.'))
            return
          }
          resolve(response.access_token)
        },
      })

      client.requestAccessToken()
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Google auth failed.'))
    }
  })

  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch Google user info.')
  }

  const userInfo = (await res.json()) as GoogleUserInfo

  return { accessToken, userInfo }
}


// types/global.d.ts

export {}

declare global {
  interface CredentialResponse {
    credential: string
    select_by: "auto" | "user" | "user_1tap" | "user_2tap" | "btn"
    clientId: string
  }

  interface IdConfiguration {
    client_id: string
    callback: (response: CredentialResponse) => void
    auto_select?: boolean
    login_uri?: string
    native_callback?: (response: CredentialResponse) => void // More specific type
    cancel_on_tap_outside?: boolean
    prompt_parent_id?: string
    nonce?: string
    context?: "signin" | "signup" | "use"
    state_cookie_domain?: string
    ux_mode?: "popup" | "redirect"
    allowed_parent_origin?: string | string[]
    intermediate_iframe_close_callback?: () => void // More specific type
  }

  interface GsiButtonConfiguration {
    type?: "standard" | "icon"
    theme?: "outline" | "filled_blue" | "filled_black"
    size?: "small" | "medium" | "large"
    text?: "signin_with" | "signup_with" | "continue_with" | "sign_in_with"
    shape?: "rectangular" | "pill" | "circle" | "square"
    logo_alignment?: "left" | "center"
    width?: number
    locale?: string
  }

  interface PromptMomentNotification {
    isDisplayMoment: () => boolean
    isDisplayed: () => boolean
    isNotDisplayed: () => boolean
    getNotDisplayedReason: () =>
      | "browser_not_supported"
      | "invalid_client"
      | "missing_client_id"
      | "opt_out_or_no_session"
      | "secure_http_required"
      | "suppressed_by_user"
      | "unregistered_origin"
      | "unknown_reason"
    isSkippedMoment: () => boolean
    getSkippedReason: () =>
      | "auto_cancel"
      | "user_cancel"
      | "tap_outside"
      | "issuing_failed"
    isDismissedMoment: () => boolean
    getDismissedReason: () => "credential_returned" | "cancel_called" | "flow_restarted"
  }

  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (input: IdConfiguration) => void
          prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void
          renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void
          cancel: () => void
          storeCredential?: (credential: string, callback: () => void) => void
          disableAutoSelect?: () => void
        }
      }
    }
  }
}

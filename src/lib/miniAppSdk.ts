/**
 * Nimiq Pay Mini Apps integration.
 *
 * CORRECTION (see the "e.init is not a function" bug report): this file
 * previously read a `window.nimiq` global that does not exist. That was
 * wrong — there is no `window.nimiq` injection point. The real integration
 * is the installable npm package `@nimiq/mini-app-sdk`, confirmed by two
 * independently published Nimiq Mini Apps (Kolo and Cinima, both on
 * GitHub) whose source imports it directly, e.g.:
 *
 *   apps/web/lib/nimiq-client.ts   → "@nimiq/mini-app-sdk + window.ethereum,
 *                                     all wallet calls"
 *   Cinima's README               → "Integration follows nimiq.dev/mini-apps:
 *                                     init() → listAccounts() → sign() for
 *                                     a wallet session."
 *
 * Per those same sources, the provider surface a Mini App gets is exactly:
 *   init(), listAccounts(), sign(), sendBasicTransaction(),
 *   sendBasicTransactionWithData(), and six staking calls — nothing else
 *   (no USDT/BTC send methods — see the checkout UI for how that's handled).
 *
 * This wrapper now calls those as the top-level functions the package
 * exports, instead of guessing at a global.
 */
import {
  init as sdkInit,
  listAccounts as sdkListAccounts,
  sendBasicTransactionWithData as sdkSendBasicTransactionWithData,
} from '@nimiq/mini-app-sdk'

export interface NimiqAccount {
  address: string
  label?: string
}

export class NimiqMiniAppUnavailableError extends Error {
  constructor(cause?: unknown) {
    super(
      'Could not reach the Nimiq Pay wallet provider. Open this Mini App from inside Nimiq Pay to complete a payment.'
    )
    this.name = 'NimiqMiniAppUnavailableError'
    if (cause) this.cause = cause
  }
}

let initialized = false
let initFailed = false

/**
 * Calls the SDK's init() once per page load. Outside Nimiq Pay (e.g. a
 * regular mobile browser, like the in-app browser used to preview this
 * URL) there is no host to bridge to, so init() is expected to fail —
 * that failure is caught and turned into NimiqMiniAppUnavailableError
 * rather than left as a raw "not a function" style crash.
 */
export async function initMiniApp(): Promise<void> {
  if (initialized) return
  if (initFailed) throw new NimiqMiniAppUnavailableError()
  try {
    await sdkInit()
    initialized = true
  } catch (err) {
    initFailed = true
    throw new NimiqMiniAppUnavailableError(err)
  }
}

/**
 * Best-effort, synchronous-feeling check for "are we inside Nimiq Pay".
 * The SDK itself doesn't expose a synchronous flag, so this reflects
 * whichever init() outcome we've already observed this session. Until
 * init() has been attempted once, this returns true (optimistic) so the
 * UI doesn't flash a warning before the first real attempt.
 */
export function isRunningInNimiqPay(): boolean {
  return !initFailed
}

export async function getConnectedAccount(): Promise<NimiqAccount> {
  await initMiniApp()
  const accounts = await sdkListAccounts()
  if (!accounts?.length) {
    throw new Error('No Nimiq account is connected in this Nimiq Pay session.')
  }
  return accounts[0]
}

export const LUNA_PER_NIM = 100_000

/**
 * Sends a real NIM transaction for an order via the SDK's documented
 * sendBasicTransactionWithData call, tagging it with an order reference so
 * the payment can be independently verified on-chain (the same pattern
 * Kolo uses: `sendBasicTransactionWithData` tagged `kolo:<circle>:r<round>`).
 */
export async function payOrderWithNim(params: {
  merchantAddress: string
  amountNim: number
  orderReference: string
}): Promise<{ hash: string }> {
  await initMiniApp()

  const value = Math.round(params.amountNim * LUNA_PER_NIM)
  const data = `nimiqdeals:order:${params.orderReference}`

  const result = await sdkSendBasicTransactionWithData({
    recipient: params.merchantAddress,
    value,
    data,
  })

  return { hash: result.hash }
}

/**
 * Nimiq Pay Mini Apps integration.
 *
 * SECOND CORRECTION — read this before touching this file again.
 *
 * The Vercel build log for the previous version of this file gave a
 * concrete, factual answer instead of another guess: `@nimiq/mini-app-sdk`
 * DOES install fine, but webpack's static export analysis reported
 * `listAccounts` and `sendBasicTransactionWithData` as NOT top-level named
 * exports of the package — only `init` is. That's a real signal, not a
 * typing gap (webpack's "Attempted import error" reflects the actual
 * compiled module, unlike a stale .d.ts).
 *
 * The shape that fits both that error and Cinima's documented flow
 * ("init() → listAccounts() → sign() for a wallet session") is: init()
 * returns a session/provider object, and THAT object exposes
 * listAccounts(), sign(), sendBasicTransaction(),
 * sendBasicTransactionWithData(), and the staking calls — rather than each
 * of those being separately importable.
 *
 * I still can't verify this from here (no network access in my sandbox to
 * install the package and inspect its real .d.ts), so this is my best
 * inference from real build output, not a confirmed API. If this build
 * still fails, the fastest way to get this exactly right: open
 * node_modules/@nimiq/mini-app-sdk/package.json, find its "types" (or
 * "main"/"module") field, open that file, and paste its contents back —
 * that's the actual ground truth and ends the guessing entirely.
 */
import { init as sdkInit } from '@nimiq/mini-app-sdk'

interface NimiqSession {
  listAccounts: () => Promise<NimiqAccount[]>
  sign?: (message: string) => Promise<{ signature: string; publicKey: string }>
  sendBasicTransaction?: (params: { recipient: string; value: number }) => Promise<{ hash: string }>
  sendBasicTransactionWithData: (params: {
    recipient: string
    value: number
    data: string
  }) => Promise<{ hash: string }>
}

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

let session: NimiqSession | null = null
let initFailed = false

/**
 * Calls the SDK's init() once per page load and keeps whatever it returns
 * as the active session. Outside Nimiq Pay there's no host to bridge to,
 * so this is expected to reject — that's caught and turned into
 * NimiqMiniAppUnavailableError.
 */
async function getSession(): Promise<NimiqSession> {
  if (session) return session
  if (initFailed) throw new NimiqMiniAppUnavailableError()
  try {
    const result = await sdkInit()
    // Defensive: if init() doesn't actually return a usable session object,
    // fail with a clear, specific error instead of a cryptic runtime crash.
    const candidate = result as unknown as NimiqSession
    if (!candidate || typeof candidate.listAccounts !== 'function') {
      throw new Error(
        'init() from @nimiq/mini-app-sdk did not return the expected session object (no listAccounts method). The real SDK shape differs from what this file assumes — see the comment at the top of this file for how to get the real type definitions.'
      )
    }
    session = candidate
    return session
  } catch (err) {
    initFailed = true
    throw new NimiqMiniAppUnavailableError(err)
  }
}

export async function initMiniApp(): Promise<void> {
  await getSession()
}

export function isRunningInNimiqPay(): boolean {
  return !initFailed
}

export async function getConnectedAccount(): Promise<NimiqAccount> {
  const s = await getSession()
  const accounts = await s.listAccounts()
  if (!accounts?.length) {
    throw new Error('No Nimiq account is connected in this Nimiq Pay session.')
  }
  return accounts[0]
}

export const LUNA_PER_NIM = 100_000

/**
 * Sends a real NIM transaction for an order, tagging it with an order
 * reference so the payment can be independently verified on-chain (the
 * same pattern Kolo uses: sendBasicTransactionWithData tagged
 * `kolo:<circle>:r<round>`).
 */
export async function payOrderWithNim(params: {
  merchantAddress: string
  amountNim: number
  orderReference: string
}): Promise<{ hash: string }> {
  const s = await getSession()

  const value = Math.round(params.amountNim * LUNA_PER_NIM)
  const data = `nimiqdeals:order:${params.orderReference}`

  const result = await s.sendBasicTransactionWithData({
    recipient: params.merchantAddress,
    value,
    data,
  })

  return { hash: result.hash }
}

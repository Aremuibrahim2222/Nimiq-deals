/**
 * Nimiq Pay Mini Apps integration.
 *
 * IMPORTANT — read before touching this file.
 *
 * Per the public Mini Apps documentation (nimiq.dev/mini-apps) and the
 * `@nimiq/mini-app-sdk` package, the wallet provider injected into a Mini
 * App running inside Nimiq Pay exposes exactly this surface:
 *
 *   - init()
 *   - listAccounts()
 *   - sign()
 *   - sendBasicTransaction()
 *   - sendBasicTransactionWithData()
 *   - six staking-related calls (not used by this app)
 *
 * There is no documented method for sending USDT, BTC, or any other asset
 * from a Mini App — multi-asset swaps live in the full Nimiq Wallet UI, not
 * in the constrained provider a Mini App gets. So this wrapper only ever
 * asks the provider to do things it actually supports: list the connected
 * account and send a NIM transaction with a memo. Nothing here is mocked —
 * if the SDK call fails or the user is outside Nimiq Pay, that failure is
 * surfaced, not papered over with a fake "success".
 *
 * USDT checkout is modeled in the data layer (see types/index.ts,
 * `orders.currency`) so the product isn't rearchitected the day the
 * provider adds it, but the checkout UI keeps it disabled with an
 * explanation instead of pretending to submit a real transfer. See
 * src/app/checkout/CheckoutClient.tsx.
 */

export interface NimiqAccount {
  address: string
  label?: string
}

interface MiniAppProvider {
  init: () => Promise<void>
  listAccounts: () => Promise<NimiqAccount[]>
  sign: (message: string) => Promise<{ signature: string; publicKey: string }>
  sendBasicTransaction: (params: {
    recipient: string
    value: number // luna (1 NIM = 100_000 luna)
  }) => Promise<{ hash: string }>
  sendBasicTransactionWithData: (params: {
    recipient: string
    value: number
    data: string
  }) => Promise<{ hash: string }>
}

declare global {
  interface Window {
    nimiq?: MiniAppProvider
  }
}

export class NimiqMiniAppUnavailableError extends Error {
  constructor() {
    super(
      'The Nimiq Pay wallet provider was not found. Open this Mini App from inside Nimiq Pay to complete a payment.'
    )
    this.name = 'NimiqMiniAppUnavailableError'
  }
}

let initialized = false

function getProvider(): MiniAppProvider {
  if (typeof window === 'undefined' || !window.nimiq) {
    throw new NimiqMiniAppUnavailableError()
  }
  return window.nimiq
}

export function isRunningInNimiqPay(): boolean {
  return typeof window !== 'undefined' && !!window.nimiq
}

export async function initMiniApp(): Promise<void> {
  if (initialized) return
  const provider = getProvider()
  await provider.init()
  initialized = true
}

export async function getConnectedAccount(): Promise<NimiqAccount> {
  const provider = getProvider()
  await initMiniApp()
  const accounts = await provider.listAccounts()
  if (!accounts.length) {
    throw new Error('No Nimiq account is connected in this Nimiq Pay session.')
  }
  return accounts[0]
}

export const LUNA_PER_NIM = 100_000

/**
 * Sends a real NIM transaction for an order via the Mini App provider's
 * documented sendBasicTransactionWithData call, tagging it with an
 * order reference so the payment can be independently verified on-chain
 * (the same pattern used by other Mini Apps like Tanda and Kolo).
 */
export async function payOrderWithNim(params: {
  merchantAddress: string
  amountNim: number
  orderReference: string
}): Promise<{ hash: string }> {
  const provider = getProvider()
  await initMiniApp()

  const value = Math.round(params.amountNim * LUNA_PER_NIM)
  const data = `nimiqdeals:order:${params.orderReference}`

  return provider.sendBasicTransactionWithData({
    recipient: params.merchantAddress,
    value,
    data,
  })
}

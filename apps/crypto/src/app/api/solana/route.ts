import { NextResponse } from 'next/server'

const isValidSolanaAddress = (address: string) => {
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return solanaAddressRegex.test(address)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'No address provided' }, { status: 400 })
  }

  if (!isValidSolanaAddress(address)) {
    return NextResponse.json(
      { error: 'Invalid Solana address' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      })
    })

    const data = await response.json()

    // Return the balance or handle errors
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    return NextResponse.json({ balance: data.result.value })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// export type SolScan = {
//   jsonrpc: string
//   result: {
//     context: { slot: number }
//     value: number
//   }
//   id: number
// }

// export const getSolBalance = (address: string) =>
//   request<SolScan>(solanaBaseUrl, {
//     body: {
//       jsonrpc: '2.0',
//       id: 1,
//       method: 'getBalance',
//       params: [address]
//     }
//   })

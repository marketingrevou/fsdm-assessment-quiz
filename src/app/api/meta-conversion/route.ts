import { NextRequest, NextResponse } from 'next/server'

interface ConversionEvent {
  event_name: string
  event_time: number
  action_source: string
  user_data: {
    client_user_agent?: string
    client_ip_address?: string
    em?: string[]
    ph?: string[]
    fn?: string[]
  }
  custom_data?: {
    content_name?: string
    content_category?: string
    content_ids?: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { eventName, userData, customData, userAgent, clientIp } = await request.json()

    // Get required environment variables
    const pixelId = process.env.META_PIXEL_ID
    const accessToken = process.env.META_CONVERSION_API_ACCESS_TOKEN

    if (!pixelId || !accessToken) {
      console.error('Missing Meta Conversion API configuration')
      return NextResponse.json(
        { error: 'Missing Meta Conversion API configuration' },
        { status: 500 }
      )
    }

    // Get client IP and User-Agent from request or provided parameters
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const finalClientIp = clientIp || forwarded?.split(',')[0] || realIp || '127.0.0.1'
    
    const finalUserAgent = userAgent || request.headers.get('user-agent') || ''

    // Prepare conversion event
    const conversionEvent: ConversionEvent = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        client_user_agent: finalUserAgent,
        client_ip_address: finalClientIp,
        ...userData
      },
      custom_data: customData
    }

    // Send to Meta Conversion API
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          data: [conversionEvent],
          test_event_code: process.env.NODE_ENV === 'development' ? 'TEST' : undefined
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Meta Conversion API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to send conversion event' },
        { status: 500 }
      )
    }

    const result = await response.json()
    console.log('Meta Conversion API success:', result)

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Conversion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

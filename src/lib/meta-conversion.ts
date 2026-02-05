import crypto from 'crypto'

// Helper function to hash data for Meta Conversion API
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
}

// Helper function to normalize and hash user data
export function prepareUserData(userData: {
  email?: string
  phone?: string
  name?: string
}): {
  em?: string[]
  ph?: string[]
  fn?: string[]
} {
  const hashedData: {
    em?: string[]
    ph?: string[]
    fn?: string[]
  } = {}

  if (userData.email) {
    hashedData.em = [hashData(userData.email)]
  }

  if (userData.phone) {
    // Remove all non-digit characters from phone
    const cleanPhone = userData.phone.replace(/\D/g, '')
    if (cleanPhone.length >= 7) {
      hashedData.ph = [hashData(cleanPhone)]
    }
  }

  if (userData.name) {
    // Split name into first and last name
    const nameParts = userData.name.trim().split(/\s+/)
    if (nameParts[0]) {
      hashedData.fn = [hashData(nameParts[0])]
    }
  }

  return hashedData
}

// Function to send conversion events to Meta
export async function sendMetaConversionEvent(
  eventName: string,
  userData: {
    email?: string
    phone?: string
    name?: string
  },
  customData?: {
    content_name?: string
    content_category?: string
    content_ids?: string[]
  },
  userAgent?: string,
  clientIp?: string
) {
  try {
    const response = await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        userData: prepareUserData(userData),
        customData,
        userAgent,
        clientIp
      })
    })

    if (!response.ok) {
      console.error('Failed to send Meta conversion event:', await response.text())
      return false
    }

    const result = await response.json()
    console.log('Meta conversion event sent successfully:', result)
    return true
  } catch (error) {
    console.error('Error sending Meta conversion event:', error)
    return false
  }
}

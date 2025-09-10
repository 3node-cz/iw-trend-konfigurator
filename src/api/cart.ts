import { addLinesToCart, createCart } from '../graphQL/mutation'

export interface AddToCartInput {
  cartId: string
  variantId?: string
  quantity?: number
  shopUrl: string
  storefrontToken: string
  attributes?: Array<{ key: string; value: string }>
  lines?: Array<{
    merchandiseId: string
    quantity?: number
    attributes?: Array<{ key: string; value: string }>
  }>
}

export interface CartResponse {
  cart: {
    id: string
    checkoutUrl: string
    totalQuantity: number
  }
}

/**
 * Přidá položku do košíku přes Storefront API (cartLinesAdd).
 * Po úspešnom pridaní vráti cart s checkoutUrl pre presmerovanie na checkout.
 */
export const addToCartSF = async ({
  cartId,
  variantId,
  quantity = 1,
  shopUrl,
  storefrontToken,
  attributes = [],
  lines,
}: AddToCartInput): Promise<CartResponse> => {
  try {
    const res = await fetch(shopUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({
        query: addLinesToCart,
        variables: {
          cartId,
          lines: lines || [
            {
              merchandiseId: variantId!,
              quantity,
              attributes: attributes.length > 0 ? attributes : undefined,
            },
          ],
        },
      }),
    })

    const json = await res.json()

    if (json.errors?.length) {
      throw new Error(json.errors[0].message)
    }

    const result = json.data.cartLinesAdd
    const cart = result.cart
    
    // Handle user errors (like out of stock)
    if (result.userErrors?.length > 0) {
      const userError = result.userErrors[0]
      console.error('Shopify user error:', userError)
      throw new Error(`Problém s produktom: ${userError.message}`)
    }
    
    // Handle case where cart is null but no user errors
    if (!cart) {
      throw new Error('Nepodarilo sa pridať produkty do košíka. Skúste to znova.')
    }

    console.log('Pridané do košíka:', cart)
    return { cart }
  } catch (error) {
    console.error('Chyba addToCartSF:', error)
    throw error
  }
}

/**
 * Vytvorí nový košík
 */
export const createCartSF = async ({
  shopUrl,
  storefrontToken,
}: {
  shopUrl: string
  storefrontToken: string
}): Promise<CartResponse> => {
  try {
    const res = await fetch(shopUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({
        query: createCart,
        variables: {
          input: {},
        },
      }),
    })

    const json = await res.json()

    if (json.errors?.length) {
      throw new Error(json.errors[0].message)
    }

    const cart = json.data.cartCreate.cart
    console.log('Vytvorený košík:', cart)
    return { cart }
  } catch (error) {
    console.error('Chyba createCartSF:', error)
    throw error
  }
}

/**
 * Po úspešnom pridaní do košíka presmeruje používateľa na checkout
 */
export const redirectToCheckout = (checkoutUrl: string) => {
  window.location.href = checkoutUrl
}
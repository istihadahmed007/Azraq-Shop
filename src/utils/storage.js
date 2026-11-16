/**
 * AZRAQ Resilient Browser Storage Utility
 * Safe, versioned, quota-aware localStorage read/write with in-memory fallback.
 * Prevents mobile browser crashes (QuotaExceededError / private mode).
 */

const STORAGE_PREFIX = 'azraq_v2_';
const inMemoryFallback = new Map();

/**
 * Check if localStorage is available and writable
 */
function isStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__azraq_storage_probe__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const storageAvailable = isStorageAvailable();

/**
 * Safely read and parse item from storage
 */
export function getStoredItem(key, defaultValue = null, validator = null) {
  const fullKey = `${STORAGE_PREFIX}${key}`;
  try {
    let raw = null;
    if (storageAvailable) {
      raw = window.localStorage.getItem(fullKey);
      // Backwards compatibility with un-prefixed keys
      if (raw === null) {
        raw = window.localStorage.getItem(`azraq_${key}`);
      }
    } else {
      raw = inMemoryFallback.get(fullKey) || null;
    }

    if (raw === null || raw === undefined) {
      return defaultValue;
    }

    const parsed = JSON.parse(raw);
    if (validator && typeof validator === 'function') {
      return validator(parsed) ? parsed : defaultValue;
    }
    return parsed;
  } catch (err) {
    console.warn(`[Storage Warning] Failed to read or parse "${key}":`, err.message);
    return defaultValue;
  }
}

/**
 * Safely serialize and write item to storage with quota resilience
 */
export function setStoredItem(key, value) {
  const fullKey = `${STORAGE_PREFIX}${key}`;
  try {
    const serialized = JSON.stringify(value);
    if (storageAvailable) {
      try {
        window.localStorage.setItem(fullKey, serialized);
      } catch (quotaErr) {
        // Handle QuotaExceededError: purge non-essential cache keys and retry
        console.warn(`[Storage Quota Warning] Quota exceeded while saving "${key}". Evicting legacy cache:`, quotaErr.message);
        try {
          window.localStorage.removeItem('azraq_products_catalog');
          window.localStorage.removeItem('azraq_collections');
          window.localStorage.setItem(fullKey, serialized);
        } catch (retryErr) {
          inMemoryFallback.set(fullKey, serialized);
        }
      }
    } else {
      inMemoryFallback.set(fullKey, serialized);
    }
  } catch (err) {
    console.warn(`[Storage Warning] Failed to write "${key}":`, err.message);
  }
}

/**
 * Safely remove an item
 */
export function removeStoredItem(key) {
  const fullKey = `${STORAGE_PREFIX}${key}`;
  try {
    if (storageAvailable) {
      window.localStorage.removeItem(fullKey);
      window.localStorage.removeItem(`azraq_${key}`);
    }
    inMemoryFallback.delete(fullKey);
  } catch (e) {}
}

// -------------------------------------------------------------
// Schema Validators to prevent malformed localStorage states
// -------------------------------------------------------------

export function validateCartItems(cart) {
  if (!Array.isArray(cart)) return false;
  return cart.every(item => item && (item.product || item.id) && Number(item.quantity) > 0);
}

export function validateFavoritesList(favs) {
  return Array.isArray(favs) && favs.every(id => typeof id === 'string');
}

export function validateOrdersList(orders) {
  if (!Array.isArray(orders)) return false;
  return orders.every(ord => ord && ord.id && typeof ord.id === 'string');
}

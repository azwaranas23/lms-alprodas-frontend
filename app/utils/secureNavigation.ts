/**
 * Secure navigation utility for handling sensitive data transfer between pages
 * This provides a more secure way than router state for sensitive data
 */

const TEMP_DATA_KEY = "alprodas_temp_nav_data";
const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

export interface TempNavData {
  email?: string;
  name?: string;
  message?: string;
  timestamp: number;
}

/**
 * Store temporary navigation data securely
 */
export function storeTempNavData(data: Omit<TempNavData, "timestamp">) {
  const tempData: TempNavData = {
    ...data,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(TEMP_DATA_KEY, JSON.stringify(tempData));
  } catch (error) {
    console.warn("Failed to store temp nav data:", error);
  }
}

/**
 * Retrieve temporary navigation data (without clearing)
 */
export function getTempNavData(): TempNavData | null {
  try {
    const stored = sessionStorage.getItem(TEMP_DATA_KEY);
    if (!stored) return null;

    const data: TempNavData = JSON.parse(stored);

    // Check if data has expired
    if (Date.now() - data.timestamp > EXPIRY_TIME) {
      clearTempNavData();
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Failed to retrieve temp nav data:", error);
    clearTempNavData();
    return null;
  }
}

/**
 * Retrieve and clear temporary navigation data
 */
export function getTempNavDataAndClear(): TempNavData | null {
  const data = getTempNavData();
  if (data) {
    clearTempNavData();
  }
  return data;
}

/**
 * Clear temporary navigation data
 */
export function clearTempNavData() {
  try {
    sessionStorage.removeItem(TEMP_DATA_KEY);
  } catch (error) {
    console.warn("Failed to clear temp nav data:", error);
  }
}

/**
 * Check if temporary navigation data exists
 */
export function hasTempNavData(): boolean {
  try {
    const stored = sessionStorage.getItem(TEMP_DATA_KEY);
    if (!stored) return false;

    const data: TempNavData = JSON.parse(stored);
    return Date.now() - data.timestamp <= EXPIRY_TIME;
  } catch (error) {
    return false;
  }
}

/** Returns true when pin is exactly 6 ASCII digits. */
export function isPinValid(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

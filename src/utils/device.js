// Phones & tablets (touch as primary input) get lighter rendering settings.
// Evaluated once at load so textures/materials never have to be swapped mid-session
// (e.g. when a phone is rotated to landscape).
export const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

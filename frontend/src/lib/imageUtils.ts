export function imageToUrl(data: Uint8Array, mimeType: string): string {
  const blob = new Blob([new Uint8Array(data)], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function isAdminLoggedIn(): boolean {
  return !!sessionStorage.getItem('adminToken');
}

export function getAdminToken(): string | null {
  return sessionStorage.getItem('adminToken');
}

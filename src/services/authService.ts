import { useAuthStore } from '@/stores/authStore';

/**
 * AuthService - EVM Wallet Authentication Service
 * Replaces legacy NextAuth implementation with direct wallet-based auth
 */
export class AuthService {
  private static instance: AuthService;

  private constructor() { }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Get Wallet Address as "Token"
   */
  public async getJWTToken(): Promise<string | null> {
    const address = sessionStorage.getItem('FinPro_wallet_address');
    return address || null;
  }

  /**
   * Get auth headers for API requests
   * Returns generic wallet headers instead of JWT
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    const address = sessionStorage.getItem('FinPro_wallet_address');

    if (!address) {
      console.warn('[AuthService] No wallet connected, returning empty headers');
      return {};
    }

    return {
      'X-Wallet-Address': address,
      // For backward compatibility if some API expects Authorization header, 
      // we can send the address as a mock token, though the backend must support it.
      // 'Authorization': `Bearer ${address}` 
    };
  }

  /**
   * Get user info
   */
  public getUser(): any {
    const address = sessionStorage.getItem('FinPro_wallet_address');
    if (!address) return null;
    return {
      id: address,
      email: `${address}@wallet.connect`,
      name: `${address.substring(0, 6)}...`
    };
  }

  public clearTokenCache(): void { }

  public isTokenExpired(): boolean {
    return false; // Wallets don't expire in this context
  }

  public handleAuthError(error: any): void {
    console.error('[AuthService] Auth error:', error);
    // Optionally redirect to login if 401
    if (error?.response?.status === 401) {
      window.location.href = '/login';
    }
  }

  public decodeJWTPayload(token: string): any {
    // Mock decoder since we use addresses as tokens now
    return {
      sub: token,
      user_id: token,
      email: `${token}@wallet.connect`
    };
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();


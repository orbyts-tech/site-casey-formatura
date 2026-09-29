export interface AdminIdentity {
  readonly email: string;
}

export type AdminSignInOutcome = "signedIn" | "invalidCredentials" | "notAllowed";

export interface AdminAuthGateway {
  signIn(email: string, password: string): Promise<AdminSignInOutcome>;
  signOut(): Promise<void>;
  getCurrentAdmin(): Promise<AdminIdentity | null>;
}

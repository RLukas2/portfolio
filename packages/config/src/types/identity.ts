export interface AuthProvider {
  icon: string;
  label: string;
  provider: string;
}

export interface Social {
  icon: string;
  name: string;
  url: string;
  username?: string;
}

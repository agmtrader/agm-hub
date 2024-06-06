
import { DefaultSession, TokenSet } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    firebaseToken: string;
  }
  interface Tokens extends TokenSet {
    uid: string;
  }
}
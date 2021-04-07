import { Service } from 'typedi';
import { sign, verify } from 'jsonwebtoken';

export interface JwtToken<T> {
  data: T;
  iat: number;
  exp: number;
}

@Service()
export class JwtService {
  private readonly BEARER: string = 'Bearer ';
  private readonly JWT_SECRET: string = process.env.JWT_SECRET ?? 'defaultSecret';

  sign<T>(payload: T, rememberMe: boolean) {
    const expiresIn = rememberMe ? '7d' : process.env.JWT_EXPIRATION_TIME;
    return this.BEARER + sign({ data: payload }, this.JWT_SECRET, { expiresIn });
  }

  verify<T>(token: string): JwtToken<T> | undefined {
    try {
      const splitToken = token.replace(this.BEARER, '');
      return verify(splitToken, this.JWT_SECRET) as any;
    } catch (err) {}
  }
}

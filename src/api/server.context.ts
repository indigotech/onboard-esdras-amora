import { UserTokenData } from '@domain/model';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { JwtService } from '@core/jwt.service';

export interface ServerContext {
  userId?: string;
}

export interface ContextParameters {
  req: Request;
  res: Response;
}

export const context = ({ req }: ContextParameters) => {
  const jwtService = Container.get(JwtService);

  const context: ServerContext = {};
  const token = req.headers.authorization;
  const decodedToken = token && jwtService.verify<UserTokenData>(token);

  if (decodedToken) {
    context.userId = decodedToken.data.userId;
  }

  return context;
};

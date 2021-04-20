import { UserTokenData } from '@domain/model';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { JwtService } from '@core/jwt.service';
import { AddressLoader } from '@api/user/address.dataloader';

export interface ServerContext {
  userId?: string;
  addressLoader: ReturnType<AddressLoader['exec']>;
}

export interface ContextParameters {
  req: Request;
  res: Response;
}

export const context = ({ req }: ContextParameters) => {
  const jwtService = Container.get(JwtService);
  const addressLoader = Container.get(AddressLoader).exec();

  const context: ServerContext = { addressLoader };
  const token = req.headers.authorization;
  const decodedToken = token && jwtService.verify<UserTokenData>(token);

  if (decodedToken) {
    context.userId = decodedToken.data.userId;
  }

  return context;
};

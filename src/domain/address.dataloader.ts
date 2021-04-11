import * as DataLoader from 'dataloader';
import { AddressDbDataSource } from '@data/sources/address.db.datasource';
import { AddressResponse } from '@api/user/address.type';
import { Service } from 'typedi';

@Service()
export class AddressLoader {
  constructor(private readonly datasource: AddressDbDataSource) {}

  exec() {
    return new DataLoader<string, AddressResponse[]>(async (userIds) => {
      const addresses = await this.datasource.findByUserIds(userIds as string[]);
      const userIdToAddress: Record<string, AddressResponse[]> = {};
      addresses.forEach((u) => {
        if (!userIdToAddress[u.userId!]) {
          userIdToAddress[u.userId!] = [u];
        } else {
          userIdToAddress[u.userId!].push(u);
        }
      });

      return userIds.map((userId) => userIdToAddress[userId]);
    });
  }
}

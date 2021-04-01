import * as i18n from 'i18n';
import * as path from 'path';
import { Service } from 'typedi';

@Service()
export class LocalizationService {
  constructor(private directory = path.join(__dirname, '..', '..', 'api', 'locale')) {
    i18n.configure({
      directory: this.directory,
      updateFiles: false,
    });
  }

  get __() {
    return i18n.__;
  }
}

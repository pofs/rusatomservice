import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../../framework/i18n/i18n.module';
import { filter, isEqual } from 'lodash';

@Pipe({name: 'withoutSelectedLanguage'})
export class WithoutSelectedLanguagePipe implements PipeTransform {
  transform(value: Array<Language>, lang: Language): Array<Language> {
    return filter(value, (language: Language) => !isEqual(language, lang));
  }
}

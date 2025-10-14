import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from 'src/app/services/translation.service';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) { }

  transform(value: string): string {
    return this.translationService.getTranslation(value);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocal',
  standalone: true
})
export class UtcToLocalPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    // Parse the input date, assuming it's in UTC
    const utcDate = new Date(value + 'Z'); // Append 'Z' to treat the input as UTC

    // Convert it to the local timezone using the user's timezone
    return utcDate.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }

}

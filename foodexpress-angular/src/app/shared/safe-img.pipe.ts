import { Pipe, PipeTransform } from '@angular/core';

const FALLBACKS: Record<string, string> = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
  promo:      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
  menu:       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
  avatar:     'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
};

@Pipe({ name: 'safeImg', standalone: true, pure: true })
export class SafeImgPipe implements PipeTransform {
  transform(url: string | null | undefined, type: keyof typeof FALLBACKS = 'restaurant'): string {
    return url || FALLBACKS[type] || FALLBACKS['restaurant'];
  }
}

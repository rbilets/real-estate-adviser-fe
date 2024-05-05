import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'image-gallery',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'], // should be 'styleUrls' not 'styleUrl'
})
export class ImageGalleryComponent implements OnChanges {
  @Input() images: string[] = [];
  mainImageUrl?: string;
  @ViewChild('thumbnailsContainer')
  thumbnailsContainer!: ElementRef<HTMLDivElement>;
  currentIndex: number = 0; // Keep track of the current image index

  ngOnChanges(): void {
    if (this.images.length) {
      this.mainImageUrl = this.images[0];
      this.currentIndex = 0; // Reset to first image on input change
    }
  }

  setMainImage(imageUrl: string): void {
    this.mainImageUrl = imageUrl;
    this.currentIndex = this.images.indexOf(imageUrl);
  }

  scrollLeft(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1; // Move to the previous image
      this.mainImageUrl = this.images[this.currentIndex];
      this.scrollToImage(this.currentIndex);
    }
  }

  scrollRight(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex += 1; // Move to the next image
      this.mainImageUrl = this.images[this.currentIndex];
      this.scrollToImage(this.currentIndex);
    }
  }

  private scrollToImage(index: number): void {
    const thumbnails: HTMLCollectionOf<Element> =
      this.thumbnailsContainer.nativeElement.children;
    const thumbnailElement = thumbnails[index] as HTMLElement;
    thumbnailElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }
}

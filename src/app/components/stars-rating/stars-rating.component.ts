import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stars-rating',
  templateUrl: './stars-rating.component.html',
  styleUrls: ['./stars-rating.component.scss']
})
export class StarsRatingComponent {
  @Input() rating: number = 0;
  stars: number[] = [0, 1, 2, 3, 4];
  filledStars: number = 0;
  filledLastStarPercentage: number = 0;

  ngOnInit() {
    this.calculateFilledStars();
  }

  ngOnChanges() {
    this.calculateFilledStars();
  }

  calculateFilledStars() {
    this.filledStars = Math.floor(this.rating);
    this.filledLastStarPercentage = (this.rating % 1) * 100;
    console.log({ filledStars: this.filledStars, filledLastStarPercentage: this.filledLastStarPercentage })
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent {
  @Input() likes: number = 0;

  likePost() {
    this.likes++;
  }
}

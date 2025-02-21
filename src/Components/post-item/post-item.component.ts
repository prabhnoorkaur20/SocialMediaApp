import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, LikeButtonComponent, CommentSectionComponent],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent {
  @Input() post!: { id: number; user: string; content: string; likes: number; comments: string[] };
}

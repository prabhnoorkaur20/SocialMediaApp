import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent {
  @Input() comments: string[] = [];
  newComment: string = '';

  addComment() {
    if (this.newComment.trim()) {
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  }
}

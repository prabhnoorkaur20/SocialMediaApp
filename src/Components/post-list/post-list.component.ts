import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostItemComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  posts = [
    { id: 1, user: 'Alice', content: 'Hello world! 🌍', likes: 5, comments: ['Nice post!', 'Welcome!'] },
    { id: 2, user: 'Bob', content: 'Angular is awesome! 🚀', likes: 10, comments: ['I agree!', 'Great framework!'] },
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}

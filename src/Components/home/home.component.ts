// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { PostListComponent } from '../post-list/post-list.component';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent {}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule

interface User {
  picture: {
    medium: string;
  };
  name: {
    first: string;
    last: string;
  };
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: string[];
  newComment?: string;
}

interface SuggestedUser {
  username: string;
  avatarUrl: string;
}

interface RandomUser {
  results: {
    picture: {
      medium: string;
    };
    name: {
      first: string;
      last: string;
    };
  }[];
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  avatarUrl: string = '';
  username: string = '';
  posts: Post[] = [];
  suggestedUsers: SuggestedUser[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchRandomUser();
    this.fetchPosts();
    this.fetchSuggestedUsers();
  }

  fetchRandomUser() {
    this.http.get<any>('https://randomuser.me/api/').subscribe((data) => {
      const user: User = data.results[0];
      this.avatarUrl = user.picture.medium;
      this.username = `${user.name.first} ${user.name.last}`;
    });
  }

  fetchPosts() {
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      .subscribe((data) => {
        let fetchedPosts = data.slice(0, 5);
        fetchedPosts[0].imageUrl = 'https://picsum.photos/600/400';
        fetchedPosts[1].videoUrl =
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        this.posts = fetchedPosts.map((post) => ({
          ...post,
          likes: Math.floor(Math.random() * 100),
          comments: [],
          newComment: '',
        }));
      });
  }

  toggleLike(post: Post) {
    post.likes++;
  }

  addComment(post: Post) {
    if (post.newComment) {
      const updatedComments = [...post.comments, post.newComment];
      const updatedPost = {
        ...post,
        comments: updatedComments,
        newComment: '',
      };
      this.posts = this.posts.map((p) => (p.id === post.id ? updatedPost : p));
    }
  }

  fetchSuggestedUsers() {
    this.http
      .get<RandomUser>('https://randomuser.me/api/?results=3')
      .subscribe((data) => {
        this.suggestedUsers = data.results.map((user) => ({
          username: `${user.name.first} ${user.name.last}`,
          avatarUrl: user.picture.medium,
        }));
      });
  }
}

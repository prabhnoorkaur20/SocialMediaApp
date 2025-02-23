import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';

interface User {
  id: number;
  username: string;
  avatarUrl: string;
  bio: string;
}

interface Post {
  title: string;
  body: string;
  imageUrl?: string | null;
  videoUrl?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  username: string = '';
  avatarUrl: string | null = null;
  bio: string = '';
  posts: Post[] = [];
  users: User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchPostsWithImages();
  }

  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:3000/users').subscribe({
      next: (users) => {
        this.users = users;
        if (this.users.length > 0) {
          this.username = this.users[0].username;
          this.avatarUrl = this.users[0].avatarUrl;
          this.bio = this.users[0].bio;
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  fetchPostsWithImages(): void {
    this.getRandomImageUrl().then((imageUrl1) => {
      this.getRandomImageUrl().then((imageUrl2) => {
        this.posts = [
          {
            title: 'My First Post',
            body: 'Hello world!',
            imageUrl: imageUrl1,
          },
          {
            title: 'My Video Post',
            body: 'Check out this video!',
            videoUrl:
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            title: 'My second post',
            body: 'Hello world!',
            imageUrl: imageUrl2,
          },
        ];
      });
    });
  }

  getRandomImageUrl(retryCount: number = 0): Promise<string> {
    const maxRetries = 3;
    return new Promise<string>((resolve) => {
      this.http
        .get('https://source.unsplash.com/random/600x400', {
          observe: 'response',
          responseType: 'blob',
        })
        .subscribe({
          next: (response: HttpResponse<Blob>) => {
            if (response.url) {
              resolve(response.url);
            } else {
              resolve('assets/default-post-image.png');
            }
          },
          error: (error) => {
            if (retryCount < maxRetries && error.status === 404) {
              console.log(
                `Retrying image fetch (${retryCount + 1}/${maxRetries})...`
              );
              this.getRandomImageUrl(retryCount + 1).then(resolve);
            } else {
              console.error('Error fetching image:', error);
              resolve('assets/default-post-image.png');
            }
          },
        });
    });
  }

  fetchAvatar(retryCount: number = 0): void {
    const maxRetries = 3;
    this.http
      .get('https://source.unsplash.com/random/200x200', {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          if (response.url) {
            this.avatarUrl = response.url;
          } else {
            this.avatarUrl = 'assets/default-avatar.png';
          }
        },
        error: (error) => {
          if (retryCount < maxRetries && error.status === 404) {
            console.log(
              `Retrying avatar fetch (${retryCount + 1}/${maxRetries})...`
            );
            this.fetchAvatar(retryCount + 1);
          } else {
            console.error('Error fetching avatar:', error);
            this.avatarUrl = 'assets/default-avatar.png';
          }
        },
      });
  }
}

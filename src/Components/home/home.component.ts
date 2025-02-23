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
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface User {
  picture: { medium: string };
  name: { first: string; last: string };
  id: number;
  username: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: Comment[];
  newComment?: string;
  topic: string;
  username?: string;
}

interface SuggestedUser {
  username: string;
  avatarUrl: string;
}

interface RandomUser {
  results: {
    picture: { medium: string };
    name: { first: string; last: string };
  }[];
}

interface Comment {
  text: string;
  username: string;
}

interface BackendUser {
  id: number;
  username: string;
  followers: number[];
}

interface Tip {
  title: string;
  body: string;
}

interface GeneralData {
  title: string;
  body: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  avatarUrl: string = '';
  username: string = '';
  posts: Post[] = [];
  suggestedUsers: SuggestedUser[] = [];
  trendingTopics: string[] = [
    'Cooking Reels',
    'Gaming Posts',
    'Travel Tips',
    'Tech News',
    'Fitness Challenges',
    'Art Showcase',
    'Music Discoveries',
    'Fashion Trends',
    'DIY Projects',
    'Photography Inspiration',
  ];
  currentUser: BackendUser = {
    id: 1,
    username: 'Alice Johnson',
    followers: [],
  };
  usersLoaded: boolean = false;
  users: BackendUser[] = [];
  filteredPosts: Post[] = [];
  filteredTips: Tip[] = [];
  filteredGeneralData: GeneralData[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchRandomUser();
    this.fetchPosts();
    this.fetchSuggestedUsers();
    this.fetchUsers();
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
        let fetchedPosts = data.slice(0, 10); // Fetch more posts
        this.posts = fetchedPosts.map((post, index) => ({
          ...post,
          likes: Math.floor(Math.random() * 100),
          comments: [],
          newComment: '',
          topic: this.trendingTopics[index % this.trendingTopics.length],
          imageUrl: `https://picsum.photos/600/400?random=${index}`, // Random Picsum image
          videoUrl:
            index % 2 === 0
              ? 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
              : undefined, // Add video every other post
        }));
      });
  }

  fetchUsers() {
    this.http
      .get<BackendUser[]>('http://localhost:3000/users')
      .subscribe((data) => {
        this.users = data;
        this.usersLoaded = true;
      });
  }

  toggleLike(post: Post) {
    post.likes++;
  }

  addComment(post: Post) {
    if (post.newComment && this.usersLoaded) {
      const randomUser =
        this.users[Math.floor(Math.random() * this.users.length)];
      const newComment: Comment = {
        text: post.newComment,
        username: randomUser.username,
      };
      const updatedComments = [...post.comments, newComment];
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

  filterFeed(topic: string) {
    this.posts = this.posts.filter((post) => post.topic === topic);
  }

  followUser(user: SuggestedUser) {
    this.http
      .get<BackendUser[]>(
        `http://localhost:3000/users?username=${user.username}`
      )
      .subscribe((data) => {
        const userToFollow = data[0];
        if (
          userToFollow &&
          !this.currentUser.followers.includes(userToFollow.id)
        ) {
          this.currentUser.followers.push(userToFollow.id);
          this.http
            .put(
              `http://localhost:3000/users/${this.currentUser.id}`,
              this.currentUser
            )
            .subscribe(() => {
              console.log(`Following user: ${user.username}`);
            });
        }
      });
  }

  navigateToTopic(topic: string) {
    if (topic.includes('Reels')) {
      const reelTopic = topic.replace(' Reels', '');
      this.router.navigate(['/reels', reelTopic]);
    } else if (topic.includes('Posts')) {
      this.filterPosts(topic.replace(' Posts', ''));
    } else if (topic.includes('Tips')) {
      this.filterTips(topic.replace(' Tips', ''));
    } else {
      this.filterGeneral(topic);
    }
  }

  filterPosts(topic: string) {
    console.log('Filtering posts by:', topic);
    this.filteredPosts = this.posts.filter((post) => {
      console.log('Post topic:', post.topic.toLowerCase());
      return post.topic.toLowerCase().includes(topic.toLowerCase());
    });
    console.log('Filtered posts:', this.filteredPosts);
  }

  fetchBackendPosts() {
    this.http.get<Post[]>('http://localhost:3000/posts').subscribe({
      next: (data) => {
        this.posts = data.map((post) => ({
          ...post,
          likes: Math.floor(Math.random() * 100),
          comments: [],
          newComment: '',
          topic: this.trendingTopics[post.id % this.trendingTopics.length],
          imageUrl: `https://picsum.photos/600/400?random=${post.id}`,
          videoUrl:
            post.id % 2 === 0
              ? 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
              : undefined,
        }));
      },
      error: (error) => {
        console.error('Error fetching backend posts:', error);
      },
    });
  }

  filterTips(topic: string) {
    const apiUrl = `http://localhost:3000/posts?body_like=${topic}`;
    this.http.get<Tip[]>(apiUrl).subscribe({
      next: (data) => {
        this.filteredTips = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error fetching tips:', error);
        this.filteredTips = [];
      },
    });
  }

  filterGeneral(topic: string) {
    const apiUrl = `http://localhost:3000/posts?body_like=${topic}`;
    this.http.get<GeneralData[]>(apiUrl).subscribe({
      next: (data) => {
        this.filteredGeneralData = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error fetching general data:', error);
        this.filteredGeneralData = [];
      },
    });
  }
}

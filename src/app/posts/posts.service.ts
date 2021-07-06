import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(){
    this.http.get<{mesage:string, posts: [{_id: string, title: string, content: string}] }>('http://localhost:3000/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((currPost)=>{
      this.posts = currPost;
      this.postsUpdated.next([...this.posts]);
    });

  }
  updatePost(id:string | null, title: string, content: string){
    const post: Post = {id: id, title: title, content: content};
    this.http
    .put('http://localhost:3000/posts/'+ id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      updatedPosts[updatedPosts.findIndex(p=>p.id === post.id)] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"])
    });
  }
  deletePost(postId:string|null){
    this.http.delete('http://localhost:3000/posts/'+postId)
    .subscribe(()=>{
      const updatedPosts = this.posts.filter(post => post.id !== postId)
      this.posts = updatedPosts
      this.postsUpdated.next([...this.posts]);

    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string|null){
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/posts/'+ id);
  }

  addPost(title:string, content: string)
  {
    const post:Post = {id: "", title:title, content:content};
    this.http.post<{message:string, postId: string}>('http://localhost:3000/posts', post)
    .subscribe((responseData)=>{
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"])
    });

  }
}


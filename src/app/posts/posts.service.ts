import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}

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

  deletePost(postId:string){
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

  addPost(title:string, content: string)
  {
    const post:Post = {id: "", title:title, content:content};
    this.http.post<{message:string, postId: string}>('http://localhost:3000/posts', post)
    .subscribe((responseData)=>{
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });

  }
}


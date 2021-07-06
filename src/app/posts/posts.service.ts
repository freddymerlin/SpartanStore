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
    this.http.get<{mesage:string, posts: any }>('http://localhost:3000/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((currPost)=>{
      this.posts = currPost;
      this.postsUpdated.next([...this.posts]);
    });

  }
  updatePost(id:string | null, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if (typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title)


    }else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
    .put('http://localhost:3000/posts/'+ id, postData)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      };
      updatedPosts[updatedPosts.findIndex(p=>p.id === id)] = post;
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/posts/'+ id);
  }

  addPost(title:string, content: string, image: File)
  {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title)
    this.http.post<{message:string, post: Post}>('http://localhost:3000/posts', postData)
    .subscribe((responseData)=>{
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };

      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"])
    });

  }
}


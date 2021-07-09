import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(postsPerPage: number, currentNumber: number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentNumber}`;
    this.http.get<{mesage:string, posts: any, maxPosts: number }>('http://localhost:3000/posts'+queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts}
    })
    )
    .subscribe((currPostData)=>{
      this.posts = currPostData.posts;
      this.postsUpdated.next({
        posts:[...this.posts],
        postCount: currPostData.maxPosts});
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
        imagePath: image,
        creator: ""
      };
    }
    this.http
    .put('http://localhost:3000/posts/'+ id, postData)
    .subscribe(response => {
      this.router.navigate(["/"])
    });
  }
  deletePost(postId:string|null){
    return this.http.delete('http://localhost:3000/posts/'+postId);
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string|null){
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;

    }>('http://localhost:3000/posts/'+ id);

  }

  addPost(title:string, content: string, image: File)
  {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title)
    this.http.post<{message:string, post: Post}>('http://localhost:3000/posts', postData)
    .subscribe((responseData)=>{

      this.router.navigate(["/"])
    });

  }
}


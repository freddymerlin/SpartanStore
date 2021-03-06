import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';


const BACKEND_URL = environment.apiUrl + '/posts'
@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(postsPerPage: number, currentNumber: number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentNumber}`;
    this.http.get<{mesage:string, posts: any, maxPosts: number }>(BACKEND_URL+queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          contact: post.contact,
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
  updatePost(id:string | null, title: string, content: string, image: FileList, contact: string){
    let postData: any;
    if (typeof(image) === 'object' ){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      const imageArr = Array.from(image);
      imageArr.forEach(image => {
        postData.append('image', image);
      });
      postData.append("contact", contact);

    }else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        contact: contact,
        creator: ""
      };
    }
    this.http
    .put(BACKEND_URL+ '/'+ id, postData)
    .subscribe(response => {
      this.router.navigate(["/"])
    });
  }
  deletePost(postId:string|null){
    return this.http.delete(BACKEND_URL+'/'+postId);
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string|null){
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string[];
      contact: string;
      creator: string;

    }>(BACKEND_URL+'/'+ id);

  }

  addPost(title:string, content: string, image: FileList, contact: string)
  {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    const imageArr = Array.from(image);
    imageArr.forEach(image => {
      postData.append('image', image);
    });
    postData.append("contact", contact)
    this.http.post<{message:string, post: Post}>(BACKEND_URL, postData)
    .subscribe((responseData)=>{

      this.router.navigate(["/"])
    });

  }
}


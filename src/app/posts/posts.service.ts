<<<<<<< HEAD
import {Post} from './post.model'
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService
{
=======
import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn: 'root'})
export class PostsService {
>>>>>>> f1692ce (Fixed issues with bodyParser)
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}

  getPosts(){
<<<<<<< HEAD
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData) =>{
      this.posts = postData.posts;
      this.postsUpdated.next([...this.posts]);
    });
=======
    this.http.get<{mesage:string, posts: Post[] }>('http://localhost:3000/posts')
    .subscribe((postData)=>{
      this.posts = postData.posts;
      this.postsUpdated.next([...this.posts]);
    });

>>>>>>> f1692ce (Fixed issues with bodyParser)
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

<<<<<<< HEAD
  addPost(title:string, content:string){
    const post: Post ={id:"4", title:title, content: content};
    this.http.post<{message:string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData)=> {
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts])
    });
  }
}
=======
  addPost(title:string, content: string)
  {
    const post:Post = {id: "", title:title, content:content};
    this.http.post<{message:string}>('http://localhost:3000/posts', post)
    .subscribe((responseData)=>{
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });

  }
}

>>>>>>> f1692ce (Fixed issues with bodyParser)

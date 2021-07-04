<<<<<<< HEAD
import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {Subscription} from 'rxjs';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
=======

import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from '../post.model';
import { PostsService } from "../posts.service";

>>>>>>> f1692ce (Fixed issues with bodyParser)
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
<<<<<<< HEAD
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postSub : Subscription
  constructor(public postsService: PostsService){}
  ngOnInit(){
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener() .subscribe((posts: Post[])=> {
      this.posts = posts;
    });
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}
=======
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  private postsSub!: Subscription;
  constructor(public postsService: PostsService){}
  ngOnInit()
  {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[])=>{
      this.posts = posts;
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}

>>>>>>> f1692ce (Fixed issues with bodyParser)

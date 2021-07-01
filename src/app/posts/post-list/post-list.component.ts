import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {Subscription} from 'rxjs';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
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

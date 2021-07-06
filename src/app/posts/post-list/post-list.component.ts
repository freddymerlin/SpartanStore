
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from '../post.model';
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  isLoading = false;
  private postsSub!: Subscription;
  constructor(public postsService: PostsService){}
  ngOnInit()
  {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[])=>{
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string|null){
    this.postsService.deletePost(postId)
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}


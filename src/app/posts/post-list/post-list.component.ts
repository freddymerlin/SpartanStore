
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
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

  postsPerPage = 2;
  userAuth = false;
  currentPage = 1;
  userId: string;
  add = false;
  pageSizeOptions = [1,2,5,10];
  public totalPosts = 0;
  private postsSub!: Subscription;
  private authStatusSub: Subscription;
  constructor(public postsService: PostsService, private authService: AuthService){}
  removeAdd(){
    this.add = false;
  }
  copy(text){
    console.log(text)
    navigator.clipboard.writeText(text);
    alert("Copied the contact: " + text);
  }
  addMore(){

    let activate = (!this.add)


    this.add = !this.add;
    let postActive = document.getElementsByClassName("post-info").length;
    for(let i = 0; i < postActive; i++){
      if (activate){
        let addButton = document.getElementsByClassName("fill")[i] as HTMLElement;
        addButton.classList.add("active")
      }
      else{
        let addButton = document.getElementsByClassName("fill")[i] as HTMLElement;
        addButton.classList.remove("active")
      }
      let element = document.getElementsByClassName("post-info")[i] as HTMLElement;
      if (element.classList.contains('height')){
          element.classList.remove("height");
      }
      else{
        element.classList.add("height");
      }
    }
  }
  open(){
    this.add = false;
    let postActive = document.getElementsByClassName("post-info").length;
    for(let i = 0; i < postActive; i++){
      let addButton = document.getElementsByClassName("fill")[i] as HTMLElement;
      addButton.classList.remove("active")
      let element = document.getElementsByClassName("post-info")[i] as HTMLElement;
      if (element.classList.contains('height')){
        element.classList.remove("height");
      }
    }
  }



  ngOnInit()
  {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number})=>{
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuth = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = false;
  }

  onDelete(postId: string|null){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    }, ()=>{
      this.isLoading = false;
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }


}


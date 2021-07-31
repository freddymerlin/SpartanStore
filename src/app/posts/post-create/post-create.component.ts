import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router'
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';


@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  enteredContact = '';
  form!: FormGroup;
  private mode = 'create';
  imagePreview: string[];
  numFiles = 0
  private postId!: string | null;
  private authStatusSub : Subscription;
  public post: any;
  isLoading = false;
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router){}

  ngOnInit(){
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus =>{
      this.isLoading = false;
    });
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [
        Validators.required,
        Validators.minLength(3)]
      }),
      'contact': new FormControl(null, {validators: [
        Validators.required,
        Validators.minLength(2)]
      }),
      'content': new FormControl(null, {validators: [
        Validators.required,
        Validators.minLength(3)]
      }),
      'image': new FormControl(null, {validators: [
        Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData=>{

          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            contact: postData.contact,
            creator: postData.creator
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'contact': this.post.contact,
            'image': this.post.imagePath
          });

        });

      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    document.getElementById("photos-preview").innerHTML = "";
    let fileList = (event.target as HTMLInputElement).files;
    this.numFiles = fileList.length
    if (this.numFiles > 5){
      alert("You are only allowed to upload a maximum of 5 files");
      fileList = null;
      return;
    }
    this.isLoading = true
    const preview = document.getElementById('photos-preview');
      Array.from(fileList).forEach((file: File) => {
          const reader = new FileReader();
          reader.onload = () => {
            var li = document.createElement("li");
            li.style.float = "left";
            li.style.padding = ".5em";
            li.style.paddingLeft = "0em";
            li.style.paddingRight = "1em";
            var image = new Image();
            image.src = String(reader.result);
            image.style.maxHeight = "20vh";

            li.appendChild(image)
            preview.appendChild(li);
          }
          reader.readAsDataURL(file);
      }
    );
    this.isLoading = false
    this.form.patchValue({image: fileList});
    this.form.get('image').updateValueAndValidity();
  }

  checkUpload(){
    if (this.numFiles > 5){
      alert("Invalid number of images: Redirecting to Home")
      this.router.navigate(["/"])
   }
  }
  onSavePost(){
    if (this.form.invalid){
      return ;
    }

    this.isLoading = true;
    if (this.mode === 'create')
    {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image, this.form.value.contact);
    }
    else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.contact
      );
    }

    this.form.reset();
  }

  ngOnDestroy (){
    this.authStatusSub.unsubscribe();
  }

}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterial } from "../angular-material";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";

@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterial,
    RouterModule
  ]

})
export class PostsModule {

}

import { Component, OnInit } from "@angular/core";
import { PostsService } from "src/app/shared/posts.service";
import { Observable } from "rxjs";
import { Post } from "src/app/shared/interfaces";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
  public posts$: Observable<Post[]>;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.posts$ = this.postsService.getAll();
  }
}

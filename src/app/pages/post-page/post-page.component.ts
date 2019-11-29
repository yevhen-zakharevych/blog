import { Component, OnInit, Input } from "@angular/core";
import { Post } from "src/app/shared/interfaces";
import { PostsService } from "src/app/shared/posts.service";
import { ActivatedRoute, Params } from "@angular/router";
import { switchMap, takeUntil } from "rxjs/operators";
import { Subject, Observable } from "rxjs";

@Component({
  selector: "app-post-page",
  templateUrl: "./post-page.component.html",
  styleUrls: ["./post-page.component.scss"]
})
export class PostPageComponent implements OnInit {
  public post$: Observable<Post>;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.post$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getById(params["id"]);
      })
    );
  }
}

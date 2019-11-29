import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostsService } from "src/app/shared/posts.service";
import { Post } from "src/app/shared/interfaces";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AlertService } from "../shared/services/alert.service";

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.scss"]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  public posts: Post[];
  public isLoadingResults: boolean;
  public displayedColumns: string[];
  public searchStr: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private postsService: PostsService,
    private alertService: AlertService
  ) {
    this.posts = [];
    this.isLoadingResults = true;
    this.displayedColumns = ["position", "author", "title", "date", "action"];
    this.searchStr = "";
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.postsService
      .getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.posts = response;
        this.isLoadingResults = false;
      });
  }

  remove(id: string) {
    this.postsService
      .remove(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.alertService.danger("Post has been removed.");
        this.posts = this.posts.filter(post => post.id !== id);
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

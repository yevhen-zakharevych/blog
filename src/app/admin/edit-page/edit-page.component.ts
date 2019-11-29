import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { PostsService } from "src/app/shared/posts.service";
import { switchMap, takeUntil } from "rxjs/operators";
import { Post } from "src/app/shared/interfaces";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { AlertService } from "../shared/services/alert.service";

@Component({
  selector: "app-edit-page",
  templateUrl: "./edit-page.component.html",
  styleUrls: ["./edit-page.component.scss"]
})
export class EditPageComponent implements OnInit, OnDestroy {
  public editForm: FormGroup;
  public post: Post;
  public submitted: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private postsSrevice: PostsService,
    private alertService: AlertService
  ) {
    this.submitted = false;
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postsSrevice.getById(params["id"]);
        })
      )
      .subscribe((post: Post) => {
        this.post = post;
        this.editForm = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        });
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  submit() {
    if (this.editForm.invalid) {
      return;
    }

    this.submitted = true;

    const post: Post = {
      ...this.post,
      title: this.editForm.value.title,
      text: this.editForm.value.text
    };

    this.postsSrevice
      .update(post)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.alertService.success("Post has been updated.");
        this.submitted = false;
      });
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Post } from "src/app/shared/interfaces";
import { PostsService } from "src/app/shared/posts.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AlertService } from "../shared/services/alert.service";

@Component({
  selector: "app-create-page",
  templateUrl: "./create-page.component.html",
  styleUrls: ["./create-page.component.scss"]
})
export class CreatePageComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public submitted: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private postsService: PostsService,
    private alertService: AlertService
  ) {
    this.submitted = false;
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.createForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required)
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  submit() {
    if (this.createForm.invalid) {
      return;
    }
    this.submitted = true;

    const post: Post = {
      title: this.createForm.value.title,
      author: this.createForm.value.author,
      text: this.createForm.value.text,
      date: new Date()
    };

    this.postsService
      .create(post)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.submitted = false;
        this.alertService.success("Post has been created");
        this.createForm.reset();
      });
  }
}

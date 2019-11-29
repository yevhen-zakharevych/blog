import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { AlertService, Alert, AlertType } from "../../services/alert.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"]
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() delay = 5000;

  public text: string;
  public type: AlertType;
  private _unsubscribeAll: Subject<any>;

  constructor(private alertService: AlertService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.alertService.alert$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((alert: Alert) => {
        this.text = alert.text;
        this.type = alert.type;

        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          this.text = "";
        }, this.delay);
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

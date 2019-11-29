import { NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "./material.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";

@NgModule({
  imports: [
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    QuillModule,
    FormsModule
  ]
})
export class SharedModule {}

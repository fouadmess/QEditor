import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QEditorModule } from 'projects/qeditor/src/public_api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    QEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

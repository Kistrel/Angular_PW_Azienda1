import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PW1FormMainComponent } from './pw1-form-main/pw1-form-main.component';
import { NothingFoundComponent } from './nothing-found/nothing-found.component';

const appRoutes: Routes = [
  { path: 'form_PW1', component: PW1FormMainComponent },
  { path: '', redirectTo: 'form_PW1', pathMatch: 'full' },
  { path: '**', component: NothingFoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    PW1FormMainComponent,
    NothingFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- true for debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './components/header/header.module';
import { StakeTabsComponent } from './pages/stake-tabs/stake-tabs.component';

@NgModule({
  declarations: [AppComponent, StakeTabsComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, AppRoutingModule, IonicModule.forRoot({}), HeaderModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

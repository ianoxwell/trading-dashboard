import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { StakeTabsComponent } from './pages/stake-tabs/stake-tabs.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, StakeTabsComponent],
  imports: [BrowserModule, AppRoutingModule, IonicModule.forRoot({})],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

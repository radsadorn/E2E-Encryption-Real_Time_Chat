import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './component/chat/chat.component';
import { HomeComponent } from './component/home/home.component';
import { ChatService } from './services/chat.service';
import { CryptoService } from './services/crypto.service';
import { UserService } from './services/user.service';

const config: SocketIoConfig = { 
  url: environment.SERVER_URL, 
  options: {
    transports: ['websocket']
  } 
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    ChatService,
    CryptoService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

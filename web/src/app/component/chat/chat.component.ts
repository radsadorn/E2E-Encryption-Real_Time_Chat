import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { Action, Event, User } from '../../models';

interface Peer {
  username: string;
  publicKey?: CryptoKey;
  publicKeyBase64?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  private _msgSub!: Subscription;
  private _joinSub!: Subscription;
  private _leftSub!: Subscription;

  chatName!: string;

  room!: any;
  user = {
    username: 'radsadorn',
  };

  peers!: Peer[];
  message: string = '';
  messages: any[] = [];

  desktop = true;
  event = Event;

  private sub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private chatService: ChatService,
    private cryptoService: CryptoService
  ) {}

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList!: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef })
  matListItems!: QueryList<MatListItem>;

  ngOnInit(): void {
    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.chatName = params['name'];
        this.chatService.openRoom(this.chatName);
        this.user = this.authService.getUserToken();
        console.log(this.user);
        this.loadMessages(this.chatName);

        this._msgSub = this.chatService.newMessage.subscribe((msg) =>
          this.receiveMessages(msg)
        );
      },
      error: (err: any) => {
        console.log(err);
        this.router.navigate(['/']);
      },
      complete: () => {
        console.log('complete..');
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // private showActivePeers(): void {
  //     if (this.messages.length === 0) {
  //         this.peers.forEach(peer => {
  //             this.messages.push(new Message(peer, Event.PEER_JOINED));
  //         });
  //     }
  // }

  private async receiveMessages(message: any) {
    // this.snackBar.dismiss();

    switch (message.type) {
      case Event.PEER_JOINED: {
        // const publicKey = await this.cryptoService.decodeBase64PublicKey(message.data.who.key);
        // const newPeer: User = new User(message.from, publicKey, message.data.who.key);
        // this.peers.push(newPeer);
        // this.messages.push(new Message(newPeer, message.type));
        // this.chatService.sendBrowserNotification(newPeer.name, Event.PEER_JOINED);
        break;
      }
      case Event.MESSAGE_RECEIVED: {
        console.log(message);
        // const messageDecrypted = await this.cryptoService.decrypt(message.data.message);
        if (message.to === this.user.username) {
          const { from, to, content, type } = message;
          const newMessage = { from, to, content, type };
          this.messages = [...this.messages, newMessage];
        }
        // this.chatService.sendBrowserNotification(fromUser.name, Event.MESSAGE_RECEIVED);
        break;
      }
      case Event.PEER_LEFT: {
        // const userLeft: User = this.peers.find(peer => peer.name === message.data.who.name);
        // const indexPeer: number = this.peers.findIndex(peer => peer.name === message.data.who.name);
        // this.messages.push(new Message(userLeft, message.type));

        // this.peers.splice(indexPeer, 1);
        // this.chatService.sendBrowserNotification(userLeft.name, Event.PEER_LEFT);
        break;
      }
      //   case Event.COMMAND_REJECTED:
      //   {
      //     this.openUserPopup(this.dialogParams);
      //     this.snackBar.open(message.data.reason, 'OK', {duration: POP_UP_MSJ_DURATION_MS});
      //   }
    }
  }

  loadMessages(chatName: string): void {
    this.chatService.getChatMessage(chatName).subscribe({
      next: (res: any) => {
        this.room = res.chatData;
        this.messages = res.chatMessages;
        this.peers = res.chatData.member;
      },
      error: (err: any) => {},
    });
  }

  async getPeerData(peer: Peer): Promise<string> {
    const publicKey = await this.cryptoService.decodeBase64PublicKey(
      peer.publicKeyBase64 as string
    );
    const newPeer: Peer = {
      username: peer.username,
      publicKey: publicKey,
      publicKeyBase64: peer.publicKeyBase64 as string,
    };

    this.peers.push(newPeer);
    // this.messages.push(new Message(newPeer, message.type));
    // this.chatService.sendBrowserNotification(newPeer.name, Event.PEER_JOINED);
    return '';
  }

  leaveChat(): void {
    console.log('leave...');
    this.chatService.leaveRoom(this.chatName).subscribe({
      next: (res: any) => {
        console.log(res);
        this.router.navigate(['']);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  closeChat(): void {
    console.log('close...');
    this.chatService.closeRoom(this.chatName);
    this.router.navigate(['']);
  }

  sendMessage(messageContent: string): void {
    if (!messageContent) {
      return;
    }

    this.peers.forEach((peer) => {
      // this.cryptoService
      // .encrypt(messageContent, peer.publicKey as CryptoKey)
      // .then(encryptedMessage => {
      //     message = {
      //     type: Action.SENDMESSAGE,
      //     data: {
      //         to: peer.name,
      //         message: encryptedMessage
      //     }
      //     };
      //     this.chatService.sendChatMessage(message);
      // });
      const message = {
        chatName: this.chatName,
        from: this.user.username,
        to: peer.username,
        content: messageContent,
        type: Event.MESSAGE_RECEIVED,
      };

      this.chatService.sendChatMessage(message).subscribe({
        next: (res: any) => {
          const socketMessage = {
            ...message,
            type: Action.SENDMESSAGE,
          };
          this.chatService.sendMessage(message);
        },
        error: (err: any) => {},
        complete: () => {},
      });
    });

    this.message = '';
  }
}

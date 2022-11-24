import { Component, OnInit } from '@angular/core'; 
import { SocketService } from 'src/app/services/socket.service';  

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit { 

	constructor(
		private socketService: SocketService 
	) { }

	ngOnInit(): void { 
            // here we can use socket events and listeners using socketService
	} 
}
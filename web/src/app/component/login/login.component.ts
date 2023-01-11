import { Component, OnInit } from '@angular/core';  
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface User {
    username: string;
    password: string;
    publicKeyBase64: string;
    privateKeyBase64: string;
}

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { 

    user: User = {
        username: '',
        password: '',
        publicKeyBase64: '1234',
        privateKeyBase64: '1234',
    }

	constructor(
        private router: Router,
        private authService: AuthService,
        public spinner: NgxSpinnerService,
	) { }

	ngOnInit(): void { 
            
	} 

    login(): void {
        console.log(this.user);
        this.spinner.show();
        this.authService.login(this.user).subscribe({
            next: (token: any) => {
                console.log(token)
                this.router.navigate(['/']);
            },
            error: (err: any) => {
                this.authService.deleteCurrentSession();
                this.spinner.hide();
            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }
}
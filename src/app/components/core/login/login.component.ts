import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userName: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  login() {
    localStorage.setItem('currentUser', this.userName);
    this.router.navigate(['/home']);
  }
}
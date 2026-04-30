import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone : true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  
  loginForm: FormGroup;
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<boolean | null>(null)


  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) 
  {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
   }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading$.next(true);
    this.error$.next(null);


    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading$.next(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loading$.next(false);
        this.error$.next(true);
      }
    });
  }
}

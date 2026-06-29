import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private auth   = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error    = '';
  loading  = false;

  submit(): void {
    if (!this.username || !this.password) return;
    this.loading = true;
    this.error   = '';

    this.auth.login(this.username, this.password).subscribe(ok => {
      this.loading = false;
      if (ok) {
        this.router.navigate(['/admin']);
      } else {
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}

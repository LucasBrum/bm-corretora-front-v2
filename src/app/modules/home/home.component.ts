import { CookieService } from 'ngx-cookie-service';
import { SignupUserRequest } from './../../models/interfaces/user/SignupUserRequests';
import { UserService } from './../../services/user/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/models/interfaces/auth/AuthRequest';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  loginCard = true;
  disableCheckbox = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    senha: ['', Validators.required],
  });

  signupForm = this.formBuilder.group({
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    telefone: ['', Validators.required],
    email: ['', Validators.required],
    senha: ['', Validators.required],
    perfil: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmitLoginForm() {
    this.userService
      .authUser(this.loginForm.value as AuthRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          let authorization = response.headers
            .get('Authorization')
            .substring(7);

          this.userService.successfullLogin(authorization);
          this.cookieService.set('USER_INFO', authorization);

          this.router.navigate(['/dashboard']); //navega para a página estabelecida no component nav após o login
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Bem vindo!`,
            life: 2000,
          });
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao efetuar login!',
            life: 2000,
          });
          console.log(err);
        }
      );
  }

  onSubmitSignupForm(): void {
    if (this.signupForm.value && this.signupForm.valid) {
      console.log('signup >>>', this.signupForm.value);
      this.userService
        .signupUser(this.signupForm.value as SignupUserRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              alert('Usuário teste criado com sucesso!');
              this.signupForm.reset();
              this.loginCard = true;

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário criado com sucesso!',
                life: 2000,
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `${err.error.message}`,
              life: 2000,
            });
            console.log(err.error.message);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

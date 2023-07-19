import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;
  disableCheckbox = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    senha: ['', Validators.required]
  })

  signupForm = this.formBuilder.group({
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    telefone: ['', Validators.required],
    email: ['', Validators.required],
    senha: ['', Validators.required],
    perfil: ['']
  })

  constructor(private formBuilder: FormBuilder) {

  }

  onSubmitLoginForm(): void {
    console.log('Dados do Formulário de Login: ', this.loginForm.value)
  }

  onSubmitSignupForm(): void {
    console.log('Dados do Formulário de Login: ', this.signupForm.value)
  }
}

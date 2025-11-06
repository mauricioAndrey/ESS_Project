import { Component, OnInit } from '@angular/core';
import { Aluno } from '../../../common/aluno';
import { AlunoService } from './aluno.service';

  @Component({
   selector: 'app-root',
   templateUrl: './alunos.component.html',
   styleUrls: ['./alunos.component.css']
 })
 export class AlunosComponent implements OnInit {
    
    /* A inicialização dos atributos é feita logo após clicar 
       no botão Alunos. Para manter os valores digitados nos campos
       logo antes de clicar em Metas, estes valores teriam que ser 
       passados para o componente Metas, e depois repassados de volta 
       para este componente inicializar aluno com esses valores. 

       A renderização do HTML é feita após a alteração desses atributos
       através de um dos métodos abaixo, mas só após o término da 
       execução do método.
    */
    aluno: Aluno = new Aluno();
    alunos: Aluno[] = [];
  cpfduplicado: boolean = false;
  loginduplicado: boolean = false;

    constructor(private alunoService: AlunoService) {}

    criarAluno(a: Aluno): void {
       /* Clone feito para que atraso na resposta da requisição
          não permita que alterações feitas no textfield após a
          solicitação do cadastro afetem o objeto ar a ser 
          adicionado ao array.
          
          Sem o clone, a e ar estariam apontando para o mesmo
          objeto apontado por this.alunos. Qualquer mudança nos
          campos de texto são refletidas no objeto apontado por 
          this.alunos, e consequentemente seriam também 
          refletidas em ar.
        */  
       this.alunoService.criar(a.clone())
             .subscribe(
                res => {
                  if (res && res.success) {
                    this.alunos.push(a.clone());
                    this.aluno = new Aluno();
                    this.cpfduplicado = false;
                    this.loginduplicado = false;
                  } else if (res && res.failure === 'cpf') {
                    this.cpfduplicado = true;
                    this.loginduplicado = false;
                    alert('Já existe um aluno com esse CPF');
                  } else if (res && res.failure === 'login') {
                    this.loginduplicado = true;
                    this.cpfduplicado = false;
                    alert('Já existe um aluno com esse login do GitHub');
                  } else {
                    alert('O aluno não pode ser cadastrado');
                  }
                },
                msg => { alert(msg.message); }
              );    
    }

    //Roteiro SaaS 
    /*//ta dando erro 
    alunos: Aluno[] = [];
    gravar(a:Aluno):void{
      this.alunoService.gravar(a);
      this.alunos.push(a)
      //this.aluno = {nome: "", cpf: "", email: "", loginGitHub: ""};
    }
    //*/

    onMove(): void {
     this.cpfduplicado = false;
     this.loginduplicado = false;
    }

     /* Executado após clicar no botão Alunos, 
        mas logo antes é feita a inicialização dos 
        atributos do componente.  
      */
     ngOnInit(): void {
       this.alunoService.getAlunos()
             .subscribe(
               as => { this.alunos = as; },
               msg => { alert(msg.message); }
              );
     }

    removerAluno(cpf: string): void {
      if (!confirm('Confirma remoção do aluno com CPF ' + cpf + '?')) return;
      this.alunoService.remover(cpf)
        .subscribe(
          res => {
            if (res && res.success) {
              this.alunos = this.alunos.filter(a => a.cpf !== cpf);
            } else if (res && res.failure === 'notfound') {
              alert('Aluno não encontrado para remoção');
            } else {
              alert('Falha ao remover aluno');
            }
          },
          err => { alert(err.message || err); }
        );
    }

  }
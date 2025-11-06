import { Aluno } from '../common/aluno';

export class CadastroDeAlunos {
   alunos: Aluno[] = [];

    cadastrar(aluno: Aluno): Aluno {
     var result = null;
     if (this.cpfNaoCadastrado(aluno.cpf) && this.loginNaoCadastrado(aluno.login)) {
       result = new Aluno();
       result.copyFrom(aluno);
       this.alunos.push(result);
     }
     return result;
    }

    cpfNaoCadastrado(cpf: string): boolean {
      return !this.alunos.find(a => a.cpf == cpf);
    }

    loginNaoCadastrado(login: string): boolean {
      // considera login vazio como não-duplicado (validação de obrigatoriedade não tratada aqui)
      if (!login) return true;
      return !this.alunos.find(a => a.login == login);
    }

    atualizar(aluno: Aluno): Aluno {
      var result: Aluno = this.alunos.find(a => a.cpf == aluno.cpf);
      if (!result) return null;
      // if login is being changed, ensure no other aluno uses that login
      if (aluno.login && aluno.login !== result.login) {
        var other = this.alunos.find(a => a.login == aluno.login);
        if (other && other.cpf !== aluno.cpf) {
          return null; // login already used by another student
        }
      }
      result.copyFrom(aluno);
      return result;
    }

    getAlunos(): Aluno[] {
     return this.alunos;
    }

    remover(cpf: string): boolean {
      const idx = this.alunos.findIndex(a => a.cpf == cpf);
      if (idx >= 0) {
        this.alunos.splice(idx, 1);
        return true;
      }
      return false;
    }
}
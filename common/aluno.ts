export class Aluno {
  nome: string;
  cpf: string;
  email: string;
  loginGitHub: string;
  metas: Map<string,string>;

  constructor() {
    this.clean();
  }

  clean(): void {
    this.nome = "";
    this.cpf = "";
    this.email = "";
    this.loginGitHub = "";
    this.metas = new Map<string,string>();
  }

  clone(): Aluno {
    var aluno: Aluno = new Aluno();
    aluno.copyFrom(this);
    return aluno;
  }

  copyFrom(from: Aluno): void {
    this.nome = from.nome;
    this.cpf = from.cpf;
    this.email = from.email;
    this.loginGitHub = from.loginGitHub;
    this.copyMetasFrom(from.metas);
  }

  copyMetasFrom(from: Map<string,string>): void {
    this.metas = new Map<string,string>();
    if (!from) return;
    // Map não deve ser iterado com `for..in` — usar forEach para copiar chaves/valores
    from.forEach((value: string, key: string) => {
      this.metas.set(key, value);
    });
  }
}
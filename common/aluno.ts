export class Aluno {
  nome: string;
  cpf: string;
  email: string;
  login: string;
  metas: Map<string,string>;

  constructor() {
    this.clean();
  }

  clean(): void {
    this.nome = "";
    this.cpf = "";
    this.email = "";
    this.login = "";
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
    this.login = from.login;
    this.copyMetasFrom(from.metas);
  }

  copyMetasFrom(from: any): void {
    this.metas = new Map<string,string>();
    if (!from) return;
    // Aceita tanto Map quanto plain object (JSON) vindo pelo HTTP
    if (from instanceof Map) {
      from.forEach((value: string, key: string) => {
        this.metas.set(key, value);
      });
    } else if (typeof from === 'object') {
      for (const key of Object.keys(from)) {
        this.metas.set(key, (from as any)[key]);
      }
    }
  }
}
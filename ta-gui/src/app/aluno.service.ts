import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, map } from 'rxjs/operators';

import { Aluno } from '../../../common/aluno';

@Injectable()
export class AlunoService {

  //roteiro SaaS
  alunos: Aluno[] = [];
  gravar(aluno: Aluno): void {
    this.alunos.push(aluno);
  }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  criar(aluno: Aluno): Observable<any> {
    return this.http.post<any>(this.taURL + "/aluno", aluno, {headers: this.headers})
             .pipe( 
                retry(2)
              ); 
  }

  atualizar(aluno: Aluno): Observable<any> {
    return this.http.put<any>(this.taURL + "/aluno",JSON.stringify(aluno), {headers: this.headers})
              .pipe(
                retry(2)
              );
  }

  remover(cpf: string): Observable<any> {
    const url = this.taURL + "/aluno/" + encodeURIComponent(cpf);
    return this.http.delete<any>(url, {headers: this.headers})
               .pipe(retry(2));
  }

  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.taURL + "/alunos")
              .pipe(
                 retry(2)
               );
  }

}
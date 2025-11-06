import express = require('express');
import bodyParser = require("body-parser");

import {Aluno} from '../common/aluno';
import {CadastroDeAlunos} from './cadastrodealunos';

var taserver = express();

var cadastro: CadastroDeAlunos = new CadastroDeAlunos();

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
taserver.use(allowCrossDomain);

// simple logger to show incoming requests in the server console
taserver.use(function(req: any, res: any, next: any) {
  //console.log("[ta-server] ", new Date().toISOString(), req.method, req.url, Object.keys(req.body || {}).length ? 'body=' + JSON.stringify(req.body) : '');
  next();
});

taserver.use(bodyParser.json());

taserver.get('/alunos', function (req: express.Request, res: express.Response) {
  res.send(JSON.stringify(cadastro.getAlunos()));
})

// root route: serve a tiny HTML page that polls /alunos and shows updates
taserver.get('/', function(req: express.Request, res: express.Response) {
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>TA Server - Alunos</title>
    <style>body{font-family:Arial,Helvetica,sans-serif;margin:16px} pre{background:#f6f6f6;padding:12px;border-radius:6px}</style>
  </head>
  <body>
    <h1>TA Server</h1>
    <p>Atualizações automáticas de <code>/alunos</code> (polling a cada 1s)</p>
    <pre id="out">carregando...</pre>
    <script>
      async function fetchAlunos(){
        try{
          const r = await fetch('/alunos');
          const data = await r.json();
          document.getElementById('out').textContent = JSON.stringify(data, null, 2);
        }catch(e){ document.getElementById('out').textContent = 'erro: '+e }
      }
      fetchAlunos();
      setInterval(fetchAlunos, 1000);
    </script>
  </body>
</html>
`);
});

taserver.post('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body; //verificar se é mesmo Aluno!
  // checar duplicatas: CPF e login
  if (!cadastro.cpfNaoCadastrado(aluno.cpf)) {
    res.send({"failure": "cpf"});
    return;
  }
  if (!cadastro.loginNaoCadastrado(aluno.login)) {
    res.send({"failure": "login"});
    return;
  }
  aluno = cadastro.cadastrar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi cadastrado com sucesso"});
  } else {
    res.send({"failure": "unknown"});
  }
})

taserver.put('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body;
  // ao atualizar, a identificação é feita pelo CPF; atualizar falha se o novo login
  // já pertencer a outro aluno
  // check if there is an existing aluno with this cpf
  var existing = cadastro.getAlunos().find(a => a.cpf == aluno.cpf);
  if (!existing) {
    res.send({"failure": "notfound"});
    return;
  }
  if (aluno.login && aluno.login !== existing.login && !cadastro.loginNaoCadastrado(aluno.login)) {
    res.send({"failure": "login"});
    return;
  }
  aluno = cadastro.atualizar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi atualizado com sucesso"});
  } else {
    res.send({"failure": "unknown"});
  }
})

// remover aluno por CPF
taserver.delete('/aluno/:cpf', function (req: express.Request, res: express.Response) {
  var cpf: string = req.params.cpf;
  // se cpf não existir, retorna notfound
  if (cadastro.cpfNaoCadastrado(cpf)) {
    res.send({"failure": "notfound"});
    return;
  }
  var ok = cadastro.remover(cpf);
  if (ok) {
    res.send({"success": "O aluno foi removido com sucesso"});
  } else {
    res.send({"failure": "notfound"});
  }
})

var server = taserver.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function closeServer(): void {
  server.close();
}

export { server, closeServer }
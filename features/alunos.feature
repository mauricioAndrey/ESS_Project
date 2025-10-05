Feature: Alunos
  Description: Listagem de informações sobre o desempenho dos alunos em diferentes disciplinas, incluindo código de cores (vermelho, amarelo, verde) para destacar desempenho.

  Scenario: Visualizar lista de alunos com cores por disciplina
    Given que eu sou um usuário autenticado com permissão de professor
    When eu acesso a página de "Desempenho por Disciplina"
    Then devo ver uma tabela com alunos e colunas de nota por disciplina
    And cada aluno deve apresentar uma cor de status:
      | média >= 7.0       | verde    |
      | 5.0 <= média < 7.0 | amarelo  |
      | média < 5.0        | vermelho |

  Scenario: Filtrar por disciplina e ver somente alunos reprovados
    Given que estou na página de "Desempenho por Disciplina"
    When eu filtro pela disciplina "Cálculo I"
    And eu filtro pelo desempenho "< 5.0"
    Then devo ver apenas alunos cuja nota final esteja < 5.0
    And as linhas desses alunos devem aparecer com cor vermelha

  Scenario: Impedir acesso à listagem de alunos para usuário sem permissão
    Given que sou um usuário autenticado com perfil "Aluno"
    When tento acessar a página "Desempenho por Disciplina"
    Then devo ser redirecionado para uma página de erro de permissão
    And devo ver a mensagem "Acesso negado: apenas professores podem visualizar o desempenho"

  Scenario: Exibir aviso quando houver dados incompletos do aluno
    Given que estou na página de "Desempenho por Disciplina" 
    And sou um usuário com permissão de professor
    And o sistema possui alunos com notas ausentes ou não cadastradas
    When eu visualizo a lista de alunos
    Then devo ver um aviso "Dados incompletos" ao lado do nome do aluno afetado
    And a linha do aluno deve aparecer com cor cinza indicando informação pendente

  Scenario: Exibir legenda de cores de desempenho
    Given que estou na página de "Desempenho por Disciplina"
    When clico no botão "Legenda de Cores"
    Then devo ver um modal com a explicação das cores utilizadas:
      | Cor      | Significado                 |
      | Verde    | Desempenho satisfatório     |
      | Amarelo  | Desempenho de atenção       |
      | Vermelho | Desempenho insatisfatório   |

  Scenario: Exportar listagem do desempenho dos alunos em csv
    Given que sou um usuário com permissão de professor
    And estou na página de Desempenho 
    And está filtrado por disciplina "Engenharia de Software"
    When eu clico no botão de "Exportar em csv"
    And deve aparecer opções para configurar como vai ser disposta a ordem das informações que vão ser exportadas
    Then a lista é baixada como um arquivo .csv no computador do usuário 

  changing things

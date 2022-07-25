# Introdução

**RouterEngine** foi desenvolvido pensando para facilitar o roteamento de páginas dinamicas via JS no lado cliente.
<br/>
Mesma eficiência do _HashRouter_ do _React_, mas no VanillaJS.

> **Desenvolvedor**: Leonardo Valcarenghi
> <br/>
> **Versão**: 1.0 _beta_
> <br/>
> [Site do Desenvolvedor](https://leonardovalcarenghi.com.br)

-----

<br/>
<br/>

# Iniciar

## Instância
Instancie o **RouterEngine** globalmente em seu projeto, de preferência no _main.js_.

````js

    var Router = new RouterEngine();

````

<br/>
<br/>

# Roteamento


## Adicionar Rota
Para adicionar uma rota utilize o método **Add**, informando os seguites argumentos:

````js

    Router.Add('/pagina', (e) => { 
        // Função de callBack, será chamada quando o navegador acessar a rota.
    });

````

Para adicionar uma rota, definindo um título para a página, use:

````js

    Router.Add({hash: '/pagina', title: 'Título da Página'}, (e) => { 
        // Função de callBack, será chamada quando o navegador acessar a rota.
    });

````

Para adicionar uma rota, defindo ela como root:

````js

    Router.Add({root: true, hash: '/pagina'}, (e) => { 
        // Função de callBack, será chamada quando o navegador acessar a rota.
    });

````


<br/>


## Remover Rota
Para remover uma rota, utilize o método **Remove**:

````js

    Router.Remove('/pagina');

````


<br/>


## Definir Root
Para definir o root, utilize o método **SetRoot**:

````js

    Router.SetRoot((e) => {
        // Função de callBack, será chamada quando o navegador acessar o root.
    });

````

Defina o _Root_ para detectar quando o navegador estiver na _index_ do site. 



<br/>


## Obter Rotas
Para obter um _array_ com as rotas adicionadas e configuradas, utilize o método **GetRoutes**:

````js

    const routes = Router.GetRoutes();

````

<br/>


## Iniciar
Para iniciar o roteamento, utilize o método **Start**:

````js

    Router.Start();

````


<br/>


## Parar
Para parar o roteamento, utilize o método **Stop**:

````js

    Router.Stop();

````

<br/>
<br/>

# CallBacks


## Atribuir Callback 
Para atribuir ou modificar um _callBack_ de uma rota, utilize o método **SetListener**:

````js

    Router.SetListener('/pagina', (e) => {  });

````

Para remover o _callBack_:

````js

    Router.SetListener('/pagina', null);

````


<br/>


## Rota Não Mapeada
Para atribuir um _callBack_ identificando quando o usuário acessar uma rota não mapeada, utilize o método **NotFound**:

````js

    Router.NotFound((e) => { 
        console.error('Error 404', e);
    });

````

<br/>


## Rota Navegada
Para atribuir um _callBack_ identificando quando o usuário acessar uma rota, utilize o método **OnChange**:

````js

    Router.OnChange((route) => { 
        console.log('Rota', route);
    });

````

Como argumento do _callBack_ você recebe informações da rota navegada.

> ⚠ Quando a rota navegada for uma não mapeada, esse _callBack_ não será chamado e sim o _callBack_ de **NotFound**.


<br/>
<br/>

# Outros

<br/>

## Navegação
Para navegar entre as rotas, utilize o método **NavigateTo** ou os métodos nativos do JavaScript:

````js

    Router.NavigateTo('/pagina');

    // ou

    window.location.hash = 'pagina';

    // ou

    window.location.href = '/#pagina';

````


<br/>


## Definindo Título
Para definir o título de uma rota, utilize o método **SetTitle**:

````js

    Router.SetTitle('/pagina', 'Título da Página');

````

> ⚠ Utilize esse método somente depois de adicionar uma rota.
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

## Instância
Instancie o **RouterEngine** globalmente em seu projeto, de preferência no _main.js_.

````js

    var Router = new RouterEngine();

````

## Adicionar Rotas
Para adicionar uma rota de rastreio use o método **Add**, informando a URL da rota e uma função de _callBack_.

````js

    Router.Add('/pagina', (e) => {
        // função de callback será chamada quando o navegador acessar a página adicionada para roteamento.
    });


````

## Definindo Root
Quando o usuário acessar a _index_ do site, nenhuma _hash_ está constando na rota.
Para evitar que o usuário fique sem acessar o conteúdo da pagina principal é possível definir um _**root**_ de roteamento.
<br/>
Ele será usado quando não houver _hashs_ na url.

````js

    Router.SetRoot('/pagina', (e) => {
        // função de callback será chamada quando o navegador carregar a hash #inicio ou a index do site.
    });

````

>  Não utilize no **SetRoot** apenas uma "/", isso pode confundir o módulo.
 

## Definindo Título
Você pode usar o método  **SetTitle** para definir um título de página para uma rota.

````js

    Router.SetTitle('/sobre', 'Página Sobre');

````

> Defini um título somente depois de adicionar uma rota!

## Iniciar Roteamento
Use o método  **Start** após configurar as rotas para iniciar o serviço de roteamento em seu site.

````js

    Router.Start();

````

## Navegação
Após iniciar o roteamento, você pode navegar entre páginas usando o método **NavigateTo**, passando a _hash_ da rota.

````js

    Router.NavigateTo('/sobre');

    // ou

    window.location.hash = 'sobre';

    // ou

    window.location.href = '/#sobre';

````

## Rota não Encontrada
Caso o usuário acesse ou seja redirecionado para uma rota não mapeada, você pode captar isso através do método **NotFound**.

````js

    Router.NotFound((e) => {
        console.error('Erro 404');
    });

````

## Definir Callback
Caso você tenha adicionado uma rota ao roteamento sem callback ou quer modificar um callback atribuido em uma rota, use o método **SetListener**. 

No primeiro parâmetro, passe a rota e no segundo parâmetro a função de _callback_.
````js

    Router.SetListener('/inicio', (e) => {

    });

````


## Importar Rotas do Arquivo
Caso seja necessário, você pode importar um arquivo _JSON_ contendo uma _array_ com todas as rotas de seu site já configuradas e definidas.

**LEMBRE-SE**: esse método é assincrono, não esqueça de usar o operador _await_.

````js

    var Router = new RouterEngine();
    window.onload = async function () {
        await Router.LoadRoutesFromFile('/configs/pages.json');
    }

````

**PADRÃO DO JSON**

````JSON

    [
        {
            "root": true,           // define que a rota "/inicio" é a principal (root).
            "route": "/inicio",     // rota
            "title": "Início"       // texto para atribuir como título da página no navegador.
        },
        {
            "route": "/sobre",
            "title": "Sobre",
        }
    ]

````

## Rota Navegada
Sempre que o usuário acessar uma rota mapeada, indiferente da rota, você vai receber um _callBack_ contendo informações da rota.

````js

    Router.OnChange((e) => {
        console.log('Rota Navegada:', e);
    });

````

## EventListener
É possível detectar quando uma rota foi alterada e processada pelo roteamento, basta definir:

````js

    window.addEventListener('routerChange', function (e) {
        const details = e.detail;
        console.log('detalhes', details);
    })

````

Dentro de **detail** você tem as informações da rota acessada e um _object_ com todos os parâmetros recebidos pela URL.
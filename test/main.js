
var Router = new RouterEngine();

window.onload = async function () {

    const container = document.getElementById("root");

    // -------------------------------------------------------------------------------------------------------------------
    // ADICIONAR PÁGINAS //

    Router.Add('/pagina-1');

    Router.Add('/pagina-2', (e) => {
        container.innerHTML = '<h2>Página 2</h2>';
    });

    Router.Add({
        hash: '/pagina-3',
        title: 'Página 3'
    },
        (e) => {
            container.innerHTML = '<h2>Página 3</h2>';
        }
    );

    Router.Add({
        hash: '/pagina-4', title: 'Página 4', callBack: (e) => {
            container.innerHTML = '<h2>Página 4</h2>';
        }
    });



    // -------------------------------------------------------------------------------------------------------------------
    // DEFININDO ROOT //

    Router.SetRoot((e) => {
        container.innerHTML = '<h2>Root</h2>';
    });

    Router.Add({
        root: false,
        hash: '/pagina-5',
        title: 'Página 5'
    });


    
    // -------------------------------------------------------------------------------------------------------------------
    // ATRIBUINDO/MODIFICANDO CALLBACKS DAS ROTAS  //

    Router.SetListener('/pagina-1', (e) => {
        container.innerHTML = '<h2>Página 1 - SetListener</h2>';
    })



    // -------------------------------------------------------------------------------------------------------------------
    // ATRIBUINDO TÍTULO DAS PÁGINAS PARA AS ROTAS //

    Router.SetTitle('/pagina-1', 'Página 1');



    // -------------------------------------------------------------------------------------------------------------------
    // CALLBACK DE ROTA NÃO MAPEADA //   

    Router.NotFound(() => {
        console.error('Rota não mapeada.');
    });



    // -------------------------------------------------------------------------------------------------------------------
    // CALLBACK DE ROTA ALTERADA //

    Router.OnChange((e) => {
        console.log('Rota Acessada', e);
    });



    // -------------------------------------------------------------------------------------------------------------------
    // OBTER LISTA DE ROTAS CONFIGURADAS //
    const routes = Router.GetRoutes();
    console.log('ROTAS', routes);



    // -------------------------------------------------------------------------------------------------------------------
    // INICIAR ROTEAMENTO //
    Router.Start();



    // -------------------------------------------------------------------------------------------------------------------
    // PARAR ROTEAMENTO //
    // Router.Stop();


}


function changeCallback() {
    Router.SetListener('/sobre', e => {
        console.log('callback modificado.')
    })
}

window.addEventListener('routerChange', function (e) {
    const details = e.detail;
    if (typeof InitializePage === 'function') { InitializePage(details); }
})
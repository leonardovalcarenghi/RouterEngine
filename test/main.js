
var Router = new RouterEngine();

window.onload = async function () {

    const container = document.getElementById("root");

    Router.SetRoot((e) => {
        console.log('Página Inicial');
        container.innerHTML = '<h1>Página Inicial - root</h1>';
    });


    // Router.Add('/', (e) => {
    //     console.log('/');
    //     container.innerHTML = '<h1>/</h1>';
    // });

    Router.Add('/sobre', (e) => {
        console.log('Sobre');
        container.innerHTML = '<h1>Sobre</h1>';
    });

    Router.Add({
        hash: 'teste',
        title: 'Página de Teste'
    }, (e) => {
        console.log('teste');
        container.innerHTML = '<h1>Página de teste</h1>';
    })

    Router.NotFound(function (e) {
        console.error('Página não foi encontrada.');
        container.innerHTML = '<h4>Página não encontrada</h4>';
    });

    Router.OnChange(function (e) {
        container.innerHTML = '';
        console.log('OnChange', e);
    });

    Router.SetTitle('/sobre', 'Sobre o Teste');


    const routes = Router.GetRoutes();
    console.log('ROTAS', routes);

    Router.Start();

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
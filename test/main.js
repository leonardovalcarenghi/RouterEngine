
var Router = new RouterEngine();

window.onload = async function () {


    const container = document.getElementById("root");


    Router.SetRoot('/inicio', async function (e) {
        console.log('Página Inicial');
        container.innerHTML = '<h1>Página Inicial - root</h1>';
    });

    Router.Add('/sobre', function (e) {
        console.log('Sobre');
        container.innerHTML = '<h1>Sobre</h1>';
    });

    Router.NotFound(function (e) {
        console.error('erro 404');
    })

    Router.Start();

}

window.addEventListener('routerChange', function (e) {
    const details = e.detail;
    if (typeof InitializePage === 'function') { InitializePage(details); }
})
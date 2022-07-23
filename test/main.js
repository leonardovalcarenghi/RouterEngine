
var Router = new RouterEngine();

window.onload = async function () {

    Router.SetRoot('/inicio', async function (e) {
        console.log('Página Inicial');
        Router.SetTitle('Página Inicial');
    });

    Router.Add('/sobre', function (e) {
        console.log('Sobre');
        Router.SetTitle('Sobre');
    });

    Router.StartTrigger();

}

window.addEventListener('routerChange', function (e) {
    const details = e.detail;
    if (typeof InitializePage === 'function') { InitializePage(details); }
})
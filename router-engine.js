(function (global, factory) {
    global.RouterEngine = factory();
}(this, (function () {

    var Routes = [
        {
            route: '',
            callBack: null,
            root: false
        }
    ];

    var Root;

    var Render;

    var NotFoundCallback;

    var OnChangeCallback;

    function RouterEngine() {

        return this;
    }

    // Adicionar Rota:
    RouterEngine.prototype.Add = function (route, callBack) {
        route = this._trimSlashes(route);
        if (!route) { throw '[Add] Não é possível adicionar uma rota vázia.' }
        Routes.push({ route, callBack });
    };

    // Definir Root:
    RouterEngine.prototype.SetRoot = function (route, callBack) {
        route = this._trimSlashes(route);
        if (!route) { throw '[SetRoot] Não é possível adicionar uma rota vázia como root.' }
        Root = route;
        this.Add(route, callBack);
    };

    // Definir ouvinte para uma rota específica:
    RouterEngine.prototype.SetListener = function (hash, callBack) {
        hash = this._trimSlashes(hash);
        const route = this._getRoute(hash);
        if (!route) { throw '[SetListener] Não foi encontrado nenhuma rota definida para essa hash.' }
        route.callBack = callBack;
    }

    // Definir título da página:
    RouterEngine.prototype.SetTitle = function (hash, title) {
        hash = this._trimSlashes(hash);
        const route = Routes.find(ROUTE => ROUTE.route == hash);
        if (!route) { throw '[SetTitle] Não foi encontrado nenhuma rota definida para essa hash.' }
        route.title = title || '';
    };

    // Navegar para uma página (hash) específica:
    RouterEngine.prototype.NavigateTo = function (path) {
        path = this._trimSlashes(path);
        window.location.hash = path;
    };

    // Definir RenderEngine:
    RouterEngine.prototype.SetRenderEngine = function (object) {
        Render = object
    };

    // Definir callback de 'onChange':
    RouterEngine.prototype.OnChange = function (callback) {
        OnChangeCallback = typeof callback === 'function' ? callback : null;
    };

    // Definir Callback para erro 404:
    RouterEngine.prototype.NotFound = function (callback) {
        NotFoundCallback = typeof callback === 'function' ? callback : null;
    };

    // Iniciar escuta de hash:
    RouterEngine.prototype.Start = async function () {
        const _this = this;

        // Primeira Hash ou Root:
        const firstHash = this._getHash();
        if (firstHash) {

            const route = _this._getRoute(firstHash);
            if (route) {
                await this._renderPage(firstHash);
                this._setTitle(firstHash);
                this._callCallback(firstHash);
                this._callEventListener(firstHash);
            } else {
                if (NotFoundCallback) { NotFoundCallback(); }
            }


        } else {


            if (Root) {
                await this._renderPage(Root);
                this._setTitle(Root);
                this._callCallback(Root);
                this._callEventListener(Root);
            } else {
                console.warn("Você não definiu uma rota de root no mapeamento.")
            }

        }

        // Iniciar Trigger:
        window.onhashchange = async function () {

            const hash = _this._getHash();
            if (hash) {

                const route = _this._getRoute(hash);
                if (route) {
                    await _this._renderPage(hash);
                    _this._setTitle(hash);
                    _this._callCallback(hash);
                    _this._callEventListener(hash);
                } else {

                    if (NotFoundCallback) { NotFoundCallback(); }

                }


            } else {
                await _this._renderPage(Root);
                _this._setTitle(Root);
                _this._callCallback(Root);
                _this._callEventListener(Root);
            }



        }

        return this;
    };

    // Carregar rotas de um arquivo JSON:
    RouterEngine.prototype.LoadRoutesFromFile = async function (url) {
        const file = await this._get(url);
        try {
            const routesFromfile = JSON.parse(file);
            if (Array.isArray(routesFromfile)) {

                routesFromfile.forEach(R => {
                    R.route = this._trimSlashes(R.route);
                })
                Routes = routesFromfile;

                const root = Routes.find(r => r.root == true);
                Root = root.route || null;

            } else {
                throw 'Arquivo JSON não contém uma Array de rotas válida.';
            }
        }
        catch (error) {
            throw error;
        }
    };

    // ------------------------------------------------------------------------------------------------------------------ //


    // Obter hash atual:
    RouterEngine.prototype._getHash = function () {
        const hash = window.location.hash.substr(1).replace(/(\?.*)$/, "");
        return this._trimSlashes(hash);
    };

    // Obter rota:
    RouterEngine.prototype._getRoute = function (hash) {
        const route = Routes.find(ROUTE => ROUTE.route == hash);
        return route || null;
    };


    // Renderizar página com 
    RouterEngine.prototype._renderPage = async function (hash) {
        const route = this._getRoute(hash);
        if (Render) { await Render.Page(route.path); }
    };



    // Chamar evento de callback definida para a rota:
    RouterEngine.prototype._callCallback = function (hash) {
        hash = this._trimSlashes(hash);
        const route = Routes.find(ROUTE => ROUTE.route == hash);
        if (route) {
            if (typeof route.callBack === 'function') { route.callBack(); }
        }
    };

    // Chamar evento de escuta definido pelo desenvolvedor:
    RouterEngine.prototype._callEventListener = function (hash) {

        const route = Routes.find(ROUTE => ROUTE.route == hash);
        const parameters = this._getUrlParams();
        const details = { route, hash, parameters };


        // OnChange:
        if (OnChangeCallback) { OnChangeCallback(details); }

        // Event Listener:
        const event = new CustomEvent('routerChange', { detail: details });
        window.dispatchEvent(event);

        // OnEvent:
        if (typeof window['onRouterChange'] === 'function') { window.onRouterChange(details); }

    };

    // Obter parâmetros recebidos pela URL:
    RouterEngine.prototype._getUrlParams = function () {
        let href = window.location.href;
        let index = href.indexOf('?');
        if (index == -1) { return null; }
        href = href.substr(index + 1, href.length);
        let parameters = href.split('&');
        var params = {};
        parameters.forEach(P => {
            const key = P.split('=')[0];
            const value = P.split('=')[1];
            params[key] = value;
        });
        return params;
    }

    // Definir título da página pela rota (se disponível):
    RouterEngine.prototype._setTitle = function (hash) {
        hash = this._trimSlashes(hash);
        const route = Routes.find(ROUTE => ROUTE.route == hash);
        if (route) {
            const title = route.title;
            document.getElementsByTagName('title')[0].innerHTML = title || '';
        }
    };

    // Trim slashes for path
    RouterEngine.prototype._trimSlashes = function (path) {
        if (typeof path !== "string") { return ""; }
        return path.toString().replace(/\/$/, "").replace(/^\//, "");
    };

    // Requisição GET:
    RouterEngine.prototype._get = function (url) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.send(null);
            req.onload = () => {
                if (req.status == 404) {
                    reject(null);
                } else {
                    resolve(req.responseText);
                }
            }
            req.onerror = () => { reject(null); }
        });
    };

    return RouterEngine;

})));
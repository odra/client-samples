const { KubeConfig, Client } = require('kubernetes-client');
const Request = require('kubernetes-client/backends/request');


function k() {
    const kubeconfig = new KubeConfig();
    kubeconfig.loadFromDefault();

    const backend = new Request({ kubeconfig });
    backend.requestOptions.strictSSL = false;

    const kubeclient = new Client({ backend, version: '1.13' });

    return kubeclient;
}


let kube = k();

async function create() {
    const body = require('./dc.json')
    const create = await kube.apis.apps.v1.namespaces('default').deployments.post({ body: body });
    console.log(create);
}

async function getOne() {
    const body = require('./dc.json')
    const res = await kube.apis.apps.v1.namespaces('default').deployments(body.metadata.name).get();
    console.log(res);
}

async function getAll() {
    const body = require('./dc.json')
    const res = await kube.apis.apps.v1.namespaces('default').deployments.get();
    console.log(res.body.items);
}

async function getFiltered() {
    const body = require('./dc.json')
    const query = {
        qs: {
            labelSelector: 'app=nginx'
        }
    }
    const res = await kube.apis.apps.v1.namespaces('default').deployments.get(query);
    console.log(res.body.items);
}


async function remove() {
    const body = require('./dc.json')
    const res = await kube.apis.apps.v1.namespaces('default').deployments(body.metadata.name).delete();
    console.log(res);
}

remove();
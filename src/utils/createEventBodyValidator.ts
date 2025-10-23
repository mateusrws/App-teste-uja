import Event from "../types/typeEnvent";


export function createBodyValidation(body: Event){
    if (!body.title ||!body.date ||!body.hour ||body.points === undefined ||!body.address ||!body.city || !body.preco) {
        return "Campos obrigatórios não foram preenchidos!";
    }

    if(typeof(body.title) !== "string" || typeof(body.date) !== "string" || isNaN(Date.parse(body.date)) || typeof(body.hour) !== "string" || typeof(body.points) === "number" || typeof(body.address) !== "string" || typeof(body.city) !== "string" || typeof(body.preco) !== "number"){
        return "Os campos estão com seus tipos diferentes do esperado ex: preco == 'Bom dia'"
    }

    return true;
}
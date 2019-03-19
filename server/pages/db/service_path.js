export default function(req){
    return {
        find:`http://${req.headers.host}/service/find`,
        findOne:`http://${req.headers.host}/service/findOn`,
        content_hit:`http://${req.headers.host}/service/content_hit`
    }
}
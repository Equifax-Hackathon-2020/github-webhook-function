/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'equifax-hackathon-2020';
const COLLECTION_NAME = 'microservice-data';
const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true,
});

exports.helloWorld = (req, res) => {
    let message = req.query.message || req.body.message || 'No data!';
    
    const created = new Date().getTime();
    var myJsonObject = JSON.parse(message);
    myJsonObject.created = created;

    return firestore.collection(COLLECTION_NAME)
        .add(myJsonObject)
        .then(doc => {
            console.log(doc);
        }).catch(err => {
            console.error(err);
        });
};

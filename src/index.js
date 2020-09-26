/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const Firestore = require('@google-cloud/firestore');
const crypto = require('crypto')

const PROJECTID = 'equifax-hackathon-2020';
const COLLECTION_NAME = 'microservice-data';
const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true,
});
const secret = CHANGE_ME;

exports.helloWorld = (req, res) => {
    verifyPostData(req, res);
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

function verifyPostData(req, res, next) {
  const payload = JSON.stringify(req.body)
  if (!payload) {
    return next('Request body empty')
  }

  const sig = req.get(sigHeaderName) || ''
  const hmac = crypto.createHmac('sha1', secret)
  const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
  const checksum = Buffer.from(sig, 'utf8')
  if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
    //return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`)
    return false;
  }
  return true;
}

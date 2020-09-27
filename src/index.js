/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 * 
 * Trigger URL - https://us-central1-equifax-hackathon-2020.cloudfunctions.net/github-webhook-function
 */
const Firestore = require('@google-cloud/firestore')
const crypto = require('crypto')

const PROJECTID = 'equifax-hackathon-2020'
const COLLECTION_NAME = 'function-test-data'
const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
})
const secret = '59547cac21757ca62d28dc60ccf3c0748a1427de';
const sigHeaderName = 'x-hub-signature'

exports.helloWorld = (req, res) => {
  const message = JSON.stringify(req.body) || 'No data!'

  if (verifyPostData(req)) {
    var myJsonObject = JSON.parse(message)
    const created = new Date().getTime()
    myJsonObject.created = created

    return firestore.collection(COLLECTION_NAME)
      .add(myJsonObject)
      .then(doc => {
        console.log(doc)
      }).catch(err => {
        console.error(err)
      })
    
      res.status(200).send('success')
  } else {
      res.status(400).send('fail')
  }
}

function verifyPostData(request) {
  const payload = JSON.stringify(request.body)
  if (!payload) {
    console.log('Request body empty')
    return false
  }

  const sig = request.get(sigHeaderName) || ''
  const hmac = crypto.createHmac('sha1', secret)
  const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
  const checksum = Buffer.from(sig, 'utf8')
  if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
    console.log('Request body digest ', digest, ' did not match ', sigHeaderName, ' ', checksum)
    return false
  }
  return true
}
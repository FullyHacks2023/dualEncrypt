const express = require('express');

const router = express.Router();
const EncryptData = require('../dbModels/data');
const validationError = require('../helpers/validateDataReq');
const AES256 = require('../helpers/aes256');

router.get('/mydata', async (req, res) => {
    try {
        const dataDetails = await EncryptData.getAllHeaderId(req.session.userid);
        // console.log(dataDetails);
        res.send({ data: dataDetails, success: 1 });
    } catch (err) {
        console.log('error', err);
        res.send({ errorMsg: err.message });
    }
});

router.get('/mydata/:id', async (req, res) => {
    const { id } = req.params;
    const validationerror = validationError.isNumber(id);
    if (!validationerror) {
        res.status(406).send(validationerror);
    } else {
        const dataDetails = await EncryptData.findDataById(id, req.session.userid);
        if (dataDetails.encryptdata) {
            dataDetails.encryptdata = AES256.decryptData(dataDetails.encryptdata);
            dataDetails.hint = dataDetails.hint ? AES256.decryptData(dataDetails.hint) : '';
        }
        res.send({ data: { ...dataDetails }, success: 1 });
    }
});

// save data in db
router.post('/mydata', async (req, res) => {
    try {
        const validationerror = validationError.newData(req.body);
        if (validationerror) {
            res.status(406).send(validationerror);
        } else {
            const backendEnc = AES256.encryptData(req.body.encryptdata);
            const hint = req.body.hint ? AES256.encryptData(req.body.hint) : '';
            const dataDB = {
                heading: req.body.heading,
                encryptdata: backendEnc,
                userid: req.session.userid,
                hint
            };
            const dataDetails = await EncryptData.createData(dataDB);
            res.send(dataDetails);
        }
    } catch (err) {
        console.log('error', err);
        res.send({ errorMsg: err.message });
    }
});

router.put('/mydata', async (req, res) => {
    try {
        const validationerror = validationError.updateData(req.body, req.session.userid);
        if (validationerror) {
            res.status(406).send(validationerror);
        } else {
            const backendEnc = AES256.encryptData(req.body.encryptdata);
            const hint = req.body.hint ? AES256.encryptData(req.body.hint) : '';
            const dataDB = {
                id: req.body.id,
                heading: req.body.heading,
                encryptdata: backendEnc,
                hint
            };
            const dataDetails = await EncryptData.updateData(dataDB);
            res.send(dataDetails);
        }
    } catch (err) {
        console.log('error', err);
        res.send({ errorMsg: err.message });
    }
});
router.delete('/mydata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validationerror = validationError.isNumber(id);
        if (!validationerror) {
            res.status(406).send(validationerror);
        } else {
            const deleteStatus = await EncryptData.deleteDataById(id, req.session.userid);
            res.send({ deleteStatus });
        }
    } catch (err) {
        console.log('error', err);
        res.send({ errorMsg: err.message });
    }
});

module.exports = router;

const contactModel = require('../models/Contact')
const formResponse = require('../helpers/formResponse')
const userController={
    getContact: (req, res) =>{
        if(req.query.phone != null || req.query.name != null){
            contactModel.searchContacts(req).then((result)=>{
                formResponse(result, res)
            }).catch((err)=>{
                formResponse(err, res)
            })
        }else if(req.query.id_contact != null){
            contactModel.getContactByIdContact(req).then((result)=>{
                formResponse(result, res)
            }).catch((err)=>{
                formResponse(err, res)
            })
        }else{
            contactModel.getAllContacts(req).then((result) => {
                formResponse(result, res)
            }).catch((err)=> {
                formResponse(err, res)
            })
        }
    },
    getContactByName : (req, res) =>{
        if(req.query.name != undefined || req.query.name != null){
            contactModel.getContactByName(req).then((result)=>{
                formResponse(result, res)
            }).catch((err=>{
                formResponse(err, res)
            }))
        }else if(req.query.id_contact != undefined || req.query.id_contact != null){
            contactModel.getContactByIdContact(req).then((result)=>{
                formResponse(result, res)
            }).catch((err=>{
                formResponse(err, res)
            }))
        }
    },
    addContact : (req, res) =>{
        contactModel.addContact(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err, res)
        })
    },
    updateContact : (req, res) =>{
        contactModel.updateContact(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err, res)
        })
    }
}

module.exports = userController
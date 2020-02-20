const sgMail = require('@sendgrid/mail');



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SendWelcome =(email,name)=>{
    sgMail.send({
        to :email,
        from :'melsopv@gmail.com',
        subject :'Welcome on board Fam',
        text:`Hi ${name} We hope that you enjoy this fake expirence ^_^`
    })
}

const SendGoodBy =(email,name)=>{
    sgMail.send({
        to :email,
        from :'melsopv@gmail.com',
        subject :'GoodBy Fam',
        text:`Yow ${name} We hope that you enjoyed your none existing time with us we gonna miss you on board ^_^`
    })
}
module.exports ={
    SendWelcome,SendGoodBy
}
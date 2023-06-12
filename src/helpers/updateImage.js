const fs = require('fs');

const User = require('../models/userModel');
const Event = require('../models/eventModel');

const updateImages = (options) => {
    const { type, id, fileName } = options;

    try{
        const action = {
            user: async () => {
                const user = await User.findById(id);
                if(!user) {
                    return false;
                }
    
                _replacePrevPath({
                    type, 
                    image: user.image
                });
    
                user.image = fileName;
                await user.save();
                return true;
            },
            events: async () => {
                const event = await Event.findById(id);           
                if(!event) {
                    return false;
                }
    
                _replacePrevPath({
                    type, 
                    image: event.image
                });
    
                event.showInfo.image = fileName;
                await event.save();
                return true;
            },
            tickets: () => {}
        };        
        action[type]();
    } catch(err) {
        console.log(err)
    }
};

const _replacePrevPath = (imageData = {}) => {
    const { type = '', image = ''} = imageData;
    const prevPath = `.src/uploads/${ type }/${ image }`;
    if (fs.existsSync(prevPath)) {
        // remove previous image
        fs.unlinkSync(prevPath);
    }
};

module.exports = {
    updateImages
};
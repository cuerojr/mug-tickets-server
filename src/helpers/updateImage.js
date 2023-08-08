const fs = require('fs');

const User = require('../models/userModel');
const Event = require('../models/eventModel');

/**
 * Function to update the image path for a user or event based on the given options.
 * @param {Object} options - Options object containing 'type', 'id', and 'fileName'.
 */
const updateImages = (options = {}) => {
    const { type, id, fileName } = options;
    try{
        // Define actions based on the 'type' (user, events, tickets)
        const action = {
            user: async () => {
                // Find the user by ID
                const user = await User.findById(id);
                if(!user) {
                    return false;
                }
    
                // Replace the previous image path for the user
                _replacePrevPath({
                    type, 
                    image: user.image
                });
    
                // Update the user's image with the new file name and save changes
                user.image = fileName;
                await user.save();
                return true;
            },
            events: async () => {
                // Find the event by ID
                const event = await Event.findById(id);           
                if(!event) {
                    return false;
                }
    
                // Replace the previous image path for the event
                _replacePrevPath({
                    type, 
                    image: event.image
                });
    
                // Update the event's image with the new file name and save changes
                event.image = fileName;
                await event.save();
                return true;
            },
            tickets: () => {
                // Tickets functionality can be added here if required in the future
            }
        };        
        action[type]();
    } catch(err) {
        console.log(err)
    }
};

/**
 * Function to replace the previous image path with the new image path for a user or event.
 * @param {Object} imageData - Image data object containing 'type' and 'image' (file name).
 */
const _replacePrevPath = (imageData = {}) => {
    const { type = '', image = ''} = imageData;
    const prevPath = `public/uploads/${ type }/${ fileName }`;

    if (fs.existsSync(prevPath)) {
        // remove previous image
        fs.unlinkSync(prevPath);
    }
};

module.exports = {
    updateImages
};
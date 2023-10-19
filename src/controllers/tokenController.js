import { response } from 'express';
import { Token } from '../models/tokenModel.js';
import { Event } from '../models/eventModel.js';
import { ticketNumber, flattenArray } from '../helpers/dataFormatter.js';
import { sendMails } from '../services/nodemailer.js';

import QRCode from 'qrcode';
import { TicketType } from '../models/ticketTypeModel.js';

/**
 * Controller class for handling token-related operations.
 */
class TokenController {    
    constructor() { }

    /**
     * Get all tokens from the database and populate their associated events.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of tokens or an error message.
     */
    async getAll(req, res = response) {
      try {
        const tokens = await Token.find({});
        console.log('tokens', tokens)
        res.status(200).json({
          ok: true,
          tokens
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Filter tokens based on the provided query parameters.
     *
     * @param {Object} req - Express request object containing query parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of filtered tokens or an error message.
     */
    async filter(req, res = response) {
      try {
        
        const tokens = await Token.find(req.query);
        
        if (tokens.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No tickets matched your search'
            });
        } 

        res.status(200).json({
          ok: true,
          tokens
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Create new tokens with the provided data.
     *
     * @param {Object} req - Express request object containing the ticket data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the newly created ticket details or an error message.
     */
    async create(req, res = response) {
      try {
        const { token, eventId } = req.body;      
        
        if (!eventId) {
          return res.status(404).json({ 
            ok: false, 
            error: `Missing event Id.` 
          });
        }
        
        const event = await Event.findById(eventId);

        if (!event) {
          return res.status(404).json({ 
            ok: false, 
            error: `Missing event Id.` 
          });
        }

        const newToken = new Token({ 
          token, 
          eventId
        });
        
        const savedNewToken = await newToken.save();
        
        res.status(200).json({
          ok: true,
          savedNewToken
        });
      } catch (err) {
        res.status(500).json({
          ok: false,
          error: err.message
        });
      }
    }
    /**
     * Get a ticket by its ID and populate its associated event.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the ticket details or an error message if not found.
     */
    async get(req, res = response) {
      const { id } = req.params;

      try {
        const token = await Token.findById(id);

        if (!token) {
          return res.status(404).json({ 
            ok: false, 
            error: `Token with id ${id} not found.` 
          });
        }
        
        res.status(200).json({
          ok: true,
          token
        });

      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Delete a ticket by its ID.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure of the delete operation.
     */
    async delete(req, res = response) {
      const { id } = req.params;

      try {
        await Token.findByIdAndRemove(id, { new: true });

        res.status(200).json({
          ok: true,
          message: `Tokent with id ${ id } was deleted.`
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

}

export {
  TokenController
};
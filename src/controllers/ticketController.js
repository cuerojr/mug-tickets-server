import { response } from 'express';
import { Ticket } from '../models/ticketModel.js';
import { User } from '../models/userModel.js';
import { Event } from '../models/eventModel.js';
import { ticketNumber, flattenArray } from '../helpers/dataFormatter.js';
import { sendMails } from '../services/nodemailer.js';

import QRCode from 'qrcode';
import { TicketType } from '../models/ticketTypeModel.js';

/**
 * Controller class for handling ticket-related operations.
 */
class TicketController {    
    constructor() {
      
    }

    /**
     * Get all tickets from the database and populate their associated events.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of tickets or an error message.
     */
    async getAll(req, res = response) {
      try {
        const tickets = await Ticket.find({}).populate('event', {
            eventId: 1,
            eventType: 1, 
            ticketPurchaseDeadline: 1, 
            hasLimitedPlaces: 1, 
            title: 1,
            address: 1,
            date: 1
        });

        res.status(200).json({
          ok: true,
          tickets
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Filter tickets based on the provided query parameters.
     *
     * @param {Object} req - Express request object containing query parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of filtered tickets or an error message.
     */
    async filter(req, res = response) {
      try {
        
        const tickets = await Ticket.find(req.query).populate('event', {
          eventId: 1,
          eventType: 1, 
          ticketPurchaseDeadline: 1, 
          hasLimitedPlaces: 1, 
          title: 1,
          address: 1,
          date: 1
        });
        
        if (tickets.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No tickets matched your search'
            });
        } 

        tickets.forEach((item) => {
          item.ticketNumber = ticketNumber(item.ticketNumber);
        });

        res.status(200).json({
          ok: true,
          tickets
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
   * Create new tickets with the provided data.
   *
   * @param {Object} req - Express request object containing the ticket data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the newly created ticket details or an error message.
   */
  async create(req, res = response) {
    try {
      const ticketsData = req.body.tickets;      
      const eventsIds = ticketsData.map(ticket => ticket.event);
      let purchasersIds = ticketsData.map(ticket => ticket.purchaser?.purchaserId);
      
      // create Anonimous User 
      if(!!purchasersIds) {
        const { purchaserFirstName, purchaserLastName, purchaserDni, purchaserEmail } = ticketsData[0].purchaser;
        const userDB = await User.findOne({ email: purchaserEmail });
        
        let newUser;
        if(!userDB) {
          newUser = new User({
              firstName: purchaserFirstName,
              lastName: purchaserLastName,
              dni: purchaserDni,
              email: purchaserEmail,
              password: '@@@',
          });
          await newUser.save();
          purchasersIds = [ newUser._id.toString() ];
        } else {
          purchasersIds = [ userDB._id.toString() ];
        }
      }
      
      const [purchaseEvents, users] = await Promise.all([
        Event.find({ _id: { $in: eventsIds } }),
        User.find({ _id: { $in: purchasersIds } })
      ]);

      const insertData = ticketsData.map((ticket, index) => {
        const purchaseEvent = purchaseEvents.find(event => event._id.toString() === ticket.event);
        const user = users.find(user => user._id.toString() === ticket.purchaser?.purchaserId) || users[0];
        
        if (purchaseEvent?.hasLimitedPlaces && purchaseEvent?.ticketsAvailableOnline <= purchaseEvent?.purchasedTicketsList?.length) {
          return {
            error: {
              message: 'Sold out!',
              ticketIndex: index
            }
          };
        }

        const ticketNumber = purchaseEvent?.purchasedTicketsList?.length + (index + 1);
        const newTicket = new Ticket({
          event: ticket.event,
          purchaser: {
            purchaserFirstName: ticket.purchaser.purchaserFirstName,
            purchaserLastName: ticket.purchaser.purchaserLastName,
            purchaserDni: ticket.purchaser.purchaserDni,
            purchaserEmail: ticket.purchaser.purchaserEmail,
            purchaserId: user._id
          },
          attendee: {
            attendeeFirstName: ticket.attendee.attendeeFirstName,
            attendeeLastName: ticket.attendee.attendeeLastName,
            attendeeDni: ticket.attendee.attendeeDni
          },
          validated: ticket.validated,
          purchaseDate: ticket.purchaseDate,
          validationDate: ticket.validationDate,
          ticketNumber
        });        
        return newTicket;
      });

      const savedTickets = await Ticket.insertMany(insertData.filter(ticket => !ticket.error));
      savedTickets.forEach((savedTicket, index) => {
        const ticket = ticketsData[index];
        const user = users.find(user => user._id.toString() === ticket.purchaser.purchaserId) || users[0];
        const purchaseEvent = purchaseEvents.find(event => event._id.toString() === ticket.event);

        user.purchasedTickets.push(savedTicket._id);
        purchaseEvent.ticketsPurchased += 1;
        purchaseEvent.purchasedTicketsList.push(savedTicket._id);
      });

      await Promise.all([
        ...users.map(user => user.save()),
        ...purchaseEvents.map(event => event.save())
      ]);

      
      res.status(200).json({
        ok: true,
        savedTickets
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
        const ticket = await Ticket.findById(id).populate('event', {
            eventId: 1,
            eventType: 1, 
            ticketPurchaseDeadline: 1, 
            hasLimitedPlaces: 1, 
            title: 1,
            address: 1,
            date: 1
        });

        if (!ticket) {
          return res.status(404).json({ 
            ok: false, 
            error: `Ticket with id ${id} not found.` 
          });
        }
        
        const { purchaser, ... params} = ticket.toObject();
        params.ticketNumber = ticketNumber(params.ticketNumber);

        res.status(200).json({
          ok: true,
          ticket: params
        });

      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Update a ticket's information by its ID.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request body and updated data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the updated ticket details or an error message if not found.
     */
    async update(req, res = response) {      
      try {
        const { id } = req.body;
        const {
          event,
          purchaser: {
            purchaserFirstName,
            purchaserLastName,
            purchaserDni,
            purchaserEmail,
            purchaserId
          },
          attendee: {
            attendeeFirstName,
            attendeeLastName,
            attendeeDni
          },
          validated,
          purchaseDate,
          validationDate,
          ticketNumber
        } = req.body;
        
        const ticket = await Ticket.findByIdAndUpdate(id, {
          event,
          purchaser: {
            purchaserFirstName,
            purchaserLastName,
            purchaserDni,
            purchaserEmail,
            purchaserId
          },
          attendee: {
            attendeeFirstName,
            attendeeLastName,
            attendeeDni
          },
          validated,
          purchaseDate,
          validationDate,
          ticketNumber
        }, 
        { 
          new: true 
        });

        res.status(200).json({
          ok: true,
          ticket
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
        await Ticket.findByIdAndRemove(id, { new: true });

        res.status(200).json({
          ok: true,
          message: `Ticket with id ${ id } was deleted.`
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Validate a ticket by its ID.
     *
     * @param {Object} req - Express request object containing the ticket ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure of the delete operation.
     */
    async validate(req, res = response){
      try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
          return res.status(404).json({ 
            ok: false, 
            error: `Ticket with id ${id} not found.` 
          });
        }

        if (ticket.validated) {
          return res.status(404).json({ 
            ok: false, 
            error: `Ticket with id ${id} is already validated.` 
          });
        }
        
        ticket.validated = true;
        ticket.validationDate = new Date();
        await ticket.save();
        
        const { purchaser, ... params} = ticket.toObject();

        res.status(200).json({
          ok: true,
          ticket: params
        });

      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

      /**
   * Create new tickets with the provided data.
   *
   * @param {Object} req - Express request object containing the ticket data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the newly created ticket details or an error message.
   */
  async createTickets(ticketsData = []) {
    try {
      const eventsIds = ticketsData.map(ticket => ticket.event.toString());
      let purchasersIds = ticketsData.map(ticket => ticket.purchaser?.purchaserId);
      const ticketTypeIds = ticketsData.map(ticket => ticket.ticketType._id);

      //validar si hay ticket disponible
      const ticketType = await TicketType.findById(ticketTypeIds[0]);
      /*if(ticketType.ticketsAvailableOnline <= (ticketType.ticketsPurchased + ticketsData.length) ) {
        return 
      }*/

      // create Anonimous User 
      if(!!purchasersIds) {
        const { purchaserFirstName, purchaserLastName, purchaserDni, purchaserEmail } = ticketsData[0].purchaser;
        const userDB = await User.findOne({ email: purchaserEmail });
        
        let newUser;
        if(!userDB) {
          newUser = new User({
              firstName: purchaserFirstName,
              lastName: purchaserLastName,
              dni: purchaserDni,
              email: purchaserEmail,
              password: '@@@',
          });
          await newUser.save();
          purchasersIds = [ newUser._id.toString() ];
        } else {
          purchasersIds = [ userDB._id.toString() ];
        }
      }
      
      const [purchaseEvents, users] = await Promise.all([
        Event.find({ _id: { $in: eventsIds } }),
        User.find({ _id: { $in: purchasersIds } })
      ]);

      const insertData = ticketsData.map((ticket, index) => {
        const purchaseEvent = purchaseEvents.find(event => event._id.toString() === ticket.event.toString());
        const user = users.find(user => user._id.toString() === ticket.purchaser?.purchaserId) || users[0];
        
        //Locations validation
        if (purchaseEvent?.hasLimitedPlaces 
          && purchaseEvent?.ticketsAvailableOnline <= purchaseEvent?.purchasedTicketsList?.length) {
            return {
              error: {
                message: 'Sold out!',
              ticketIndex: index
            }
          };
        }
        
        const ticketNumber = purchaseEvent?.purchasedTicketsList?.length + (index + 1);          
        
        const newTicket = new Ticket({
          event: ticket.event,
          purchaser: {
            purchaserFirstName: ticket.purchaser.purchaserFirstName,
            purchaserLastName: ticket.purchaser.purchaserLastName,
            purchaserDni: ticket.purchaser.purchaserDni,
            purchaserEmail: ticket.purchaser.purchaserEmail,
            purchaserId: user._id
          },
          attendee: {
            attendeeFirstName: ticket.attendee.attendeeFirstName,
            attendeeLastName: ticket.attendee.attendeeLastName,
            attendeeDni: ticket.attendee.attendeeDni
          },
          validated: ticket.validated,
          purchaseDate: ticket.purchaseDate,
          validationDate: ticket.validationDate,
          ticketNumber
        });
        
        this.setQrCode(newTicket._id).then(data => {
          newTicket.qrCode = data;
        }).catch((err) => console.error(err.message));
                
        return newTicket;
      });
      
      const savedTickets = await Ticket.insertMany(flattenArray(insertData).filter(ticket => !ticket.error));
      if (savedTickets.length === 0) {
        return {
          error: {
            message: 'Sold out!'
          }
        };
      }

      savedTickets.forEach((savedTicket, index) => {
        const ticket = ticketsData[index];
        const user = users.find(user => user._id.toString() === ticket.purchaser.purchaserId) || users[0];
        const purchaseEvent = purchaseEvents.find(event => event._id.toString() === ticket.event.toString());

        user.purchasedTickets.push(savedTicket._id);
        purchaseEvent.ticketsPurchased += 1;
        purchaseEvent.purchasedTicketsList.push(savedTicket._id);
        ticketType.ticketsPurchased += 1;
      });

      if(ticketType.ticketsAvailableOnline <= ticketType.ticketsPurchased) {
        ticketType.isActive = false; 
      }

      await Promise.all([
        ...users.map(user => user.save()),
        ...purchaseEvents.map(event => event.save()),
        ticketType.save()
      ]);
      
      //Mailing
      return await sendMails(savedTickets, ticketsData);
    } catch (err) {
      console.error(err.message)
    }
  }

  async setQrCode(ticketId = '') {
    try {
      // Generate the QR code
      return await QRCode.toDataURL(`${ticketId}`);
  
    } catch (err) {
      console.error(err, 'Failed to generate QR code');
    }
  };

}

export {
  TicketController
};
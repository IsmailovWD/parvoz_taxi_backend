const sequelize = require('sequelize');
// const { Room, RoomTable } = require('../models/init-models')

module.exports = (io, socket) => {
    // socket.on('roomCreated', async(data) => {
    //     let time = Math.floor(new Date().getTime() / 1000);
    //     let model;
    //     let room_id;
    //     let {
    //         telegram_id,
    //         room_name,
    //         message
    //     } = data;

    //     const room = await Room.findOne({
    //         where:{
    //             telegram_id: telegram_id
    //         }
    //     })
        
    //     if(!room){
    //         model = await Room.create({
    //             datetime: time,
    //             telegram_id,
    //             room_name
    //         })
    //         room_id = model.id
    //     }else{
    //         room_id = room.id
    //     }

    //     await RoomTable.create({
    //         datetime: time,
    //         room_id: room_id,
    //         message: message,
    //         view: 0
    //     })

    //     if(!room){
    //         io.emit('newRoom', model)
    //     }else{
    //         io.emit('newRoom', room)
    //     }
    // })
}
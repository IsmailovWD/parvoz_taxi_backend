const { CustomLocation } = require('../models/init-models');
const BaseController = require('./BaseController');
const sequelize = require('sequelize')
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class ModelController extends BaseController {
  all = async (req, res) => {
    const model = await CustomLocation.findAll()
    res.send({
      success: true,
      message: 'Custom location all ',
      data: model
    })
  }
  create = async (req, res) => {
    const { nomi, lat, long } = req.body
    const model = await CustomLocation.create({
      name: nomi,
      lat,
      long,
    })
    res.send({
      success: true,
      message: 'Custom location created',
      data: model
    })
  }
  update = async (req, res) => {
    const { id, name, lat, long } = req.body
    const model = await CustomLocation.findOne({
      where: {
        id
      }
    })
    if (name) {
      model.name = name
    }
    model.lat = lat
    model.long = long
    model.save()
    res.send({
      success: true,
      message: 'Custom location updated',
    })
  }
  filter = async (req, res) => {
    const value = req.query.search
    let query = {}
    if(value){
      query = {
        name: {
          [sequelize.Op.substring] : value
        }
      }
    }
    const model = await CustomLocation.findAll({
      where: query
    })
    res.send({
      success: true,
      message: 'Filter custom location',
      data: model,
    })
  }
}

module.exports = new ModelController;
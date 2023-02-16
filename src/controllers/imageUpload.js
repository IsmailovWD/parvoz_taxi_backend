const { DriverInfo } = require('../models/init-models');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const moment = require('moment');

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class imageController extends BaseController {
  imgCreate = async (req, res, next) => {
    let created_info;
    let type = req.query.imgType
    if (!type) {
      res.send({
        success: false,
        message: 'Image not found',
        data: {}
      })
    } else {
      const model = await DriverInfo.findOne({
        where: {
          driver_id: req.currentUser.id,
        }
      })
      console.log(model)
      if (model) {
        if (type == 'car_front') {
          console.log(req.body.file);
          model.img_car_front = req.body.file || null
        }
        if (type == 'car_back') {
          model.img_car_back = req.body.file || null
        }
        if (type == 'car_left') {
          model.img_car_left = req.body.file || null
        }
        if (type == 'car_right') {
          model.img_car_right = req.body.file || null
        }
        if (type == 'tex_passport_front') {
          model.tex_passport_front = req.body.file || null
        }
        if (type == 'tex_passport_back') {
          model.tex_passport_back = req.body.file || null
        }
        if (type == 'talon_front') {
          model.talon_front = req.body.file || null
        }
        if (type == 'talon_back') {
          model.talon_back = req.body.file || null
        }
        await model.save();
      }
      else {
        created_info = await DriverInfo.create({
          driver_id: req.currentUser.id,
          img_car_front: type == 'car_front' ? req.body.file : null,
          img_car_back: type == 'car_back' ? req.body.file : null,
          img_car_left: type == 'car_left' ? req.body.file : null,
          img_car_right: type == 'car_right' ? req.body.file : null,
          tex_passport_front: type == 'tex_passport_front' ? req.body.file : null,
          tex_passport_back: type == 'tex_passport_back' ? req.body.file : null,
          talon_front: type == 'talon_front' ? req.body.file : null,
          talon_back: type == 'talon_back' ? req.body.file : null,
        })
      }
      res.send({
        success: true,
        message: model ? 'Info updated successfully' : 'Info created successfully',
        data: model || created_info
      })
    }
  }
  one = async (req, res) => {
    const model = await DriverInfo.findOne({
      where: {
        driver_id: req.query.id,
      }
    })
    res.send({
      success: true,
      message: 'One driver info',
      data: model
    })
  }
}

module.exports = new imageController;
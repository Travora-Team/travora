function createHotelProviderController(hotelService) {
  return {
    listHotels: async (req, res, next) => {
      try {
        const hotels = await hotelService.listHotels(req.query);
        res.json({ status: 'success', data: { hotels } });
      } catch (err) {
        next(err);
      }
    },

    getDashboard: async (req, res, next) => {
      try {
        const dashboard = await hotelService.getHotelDashboard({
          providerId: req.query.providerId,
          userId: req.query.userId,
        });
        res.json({ status: 'success', data: dashboard });
      } catch (err) {
        next(err);
      }
    },

    createRoomType: async (req, res, next) => {
      try {
        const roomType = await hotelService.createRoomTypeForHotel(req.body);
        res.status(201).json({
          status: 'success',
          message: 'تمت إضافة الغرفة / الجناح وتحديث المخزون الفندقي بنجاح.',
          data: { roomType },
        });
      } catch (err) {
        next(err);
      }
    },

    updateHotelStatus: async (req, res, next) => {
      try {
        const hotel = await hotelService.updateHotelStatus(req.params.id, req.body.status);
        res.json({ status: 'success', message: 'تم تحديث حالة الفندق بنجاح.', data: { hotel } });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = createHotelProviderController;

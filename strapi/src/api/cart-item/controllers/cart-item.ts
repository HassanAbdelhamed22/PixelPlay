"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::cart-item.cart-item",
  ({ strapi }) => ({
    async create(ctx) {
      const { user, game, quantity } = ctx.request.body.data;

      if (!user || !game || !quantity) {
        return ctx.badRequest(
          "Missing required fields: user, game, or quantity"
        );
      }

      // Check for existing cart item for the same user and game
      const existingItem = await strapi.entityService.findMany(
        "api::cart-item.cart-item",
        {
          filters: {
            user: { id: user },
            game: { id: game },
          },
          pagination: { limit: 1 },
        }
      );

      if (existingItem.length > 0) {
        // Update quantity of existing item
        const updatedItem = await strapi.entityService.update(
          "api::cart-item.cart-item",
          existingItem[0].id,
          {
            data: {
              quantity: existingItem[0].quantity + (quantity || 1),
            },
          }
        );
        return { data: updatedItem, meta: {} };
      }

      // Create new cart item if none exists
      const newItem = await strapi.entityService.create(
        "api::cart-item.cart-item",
        {
          data: {
            user,
            game,
            quantity: quantity || 1,
            publishedAt: new Date(),
          },
        }
      );

      return { data: newItem, meta: {} };
    },
  })
);

const axios = require("axios");
const { Op } = require("sequelize");
const { Category, Product } = require("../db");

async function getProductDb() {
  return await Product.findAll();
}

async function getProductsWithCategories() {
  return await Product.findAll({
    include: {
      model: Category,
      through: {
        attributes: [],
      },
    },
  });
}

async function getProductById(id) {
  const product = await Product.findByPk(id, {
    include: {
      model: Category,
      through: { attributes: [] },
    },
  });
  return product;
}

async function searchByQuery(name) {
  const result = await Product.findAll({
    where: {
      name: {
        [Op.iLike]: "%" + name + "%",
      },
    },
    include: {
      model: Category,
      through: {
        attributes: [],
      },
    },
  });
  return result;
}

module.exports = {
  getProductDb,
  getProductsWithCategories,
  getProductById,
  searchByQuery,
};

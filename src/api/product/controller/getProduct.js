const api = require("../../../lib/WooCommerceRestApi");

const getProduct = async (req, res) => {
  try {
    const response = await api.get("products");
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch products from WooCommerce." });
  }
};

module.exports = {
  getProduct,
};

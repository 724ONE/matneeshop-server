const api = require("../../../lib/WooCommerceRestApi");

const tetsingAttribute = async (req, res) => {
  try {
    const { attribute, term } = req.query;

    if (!attribute || !term) {
      return res
        .status(400)
        .json({ error: "Missing attribute, term, or attributeName." });
    }

    const response = await api.get("products", {
      params: {
        attribute,
        attribute_term: term,
      },
    });

    const filteredProducts = response.data.filter((product) =>
      product.attributes?.some((attr) => attr.name === attribute)
    );

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch products from WooCommerce." });
  }
};

module.exports = {
  tetsingAttribute,
};

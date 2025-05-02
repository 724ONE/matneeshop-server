const api = require("../../../lib/WooCommerceRestApi");

const filterOnCategory = async (req, res) => {
  try {
    const { categoryName, minPrice, maxPrice, type } = req.query;

    const categories = await api.get("products/categories");

    const category = categories.data.find(
      (cat) => cat?.name?.toLowerCase() === categoryName?.toLowerCase()
    );

    const response = await api.get("products", {
      category: category?.id,
      per_page: 100,
    });

    let products = response.data;

    if (minPrice || maxPrice) {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;

      products = products.filter((product) => {
        const price = parseFloat(product?.price);
        return !isNaN(price) && price >= min && price <= max;
      });
    }

    if (type) {
      products = products.filter((product) => product.type === type);
    }

    res.json(products);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch products from WooCommerce." });
  }
};

module.exports = {
  filterOnCategory,
};

const db = require("../config/db");
const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const { jwtSecretKey } = require("../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ status: false, message: "Password is required" });
  }

  try {
    const findUser = "SELECT * FROM users WHERE email=?";
    const resultUser = await dbQueryAsync(findUser, [email]);

    if (resultUser.length === 0) {
      return res.status(401).json({ status: false, message: "User not found" });
    }

    const singleUser = resultUser[0];

    if (singleUser.user_type === "admin") {
      return res.status(403).json({ status: false, message: "Access denied" });
    }

    const isPasswordMatch = await bcrypt.compare(password, singleUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: singleUser.id }, jwtSecretKey, { expiresIn: '1h' });
    return res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
      data: singleUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: false, message: "An error occurred during login" });
  }
};

exports.register = async (req, res) => {
  const { 
    email, 
    password, 
    userType, 
    name, 
    contact_number, 
    address, 
    city, 
    state, 
    country, 
    postal_code, 
    productDetails
  } = req.body;

  if (!email) {
    return res.status(400).json({
      status: false,
      message: "Email is required",
    });
  }

  const emailReg = /^([a-zA-Z\d\.-]+)@([a-zA-Z\.-]+)\.([a-zA-Z]{2,8})([a-zA-Z]{2,8})?$/;

  if (!email.match(emailReg)) {
    return res.status(400).json({
      status: false,
      message: "Please enter a valid email address",
    });
  }

  if (!password) {
    return res.status(400).json({
      status: false,
      message: "Password is required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userCheckQuery = "SELECT * FROM users WHERE email=?";
    const userInfo = await dbQueryAsync(userCheckQuery, [email]);

    if (userInfo.length > 0) {
      return res.status(409).json({
        status: false,
        message: "Email already registered",
      });
    }

    const addUserQuery = "INSERT INTO users(email, password, user_type) VALUES(?, ?, ?)";
    await dbQueryAsync(addUserQuery, [email, hashedPassword, userType]);

    const getUserIdQuery = "SELECT id FROM users WHERE email=?";
    const userIdResult = await dbQueryAsync(getUserIdQuery, [email]);
    const userId = userIdResult[0].id;

    if (userType === "buyer") {
      const addBuyerQuery = `
        INSERT INTO buyers(
          user_id, 
          name, 
          contact_number, 
          address, 
          city, 
          state, 
          country, 
          postal_code
        ) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
      await dbQueryAsync(addBuyerQuery, [
        userId, 
        name, 
        contact_number, 
        address, 
        city, 
        state, 
        country, 
        postal_code 
      ]);
    } else if (userType === "seller") {
      const addSellerQuery = `
        INSERT INTO sellers(
          user_id, 
          name, 
          contact_number, 
          address, 
          city, 
          state, 
          country, 
          postal_code, 
          productDetails
        ) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await dbQueryAsync(addSellerQuery, [
        userId, 
        name, 
        contact_number, 
        address, 
        city, 
        state, 
        country, 
        postal_code, 
        productDetails
      ]);
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid user type",
      });
    }

    res.status(201).json({
      status: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred during registration",
    });
  }
};

exports.addProduct = async (req, res) => {
  const { seller_id, name, category_id, description, price, stock, quality_verified, verification_date, verification_id } = req.body;

  
  if (!seller_id || !name || !category_id || !description || !price || !stock || quality_verified === undefined) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  try {
  
    const findProduct = "SELECT * FROM products WHERE product_name=?";
    const resultProduct = await dbQueryAsync(findProduct, [name]);
    if (resultProduct.length > 0) {
      return res.status(409).json({
        status: false,
        message: "Product is already registered",
      });
    }

  
    const insertProduct = `
      INSERT INTO products (
        seller_id, 
        product_name, 
        category_id, 
        description, 
        price, 
        stock, 
        quality_verified, 
        verification_date, 
        verification_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertResult = await dbQueryAsync(insertProduct, [
      seller_id, 
      name, 
      category_id, 
      description, 
      price, 
      stock, 
      quality_verified, 
      verification_date || null, 
      verification_id || null
    ]);

    if (insertResult.affectedRows > 0) {
      return res.status(201).json({
        status: true,
        message: "Product has been successfully added",
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to add product",
      });
    }
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while adding the product",
    });
  }
};

exports.getRecommendations = async (req, res) => {
  const { user_id } = req.params;

  try {
    const getRecommendationsQuery = `
      SELECT DISTINCT p.*
      FROM products p
      JOIN user_activity ua ON p.id = ua.product_id
      WHERE ua.user_id = ?
      ORDER BY ua.timestamp DESC
      LIMIT 5
    `;
    const recommendations = await dbQueryAsync(getRecommendationsQuery, [user_id]);

    res.status(200).json({
      status: true,
      message: "Recommendations fetched successfully",
      data: recommendations,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({ status: false, message: "An error occurred while fetching recommendations" });
  }
};

exports.createSupportQuery = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const addQuery = "INSERT INTO support_queries (name, email, message) VALUES (?, ?, ?)";
    const result = await dbQueryAsync(addQuery, [name, email, message]);

    res.status(201).json({
      status: true,
      message: "Support query submitted successfully",
      data: {
        id: result.insertId,
        name,
        email,
        message,
      }
    });
  } catch (error) {
    console.error("Create support query error:", error);
    res.status(500).json({ status: false, message: "An error occurred while submitting the support query" });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const getAllProductsQuery = "SELECT * FROM products";
    const products = await dbQueryAsync(getAllProductsQuery);
    res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ status: false, message: "An error occurred while fetching products" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const getAllCategoriesQuery = "SELECT * FROM categories";
    const categories = await dbQueryAsync(getAllCategoriesQuery);
    res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({ status: false, message: "An error occurred while fetching categories" });
  }
};

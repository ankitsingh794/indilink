exports.table = [
  {
    tableName: "users",
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        user_type ENUM('buyer', 'seller') NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `,
  },
  {
    tableName: "sellers",
    query: `
      CREATE TABLE IF NOT EXISTS sellers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NULL,
        address TEXT NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        country VARCHAR(100) NULL,
        postal_code VARCHAR(10) NULL,
        registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `,
  },
  {
    tableName: "buyers",
    query: `
      CREATE TABLE IF NOT EXISTS buyers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NULL,
        address TEXT NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        country VARCHAR(100) NULL,
        postal_code VARCHAR(10) NULL,
        registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `,
  },
  {
    tableName: "categories",
    query: `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `,
  },
  {
    tableName: "products",
    query: `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        category_id INT NULL,
        description TEXT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        quality_verified BOOLEAN NOT NULL DEFAULT FALSE,
        verification_date TIMESTAMP NULL,
        verification_id TEXT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES sellers(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `,
  },
  {
    tableName: "transactions",
    query: `
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        buyer_id INT NOT NULL,
        seller_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES buyers(id),
        FOREIGN KEY (seller_id) REFERENCES sellers(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `,
  },
  {
    tableName: "reviews",
    query: `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        buyer_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review_title VARCHAR(255) NULL,
        review TEXT NULL,
        review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (buyer_id) REFERENCES buyers(id)
      );
    `,
  },
  {
    tableName: "shipping_info",
    query: `
      CREATE TABLE IF NOT EXISTS shipping_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id INT NOT NULL,
        shipping_address TEXT NOT NULL,
        shipping_cost DECIMAL(10, 2) NOT NULL,
        shipping_date TIMESTAMP NULL,
        delivery_date TIMESTAMP NULL,
        tracking_number VARCHAR(255) NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id)
      );
    `,
  },
  {
    tableName: "support_queries",
    query: `
      CREATE TABLE IF NOT EXISTS support_queries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
];



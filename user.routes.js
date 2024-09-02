const router = require("express").Router();
const userCtrl = require("../controller/user.controller");

router.get("/", (req, res) => {
  res.send({ status: true, message: "Server is up" });
});

router.post("/login", userCtrl.login);
router.post("/register", userCtrl.register);
router.post("/add-product", userCtrl.addProduct);
router.post("/recommendations", userCtrl.getRecommendations);
router.post("/support", userCtrl.createSupportQuery);
router.get("/products", userCtrl.getAllProducts);
router.get("/categories", userCtrl.getAllCategories);

module.exports = router;

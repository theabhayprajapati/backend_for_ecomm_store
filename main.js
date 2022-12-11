// const app = require('express')()
import bcrypt from 'bcrypt'
import cors from 'cors'
import crypto from 'crypto'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { join } from 'path'
import Razorpay from 'razorpay'
import { generate } from 'shortid'
import { Admin, Order, Product, User } from './models/user.model.js'
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET
})

app.get('/logo.svg', (req, res) => {
	res.sendFile(join(__dirname, 'logo.svg'))
})

app.post('/verification', (req, res) => {
	// do a validation
	const secret = '12345678'
	console.log(req.body)
	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')
	console.log(digest, req.headers['x-razorpay-signature'])

	// what is happing tell here?
	// we are creating a hash of the body of the request
	// and comparing it with the x-razorpay-signature header
	// if they match, then only we are processing the request further
	// else we are passing it
	/* ok done. */

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		/* deduct one quantity of the prodcut from the  */
		/* inventory */
		/* add the order to the orders array of the user */
		/* send a mail to the user */
		/* send a mail to the admin */

		/* ok done. */
		/* Order */
		const order = new Order({
			id: "__order" + generate(),
			amount: req.body.payload.payment.entity.amount,
			currency: req.body.payload.payment.entity.currency,
			receipt: req.body.payload.payment.entity.receipt,
			status: req.body.payload.payment.entity.status,
			method: req.body.payload.payment.entity.method,
			createdAt: req.body.payload.payment.entity.created_at,
			/* user */
			user: {
				id: req.body.payload.payment.entity.notes.user.id,
				name: req.body.payload.payment.entity.notes.user.name,
				email: req.body.payload.payment.entity.notes.user.email,
				phone: req.body.payload.payment.entity.notes.user.phone
			},
			/* product */
			product: {
				id: req.body.payload.payment.entity.notes.product.id,
				name: req.body.payload.payment.entity.notes.product.name,
				price: req.body.payload.payment.entity.notes.product.price,
				quantity: req.body.payload.payment.entity.notes.product.quantity
			}
		})
		/* ok done. */
		/* User */
		User.findOneAndUpdate(
			{ id: req.body.payload.payment.entity.notes.user.id },
			{ $push: { orders: order } },
			{ new: true }
		)
			.then((user) => {
				console
			})
			.catch((err) => {
				console.log(err)
			})
		/* ok done. */
		/* Product */
		Product.findOneAndUpdate(
			{ id: req.body.payload.payment.entity.notes.product.id },
			{ $inc: { quantity: -1 } },
			{ new: true }
		)
			.then((product) => {
				console.log(product)
			})
			.catch((err) => {
				console.log(err)
			})
		/* ok done. */
		/* Admin */
		Admin.findOneAndUpdate(
			{ id: "__admin" + generate() },
			{ $push: { orders: order } },
			{ new: true }
		)
			.then((admin) => {
				console.log(admin)
			})
			.catch((err) => {
				console.log(err)
			})
		/* ok done. */


		res.json({ status: 'ok' })
	} else {
		res.status(400).json({ status: 'error', error: 'Invalid signature' })
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = 499
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.post("/createuser", (req, res) => {
	const { name, email, phone, password } = req.body
	const encryptedPassword = bcrypt.hashSync(password, 10)
	const user = new User({
		id: "__user" + generate(),
		name,
		email,
		phone,
		password: encryptedPassword
	})
	user.save()
		.then((user) => {
			res.status(200).json({ message: "user created successfully" })
		})
		.catch((err) => {
			res.status(500).json({ message: "error creating user", error: err })
			console.log(err)
		})
})

/* login */
app.post("/login", (req, res) => {
	const { email, password } = req.body
	User.findOne
		({ email })
		.then((user) => {
			if (user) {
				const isPasswordCorrect = bcrypt.compareSync(password, user.password)
				if (isPasswordCorrect) {
					const token = jwt.sign({
						_id: user._id
					},
						"secret")
					res.status(200).json({ message: "login successful", token })
				} else {
					res.status(401).json({ message: "invalid credentials" })
				}
			} else {
				res.status(401).json({ message: "invalid credentials" })
			}
		})
		.catch((err) => {
			res.status(500).json({ message: "error login in user", error: err })
			console.log(err)
		})
})
/* user */

/* admin */
/* The Admin should have a dashboard to Add/ Update/ Delete a product and manage the inventory */

/* admin signin */

app.post("/adminsignin", (req, res) => {
	const { email, password, name, phone, storeName } = req.body
	const encryptedPassword = bcrypt.hashSync(password, 10)
	const admin = new Admin({
		id: "__admin" + generate(),
		name,
		email,
		phone,
		password: encryptedPassword,
		storeName,
		accountType: "admin"
	})
	/* sample
		
	*/
	admin.save()
		.then((admin) => {
			res.status(200).json({ message: "admin created successfully" })
		})
		.catch((err) => {
			res.status(500).json({ message: "error creating admin", error: err })
			console.log(err)
		})
})

/* adminlogin */
app.post("/adminlogin", (req, res) => {
	const { email, password } = req.body
	Admin.findOne
		({ email })
		.then((admin) => {
			if (admin) {
				const isPasswordCorrect = bcrypt.compareSync(password, admin.password)
				if (isPasswordCorrect) {
					const token = jwt.sign({
						_id: admin._id
					},
						"secret")
					res.status(200).json({ message: "login successful", token })
				} else {
					res.status(401).json({ message: "invalid credentials" })
				}
			} else {
				res.status(401).json({ message: "invalid credentials" })
			}
		})
		.catch((err) => {
			res.status(500).json({ message: "error login in admin", error: err })
			console.log(err)
		})
})

/* admin add products*/
app.post("/addproduct", (req, res) => {
	const { adminId, adminName, title, price, description, image, quantity } = req.body
	const product = new Product({
		id: "__product" + generate(),
		title,
		price,
		adminId,
		adminName,
		description,
		image,
		quantity
	})

	Admin.findOneAndUpdate({ id: adminId }, { $push: { inventory: product } })
		.then((admin) => {
			console.log("product added to admin account")
			console.log(admin)
		})
		.catch((err) => {
			console.log("error adding product to admin account")
			console.log(err)
		})

	product.save()
		.then((product) => {
			res.status(200).json({ message: "product created successfully" })
		})
		.catch((err) => {
			res.status(500).json({ message: "error creating product", error: err })
		})
})


/* edit  */
app.post("/editproduct", (req, res) => {
	const { adminId, adminName, title, price, description, image, quantity, productId } = req.body


	Product.findOne({ id: productId })
		.then((product) => {
			if (product) {
				product.title = title
				product.price = price
				product.description = description
				product.image = image
				product.quantity = quantity

				// update the product in admin account
				Admin.findOneAndUpdate({ id: adminId }, { $pull: { inventory: { id: productId } } })
					.then((admin) => {
						console.log("product removed from admin account")
						console
					})
					.catch((err) => {
						console.log("error removing product from admin account")
						console.log(err)
					})

				Admin.findOneAndUpdate({ id: adminId }, { $push: { inventory: product } })
					.then((admin) => {
						console.log("product added to admin account")
						console
					})
					.catch((err) => {
						console.log("error adding product to admin account")
						console.log(err)
					})

				product.save()
					.then((product) => {
						res.status(200).json({ message: "product updated successfully" })
					})
					.catch((err) => {
						res.status(500).json({ message: "error updating product", error: err })
					})
			} else {
				res.status(404).json({ message: "product not found" })
			}
		})
		.catch((err) => {
			res.status(500).json({ message: "error updating product", error: err })
		})
})


/* remove*/

app.post("/removeproduct", (req, res) => {
	const { adminId, productId } = req.body

	Product.findOne({ id: productId })
		.then((product) => {
			if (product) {
				// remove the product from admin account
				Admin.findOneAndUpdate({ id: adminId }, { $pull: { inventory: { id: productId } } })
					.then((admin) => {
						console.log("product removed from admin account")
						console
					})
					.catch((err) => {
						console.log("error removing product from admin account")
						console.log(err)
					})
				product.remove()
					.then(() => {
						res.status(200).json({ message: "product removed successfully" })
					})
					.catch((err) => {
						res.status(500).json({ message: "error removing product", error: err })
					})

			} else {
				res.status(404).json({ message: "product not found" })
			}

		})
		.catch((err) => {
			res.status(500).json({ message: "error removing product", error: err })
		})
})

/* get all products */
app.get("/products", (req, res) => {
	Product.find()
		.then((products) => {
			res.status(200).json({ products })
		})
		.catch((err) => {
			res.status(500).json({ message: "error getting products", error: err })
		})
})

/* get all products of a store */
app.get("/products/:adminId", (req, res) => {
	const { adminId } = req.params

	Admin.findOne
		({ id: adminId })
		.then((admin) => {
			if (admin) {
				res.status(200).json({ products: admin.inventory })
			} else {
				res.status(404).json({ message: "admin not found" })
			}
		})
		.catch((err) => {
			res.status(500).json({ message: "error getting products", error: err })
		})
})

/* get a product */
app.get("/product/:productId", (req, res) => {
	const { productId } = req.params

	Product.findOne({ id: productId })
		.then((product) => {
			if (product) {
				res.status(200).json({ product })
			} else {
				res.status(404).json({ message: "product not found" })
			}
		})
		.catch((err) => {
			res.status(500).json({ message: "error getting product", error: err })
		})
})


app.listen(1337, () => {
	console.log('Listening on 1337')
	// connect
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
		.then(() => {
			console.log('Connected to database')
		}
		)
		.catch((err) => {
			console.log(err)
		})
})


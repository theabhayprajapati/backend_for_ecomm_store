import mongoose from 'mongoose'

// inventory
const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    /* admin id */
    adminId: {
        type: String,
        required: true
    },
    /* admin name */
    adminName: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },

}
)

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    productprice: {
        type: Number,
        required: true
    },
    productquantity: {
        type: Number,
        required: true
    },
    productstatus: {
        /* default procced */
        type: String,
        required: true,
        default: "processed"
        /* 
            1. pending
            2. processing
            3. shipped
            4. delivered
            5. cancelled
        */
    },
    date: {
        type: Date,
        default: Date.now
    },
    /* admin id */
    adminId: {
        type: String,
        required: true
    },
    /* admin name */
    adminName: {
        type: String,
        required: true
    },
    /* user id */
    userId: {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },

    email: {
        unique: true,
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
})

/* admin */

const adminSchema = new mongoose.Schema({
    /* id */
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    phone: {
        unique: true,
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    /* inventory */
    inventory: {
        type: [productSchema],
        default: []
    },
    /* orders */
    orders: {
        type: [orderSchema],
        default: []
    }
})

/* xport */
export const User = mongoose.model('User', userSchema)
export const Admin = mongoose.model('Admin', adminSchema)
export const Product = mongoose.model('Product', productSchema)
export const Order = mongoose.model('Order', orderSchema)
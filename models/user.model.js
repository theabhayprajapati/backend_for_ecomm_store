import mongoose from 'mongoose'

// inventory
const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    /* admin id */
    adminId: {
        type: String,
        required: true,
        sparse: true
    },
    /* admin name */
    adminName: {
        type: String,
        required: true,
        sparse: true
    },

    title: {
        type: String,
        required: true,
        sparse: true
    },
    price: {
        type: Number,
        required: true,
        sparse: true
    },
    quantity: {
        type: Number,
        required: true,
        sparse: true
    },
    description: {
        type: String,
        required: false,
        sparse: true
    },
    image: {
        type: String,
        required: false,
        sparse: true
    },

}
)

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    productName: {
        type: String,
        required: true,
        sparse: true
    },
    productprice: {
        type: Number,
        required: true,
        sparse: true
    },
    productquantity: {
        type: Number,
        required: true,
        sparse: true
    },
    productstatus: {
        /* default procced */
        type: String,
        required: true,
        default: "processed",
        sparse: true
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
        sparse: true,
        required: true
    },
    /* admin name */
    adminName: {
        type: String,
        sparse: true,
        required: true
    },
    /* user id */
    userId: {
        type: String,
        sparse: true,
        required: true,
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
    }, email: {
        unique: true,
        type: String,
        required: true
    }, password: {
        type: String,
        required: true
    }, phone: {
        type: String,
        required: true
    },
    name: {
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

    accountType: {
        type: String,
        required: true
    },

    /* inventory */
    inventory: {
        type: [productSchema],
        sparse: true,
        required: false,
    },
    /* orders */
    orders: {
        type: [orderSchema],
        sparse: true,
        required: false,
    }
})

/* xport */
export const User = mongoose.model('User', userSchema)
export const Admin = mongoose.model('Admin', adminSchema)
export const Product = mongoose.model('Product', productSchema)
export const Order = mongoose.model('Order', orderSchema)
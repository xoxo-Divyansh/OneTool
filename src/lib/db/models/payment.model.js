payments = {
  _id: ObjectId,

  userId: ObjectId,

  provider: "razorpay" | "stripe" | "paypal",

  amount: Number,
  currency: "INR",

  status: "success" | "failed" | "pending",

  transactionId: String,

  createdAt: Date
}